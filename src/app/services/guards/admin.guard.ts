import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public _usuarioServices: UsuarioService
  ){

  }

  canActivate() {

    if (this._usuarioServices.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else{
      console.log('Bloqueado por el ADMINGUARD')
      this._usuarioServices.logOut();
      return false;
    }
  }
}
