package com.gestao.back.model.repositories;

import com.gestao.back.model.entities.MovimentoEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {

    Optional<MovimentoEstoque> findById(Long id);

    List<MovimentoEstoque> findAllByProdutoId(Long produtoId);
}
