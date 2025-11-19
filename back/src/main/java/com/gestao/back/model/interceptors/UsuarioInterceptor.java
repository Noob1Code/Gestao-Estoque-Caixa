package com.gestao.back.model.interceptors;

import com.gestao.back.model.context.UsuarioContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class UsuarioInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {

        String usuario = request.getHeader("X-Usuario");

        UsuarioContext.setUsuario(usuario != null ? usuario : "desconhecido");

        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) {
        UsuarioContext.limpar();
    }
}
