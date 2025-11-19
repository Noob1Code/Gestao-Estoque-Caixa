/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.service;

import com.gestao.back.dto.MovimentoEstoqueRequestDTO;
import com.gestao.back.dto.ProdutoRequestDTO;
import com.gestao.back.dto.ProdutoResponseDTO;
import com.gestao.back.model.entities.ItemVenda;
import com.gestao.back.model.entities.MovimentoEstoque;
import com.gestao.back.model.entities.Produto;
import com.gestao.back.model.entities.Usuario;
import com.gestao.back.model.enums.TipoMovimento;
import com.gestao.back.model.exceptions.BadRequestException;
import com.gestao.back.model.exceptions.ConflictException;
import com.gestao.back.model.exceptions.NotFoundException;
import com.gestao.back.model.repositories.ItemVendaRepository;
import com.gestao.back.model.repositories.MovimentoEstoqueRepository;
import com.gestao.back.model.repositories.ProdutoRepository;
import com.gestao.back.model.repositories.UsuarioRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Kayqu
 */
@Service
public class ProdutoServiceImpl {

    @Autowired
    private ItemVendaRepository itemVendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentoEstoqueRepository movimentoEstoqueRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditoriaService auditoriaService;

    @Transactional(readOnly = true)
    public List<ProdutoResponseDTO> listarTodos(Boolean ativo) {
        List<Produto> produtos;
        if (ativo != null) {
            produtos = produtoRepository.findAllByAtivo(ativo);
        } else {
            produtos = produtoRepository.findAll();
        }
        return produtos.stream()
                .map(ProdutoResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoResponseDTO buscarPorId(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        return new ProdutoResponseDTO(produto);
    }

    @Transactional
    public ProdutoResponseDTO criarProduto(ProdutoRequestDTO dto) {
        if (produtoRepository.findByCodigo(dto.getCodigo()).isPresent()) {
            throw new ConflictException("Código já cadastrado");
        }
        if (dto.getPrecoUnitario().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Preço unitario não pode ser negativo");
        }
        if (dto.getQuantidadeEstoque() < 0) {
            throw new BadRequestException("Quantidade não pode ser negativa");
        }

        Produto produto = new Produto();
        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setCategoria(dto.getCategoria());
        produto.setPrecoUnitario(dto.getPrecoUnitario());
        produto.setQuantidadeEstoque(dto.getQuantidadeEstoque());
        produto.setAtivo(true);

        Produto produtoSalvo = produtoRepository.save(produto);

        auditoriaService.registrar("Produtos","CREATE",null,produtoSalvo,produtoSalvo.getId());

        return new ProdutoResponseDTO(produtoSalvo);
    }

    @Transactional
    public ProdutoResponseDTO atualizarProduto(Long id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        if (dto.getPrecoUnitario().compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Preço unitario não pode ser negativo");
        }

        Produto produtoAntes = cloneProduto(produtoRepository.getReferenceById(id));

        produto.setCodigo(dto.getCodigo());
        produto.setNome(dto.getNome());
        produto.setCategoria(dto.getCategoria());
        produto.setPrecoUnitario(dto.getPrecoUnitario());
        produto.setAtivo(dto.isAtivo());

        Produto produtoAtualizado = produtoRepository.save(produto);

        auditoriaService.registrar("Produtos","UPDATE",produtoAntes,produtoAtualizado,id);

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    @Transactional
    public void deletarProduto(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        if (produto.getQuantidadeEstoque() != 0) {
            throw new ConflictException("Produto não pode ser deletado pois esta em estoque");
        }

        if(!produtoRepository.getReferenceById(id).isAtivo()) {
            throw new BadRequestException("Produto precisa estar desativado para ser deletado");
        }
        
        List<ItemVenda> itensVenda = itemVendaRepository.findAllByProdutoId(id);
        for (ItemVenda item : itensVenda) {
            item.setProduto(null);
            itemVendaRepository.save(item);
        }

        List<MovimentoEstoque> movimentos = movimentoEstoqueRepository.findAllByProdutoId(id);
        for (MovimentoEstoque movimento : movimentos) {
            movimento.setProduto(null);
            movimentoEstoqueRepository.save(movimento);
        }

        Produto produtoAntes = cloneProduto(produtoRepository.getReferenceById(id));

        auditoriaService.registrar("Produtos","DELETE",produtoAntes,null,id);

        produtoRepository.delete(produto);
    }

    @Transactional
    public ProdutoResponseDTO movimentarEstoque(Long idProduto, MovimentoEstoqueRequestDTO dto) {

        Produto produto = produtoRepository.findById(idProduto)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado (ID: " + idProduto + ")"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado (ID: " + dto.getUsuarioId() + ")"));

        TipoMovimento tipo = dto.getTipo();
        int quantidadeMovimentada = dto.getQuantidade();

        if (!tipo.equals(TipoMovimento.ENTRADA) && !tipo.equals(TipoMovimento.AJUSTE)) {
            throw new BadRequestException("Tipo de movimento inválido. Use 'ENTRADA' ou 'AJUSTE'.");
        }

        if (tipo.equals(TipoMovimento.ENTRADA) && quantidadeMovimentada <= 0) {
            throw new BadRequestException("Para ENTRADA, a quantidade deve ser positiva.");
        }
        if (quantidadeMovimentada == 0) {
            throw new BadRequestException("A quantidade da movimentação não pode ser zero.");
        }

        int estoqueAtual = produto.getQuantidadeEstoque();
        int novoEstoque = estoqueAtual + quantidadeMovimentada;

        if (novoEstoque < 0) {
            throw new RuntimeException("Estoque não pode ficar negativo. (Estoque Atual: " + estoqueAtual + ", Tentativa de Ajuste: " + quantidadeMovimentada + ")");
        }

        MovimentoEstoque movimento = new MovimentoEstoque();
        movimento.setProduto(produto);
        movimento.setUsuario(usuario);
        movimento.setTipo(tipo);
        movimento.setQuantidade(quantidadeMovimentada);
        movimento.setData(LocalDateTime.now());
        movimento.setMotivo(verificaMotivo(dto.getTipo(),dto.getMotivo(), dto.getQuantidade()));
        movimento.setNomeProduto(produto.getNome());
        movimentoEstoqueRepository.save(movimento);

        produto.setQuantidadeEstoque(novoEstoque);
        Produto produtoAtualizado = produtoRepository.save(produto);

        return new ProdutoResponseDTO(produtoAtualizado);
    }

    public String verificaMotivo(TipoMovimento tipoMovimento, String motivo, int quantidade) {
        if(motivo == null) {
            switch (tipoMovimento) {
                case ENTRADA:
                    return "Reposição de estoque ";
                case AJUSTE:
                    if(quantidade <= 0){
                        return "Remoção por vencimento ou defeito do produto";
                    }else{
                        return "Devolução do produto";
                    }
                default:
            }
        }
        return motivo;

    }

    private Produto cloneProduto(Produto origem) {
        Produto clone = new Produto();
        clone.setId(origem.getId());
        clone.setCodigo(origem.getCodigo());
        clone.setNome(origem.getNome());
        clone.setCategoria(origem.getCategoria());
        clone.setQuantidadeEstoque(origem.getQuantidadeEstoque());
        clone.setPrecoUnitario(origem.getPrecoUnitario());
        clone.setAtivo(origem.isAtivo());
        return clone;
    }
}
