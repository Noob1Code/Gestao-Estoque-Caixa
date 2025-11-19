/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.service;

import com.gestao.back.dto.ItemVendaRequestDTO;
import com.gestao.back.dto.VendaRequestDTO;
import com.gestao.back.dto.VendaResponseDTO;
import com.gestao.back.model.entities.ItemVenda;
import com.gestao.back.model.entities.MovimentoEstoque;
import com.gestao.back.model.entities.Produto;
import com.gestao.back.model.entities.Usuario;
import com.gestao.back.model.entities.Venda;
import com.gestao.back.model.enums.TipoMovimento;
import com.gestao.back.model.exceptions.BadRequestException;
import com.gestao.back.model.exceptions.NotFoundException;
import com.gestao.back.model.repositories.MovimentoEstoqueRepository;
import com.gestao.back.model.repositories.ProdutoRepository;
import com.gestao.back.model.repositories.UsuarioRepository;
import com.gestao.back.model.repositories.VendaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Kayqu
 */

@Service
public class VendaServiceImpl {

    @Autowired
    private VendaRepository vendaRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository; 

    @Autowired
    private MovimentoEstoqueRepository movimentoEstoqueRepository; 

    @Transactional
    public VendaResponseDTO registrarVenda(VendaRequestDTO dto) {

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new NotFoundException("Usuário (Operador) não encontrado"));

        BigDecimal troco = dto.getValorRecebido().subtract(dto.getTotal());
        if (troco.compareTo(BigDecimal.ZERO) < 0) {
             throw new BadRequestException("Valor recebido é menor que o total da venda.");
        }

        Venda venda = new Venda();
        venda.setUsuario(usuario);
        venda.setDataVenda(LocalDateTime.of(
                LocalDate.now(),
                LocalTime.now().withMinute(0).withSecond(0).withNano(0)
        ));
        venda.setTotal(dto.getTotal());
        venda.setValorRecebido(dto.getValorRecebido());
        venda.setTroco(troco);

       Set<ItemVenda> itensParaSalvar = new HashSet<>();
        
        for (ItemVendaRequestDTO itemDto : dto.getItens()) {
            
            Produto produto = produtoRepository.findById(itemDto.getProdutoId())
                    .orElseThrow(() -> new NotFoundException("Produto não encontrado: ID " + itemDto.getProdutoId()));

            if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                throw new BadRequestException("Estoque insuficiente para o produto: " + produto.getNome());
            }

            if (!produto.isAtivo()) {
                throw new BadRequestException("Produto inativo não pode ser vendido: " + produto.getNome());
            }

            int novoEstoque = produto.getQuantidadeEstoque() - itemDto.getQuantidade();
            produto.setQuantidadeEstoque(novoEstoque);
            produtoRepository.save(produto); 

            ItemVenda itemVenda = new ItemVenda();
            itemVenda.setProduto(produto);
            itemVenda.setQuantidade(itemDto.getQuantidade());
            itemVenda.setPrecoUnitario(itemDto.getPrecoUnitario());
            itemVenda.setNomeProduto(produto.getNome());
            
            venda.adicionarItem(itemVenda);
        }
        Venda vendaSalva = vendaRepository.save(venda);
        for (ItemVenda itemSalvo : vendaSalva.getItens()) {
            MovimentoEstoque movimento = new MovimentoEstoque();
            movimento.setProduto(itemSalvo.getProduto());
            movimento.setUsuario(usuario);
            movimento.setTipo(TipoMovimento.SAIDA_VENDA);
            movimento.setQuantidade(itemSalvo.getQuantidade() * -1);
            movimento.setData(vendaSalva.getDataVenda()); 
            movimento.setMotivo("Venda ID: " + vendaSalva.getId());
            movimento.setNomeProduto(itemSalvo.getNomeProduto());
            movimentoEstoqueRepository.save(movimento);
        }
        return new VendaResponseDTO(vendaSalva);
    }

    @Transactional(readOnly = true)
    public List<VendaResponseDTO> listarVendas(String dataInicioStr, String dataFimStr) {

        LocalDateTime inicio = null;
        LocalDateTime fim = null;

        // Converte as strings de data (YYYY-MM-DD) para LocalDateTime
        if (dataInicioStr != null && !dataInicioStr.isEmpty()) {
            inicio = LocalDate.parse(dataInicioStr).atStartOfDay(); // Ex: 2025-11-01T00:00:00
        }
        if (dataFimStr != null && !dataFimStr.isEmpty()) {
            fim = LocalDate.parse(dataFimStr).atTime(LocalTime.MAX); // Ex: 2025-11-07T23:59:59
        }

        List<Venda> vendas;

        // Lógica de busca
        if (inicio != null && fim != null) {
            vendas = vendaRepository.findByDataVendaBetween(inicio, fim, Sort.by(Sort.Direction.DESC, "dataVenda"));
        } else if (inicio != null) {
            vendas = vendaRepository.findByDataVendaGreaterThanEqual(inicio, Sort.by(Sort.Direction.DESC, "dataVenda"));
        } else if (fim != null) {
            vendas = vendaRepository.findByDataVendaLessThanEqual(fim, Sort.by(Sort.Direction.DESC, "dataVenda"));
        } else {
            // Nenhum filtro de data, busca todos
            vendas = vendaRepository.findAll(Sort.by(Sort.Direction.DESC, "dataVenda"));
        }

        // Converte Entidades para DTOs
        return vendas.stream()
                .map(VendaResponseDTO::new)
                .collect(Collectors.toList());
    }
}