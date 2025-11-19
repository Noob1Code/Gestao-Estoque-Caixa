/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.model.repositories;

import com.gestao.back.model.entities.ItemVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 *
 * @author Kayqu
 */
@Repository
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {

    List<ItemVenda> findAllByProdutoId(Long produtoId);

}
