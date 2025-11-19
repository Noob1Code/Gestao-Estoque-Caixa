package com.gestao.back.controllers;

import com.gestao.back.dto.MovimentoEstoqueRequestDTO;
import com.gestao.back.dto.ProdutoRequestDTO;
import com.gestao.back.dto.ProdutoResponseDTO;
import com.gestao.back.service.ProdutoServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@CrossOrigin(origins = "http://localhost:4200")
public class ProdutoController {

    @Autowired
    private ProdutoServiceImpl produtoService;


    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos(
            @RequestParam(required = false) Boolean ativo
    ) {
        return ResponseEntity.ok(produtoService.listarTodos(ativo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criarProduto(
            @Valid @RequestBody ProdutoRequestDTO dto
    ) {
        ProdutoResponseDTO novoProduto = produtoService.criarProduto(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoProduto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atulizarProduto(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequestDTO dto
    ) {
        ProdutoResponseDTO produtoAtualizado = produtoService.atualizarProduto(id, dto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("/movimentar/{id}")
    public ResponseEntity<ProdutoResponseDTO> movimentarEstoque(
            @PathVariable Long id,
            @Valid @RequestBody MovimentoEstoqueRequestDTO dto
    ) {
        produtoService.movimentarEstoque(id, dto);
        return ResponseEntity.ok(produtoService.buscarPorId(id));
    }
}
