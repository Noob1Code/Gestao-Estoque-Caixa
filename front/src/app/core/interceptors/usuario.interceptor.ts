import { HttpInterceptorFn } from '@angular/common/http';

export const UsuarioInterceptor: HttpInterceptorFn = (req, next) => {

  const usuario = localStorage.getItem("usuario_logado") || "desconhecido";

  const reqClonada = req.clone({
    setHeaders: {
      "X-Usuario": usuario
    }
  });

  return next(reqClonada);
};