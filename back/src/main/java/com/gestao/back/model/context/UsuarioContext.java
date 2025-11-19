package com.gestao.back.model.context;

public class UsuarioContext {

    private static final ThreadLocal<String> usuarioLogado = new ThreadLocal<>();

    public static void setUsuario(String usuario) {
        usuarioLogado.set(usuario);
    }

    public static String getUsuario() {
        return usuarioLogado.get();
    }

    public static void limpar() {
        usuarioLogado.remove();
    }
}
