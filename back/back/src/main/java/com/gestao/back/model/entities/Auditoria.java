package com.gestao.back.model.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Auditoria")
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tabela")
    private String tabela;

    @Column(name = "operacao")
    private String operacao;

    @Column(name = "registro_id")
    private Long registroId;

    @Column(name = "dados_antes",columnDefinition = "TEXT")
    private String dadosAntes;

    @Column(name = "dados_depois",columnDefinition = "TEXT")
    private String dadosDepois;

    @Column(name = "usuario")
    private String usuario;

    @Column(name = "data")
    private LocalDateTime data =  LocalDateTime.of(
            LocalDate.now(),
            LocalTime.now().withNano(0));

    public Auditoria() {
    }

    public Auditoria(Long id, String tabela, String operacao, Long registroId, String dadosAntes, String dadosDepois, String usuario, LocalDateTime data) {
        this.id = id;
        this.tabela = tabela;
        this.operacao = operacao;
        this.registroId = registroId;
        this.dadosAntes = dadosAntes;
        this.dadosDepois = dadosDepois;
        this.usuario = usuario;
        this.data = data;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTabela() {
        return tabela;
    }

    public void setTabela(String tabela) {
        this.tabela = tabela;
    }

    public String getOperacao() {
        return operacao;
    }

    public void setOperacao(String operacao) {
        this.operacao = operacao;
    }

    public Long getRegistroId() {
        return registroId;
    }

    public void setRegistroId(Long registroId) {
        this.registroId = registroId;
    }

    public String getDadosAntes() {
        return dadosAntes;
    }

    public void setDadosAntes(String dadosAntes) {
        this.dadosAntes = dadosAntes;
    }

    public String getDadosDepois() {
        return dadosDepois;
    }

    public void setDadosDepois(String dadosDepois) {
        this.dadosDepois = dadosDepois;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }
}
