/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.model.repositories;

import com.gestao.back.model.entities.Venda;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Kayqu
 */
@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    List<Venda> findByDataVendaBetween(LocalDateTime inicio, LocalDateTime fim, Sort sort);

    List<Venda> findByDataVendaGreaterThanEqual(LocalDateTime inicio, Sort sort);

    List<Venda> findByDataVendaLessThanEqual(LocalDateTime fim, Sort sort);
}
