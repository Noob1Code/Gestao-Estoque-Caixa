package com.gestao.back.model.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestao.back.model.entities.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Object> findByCodigo(String codigo);
    List<Produto> findAllByAtivo(Boolean ativo);
}
