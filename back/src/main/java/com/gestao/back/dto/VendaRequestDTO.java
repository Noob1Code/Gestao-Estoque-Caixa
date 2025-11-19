/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;

/**
 *
 * @author Kayqu
 */
public class VendaRequestDTO {

    @NotNull(message = "ID do Usuário é obrigatório")
    private Long usuarioId;

    @NotNull(message = "Lista de itens não pode ser nula")
    @Size(min = 1, message = "Venda deve ter ao menos 1 item")
    private List<ItemVendaRequestDTO> itens;

    @NotNull(message = "Valor recebido é obrigatório")
    @DecimalMin(value = "0.0", message = "Valor recebido não pode ser negativo")
    private BigDecimal valorRecebido;

    @NotNull(message = "Total é obrigatório")
    @DecimalMin(value = "0.0", message = "Total não pode ser negativo")
    private BigDecimal total;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public List<ItemVendaRequestDTO> getItens() {
        return itens;
    }

    public void setItens(List<ItemVendaRequestDTO> itens) {
        this.itens = itens;
    }

    public BigDecimal getValorRecebido() {
        return valorRecebido;
    }

    public void setValorRecebido(BigDecimal valorRecebido) {
        this.valorRecebido = valorRecebido;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
