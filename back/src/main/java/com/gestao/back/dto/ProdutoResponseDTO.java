/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.dto;

import com.gestao.back.model.entities.Produto;
import java.math.BigDecimal;

/**
 *
 * @author Kayqu
 */

public class ProdutoResponseDTO {
    
    private Long id;
    private String codigo;
    private String nome;
    private String categoria;
    private Integer quantidadeEstoque;
    private BigDecimal precoUnitario;
    private boolean ativo;

    public ProdutoResponseDTO() {
    }

    public ProdutoResponseDTO(Produto produto) {
        this.id = produto.getId();
        this.codigo = produto.getCodigo();
        this.nome = produto.getNome();
        this.categoria = produto.getCategoria();
        this.quantidadeEstoque = produto.getQuantidadeEstoque();
        this.precoUnitario = produto.getPrecoUnitario();
        this.ativo = produto.isAtivo();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public Integer getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(Integer quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }
}
