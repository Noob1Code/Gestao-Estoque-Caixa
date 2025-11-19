package com.gestao.back.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gestao.back.model.context.UsuarioContext;
import com.gestao.back.model.entities.Auditoria;
import com.gestao.back.model.repositories.AuditoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuditoriaService {

    @Autowired
    private AuditoriaRepository repository;

    @Autowired
    private ObjectMapper objectMapper;

    public void registrar(
            String tabela,
            String operacao,
            Object antes,
            Object depois,
            Long idRegistro
    ) {
        try {
            Auditoria aud = new Auditoria();
            aud.setTabela(tabela);
            aud.setOperacao(operacao);
            aud.setRegistroId(idRegistro);

            aud.setDadosAntes(antes != null ? objectMapper.writeValueAsString(antes) : null);
            aud.setDadosDepois(depois != null ? objectMapper.writeValueAsString(depois) : null);

            aud.setUsuario(UsuarioContext.getUsuario());

            repository.save(aud);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar auditoria", e);
        }
    }
}
