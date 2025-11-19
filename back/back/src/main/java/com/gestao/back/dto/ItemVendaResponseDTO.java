/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.dto;

import com.gestao.back.model.entities.ItemVenda;
import java.math.BigDecimal;

/**
 *
 * @author Kayqu
 */
public class ItemVendaResponseDTO {

    private String nomeProduto;
    private Integer quantidade;
    private BigDecimal precoUnitario;

    public ItemVendaResponseDTO() {
    }

    public ItemVendaResponseDTO(ItemVenda itemVenda) {
        this.nomeProduto = itemVenda.getNomeProduto(); //nova linha
        this.quantidade = itemVenda.getQuantidade();
        this.precoUnitario = itemVenda.getPrecoUnitario();
    }

    public String getNomeProduto() {
        return nomeProduto;
    }

    public void setNomeProduto(String nomeProduto) {
        this.nomeProduto = nomeProduto;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public BigDecimal getPrecoUnitario() {
        return precoUnitario;
    }

    public void setPrecoUnitario(BigDecimal precoUnitario) {
        this.precoUnitario = precoUnitario;
    }
}
