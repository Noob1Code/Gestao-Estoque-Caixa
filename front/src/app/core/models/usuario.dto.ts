export type Perfil = 'ADMIN' | 'OPERADOR';

export interface UsuarioResponseDTO {
  id: number;
  nomeCompleto: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
}

export interface UsuarioRequestDTO {
  nomeCompleto: string;
  email: string;
  senha?: string;
  perfil: Perfil;
  ativo: boolean;
}