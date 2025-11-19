/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.dto;

import com.gestao.back.model.entities.Venda;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 *
 * @author Kayqu
 */
public class VendaResponseDTO {

    private Long id;
    private LocalDateTime dataVenda;
    private BigDecimal total;
    private BigDecimal valorRecebido;
    private BigDecimal troco;
    private String nomeOperador;
    private List<ItemVendaResponseDTO> itens;

    public VendaResponseDTO() {
    }

    public VendaResponseDTO(Venda venda) {
        this.id = venda.getId();
        this.dataVenda = venda.getDataVenda();
        this.total = venda.getTotal();
        this.valorRecebido = venda.getValorRecebido();
        this.troco = venda.getTroco();

        if (venda.getUsuario() != null) {
            this.nomeOperador = venda.getUsuario().getNomeCompleto();
        }

        this.itens = venda.getItens().stream()
                .map(ItemVendaResponseDTO::new)
                .collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDataVenda() {
        return dataVenda;
    }

    public void setDataVenda(LocalDateTime dataVenda) {
        this.dataVenda = dataVenda;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public BigDecimal getValorRecebido() {
        return valorRecebido;
    }

    public void setValorRecebido(BigDecimal valorRecebido) {
        this.valorRecebido = valorRecebido;
    }

    public BigDecimal getTroco() {
        return troco;
    }

    public void setTroco(BigDecimal troco) {
        this.troco = troco;
    }

    public String getNomeOperador() {
        return nomeOperador;
    }

    public void setNomeOperador(String nomeOperador) {
        this.nomeOperador = nomeOperador;
    }

    public List<ItemVendaResponseDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaResponseDTO> itens) {
        this.itens = itens;
    }
}
