/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.gestao.back.controllers;

import com.gestao.back.dto.LoginRequestDTO;
import com.gestao.back.dto.UsuarioResponseDTO;
import com.gestao.back.service.UsuarioServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Kayqu
 */
@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private UsuarioServiceImpl usuarioService;

    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> autenticar(
            @Valid @RequestBody LoginRequestDTO dto
    ) {
        try {
            UsuarioResponseDTO response = usuarioService.login(dto);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(null); 
        }
    }
}
