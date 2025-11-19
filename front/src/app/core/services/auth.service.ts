import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login.dto';
import { UsuarioResponseDTO } from '../models/usuario.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';
  private currentUserSubject: BehaviorSubject<UsuarioResponseDTO | null>;
  public currentUser: Observable<UsuarioResponseDTO | null>;

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    const userData = localStorage.getItem('usuario_logado');
    this.currentUserSubject = new BehaviorSubject<UsuarioResponseDTO | null>(userData ? JSON.parse(userData) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get getLoggedUser(): UsuarioResponseDTO | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<UsuarioResponseDTO> {
    return this.http.post<UsuarioResponseDTO>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.armazenarSessao(response);
        this.currentUserSubject.next(response);
      })
    );
  }

  private armazenarSessao(sessionData: UsuarioResponseDTO): void {
    localStorage.setItem('usuario_logado', JSON.stringify(sessionData));
  }

  logout(): void {
    localStorage.removeItem('usuario_logado');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedUser;
  }

  getUserRole(): string | null {
    const user = this.getLoggedUser;
    return user ? user.perfil : null;
  }

  public updateLoggedUser(newUserData: UsuarioResponseDTO): void {
    this.armazenarSessao(newUserData);
    this.currentUserSubject.next(newUserData);
  }
}