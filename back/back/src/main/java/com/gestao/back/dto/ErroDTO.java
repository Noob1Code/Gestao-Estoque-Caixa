package com.gestao.back.dto;

public class ErroDTO {

    private String mensagem;
    private int status;

    public ErroDTO(String mensagem, int status) {
        this.mensagem = mensagem;
        this.status = status;
    }

    public String getMensagem() {
        return mensagem;
    }

    public int getStatus() {
        return status;
    }
}
