package com.gestao.back.model.entities;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "Produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotBlank(message = "Nome é obrigatorio")
    @Column(nullable = false)
    private String codigo;

    @NotBlank(message = "Nome é obrigatorio")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "Categoria é obrigatorio")
    @Column(nullable = false)
    private String categoria;

    @NotNull(message = "Quantidade é obrigatorio")
    @Min(value = 0, message = "Quantidade não pode ser negativa")
    @Column(nullable = false)
    private int quantidadeEstoque;

    @NotNull(message = "Preço é obrigatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "Preço não pode ser negativo")
    @Column(nullable = false)
    private BigDecimal precoUnitario;

    @Column
    private boolean ativo;

    @OneToMany(
            mappedBy = "produto",
            fetch = FetchType.LAZY
    )
    private Set<MovimentoEstoque> movimentos = new HashSet<>();


    public Produto() {

    }

    public Produto(String categoria, long id, String codigo, String nome, BigDecimal preco, int quantidadeEstoque, boolean ativo) {
        this.categoria = categoria;
        this.id = id;
        this.codigo = codigo;
        this.nome = nome;
        this.precoUnitario = preco;
        this.quantidadeEstoque = quantidadeEstoque;
        this.ativo = ativo;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
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

    public int getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(int quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }

    public String getCodigo() {
        return codigo;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

}
