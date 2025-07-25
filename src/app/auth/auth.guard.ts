// src/app/auth/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    const requiresAuth = next.data['requiresAuth'] !== false;
    const allowedRoles = next.data['roles'] as Array<string>;
    
    // Si la ruta no requiere autenticación (como Home, Login o Noticias)
    if (!requiresAuth) {
      return true;
    }

    // Si la ruta requiere autenticación
    if (!this.authService.isLoggedIn()) {
      Swal.fire({
        icon: 'warning',
        title: 'Acceso restringido',
        text: 'Debes iniciar sesión para acceder a esta página',
        timer: 2000,
        showConfirmButton: false
      });
      this.router.navigate(['/Login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // Verificar roles si la ruta los especifica
    if (allowedRoles && allowedRoles.length > 0) {
      const userRole = this.authService.getUserRole();
      
      if (!allowedRoles.includes(userRole)) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No tienes permisos para acceder a esta sección',
          timer: 2000,
          showConfirmButton: false
        });
        return this.redirectBasedOnRole();
      }
    }

    return true;
  }

  private redirectBasedOnRole(): boolean {
    if (this.authService.isAdmin()) {
      this.router.navigate(['/Lista-Usuarios']);
    } else {
      // Para usuarios free y premium, redirigir a Novedades
      this.router.navigate(['/Sensores/Novedades']);
    }
    return false;
  }
}