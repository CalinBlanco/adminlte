import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor(
    public _usuarioService: UsuarioService
  ) {

  }

  canActivate(): Promise<boolean> | boolean {
    console.log('Token Guard');

    let token = this._usuarioService.token;


    // Recuperando información del token mediante el payload
    let payload = JSON.parse(atob(token.split('.')[1]));

    // Enviamos el valor de expirado
    let expirado = this.expirado(payload.exp);

    if (expirado) {
      this._usuarioService.logOut();
      return false;
    }

    return this.verificaRenueva(payload.exp);
  }

  verificaRenueva(fechExp: number): Promise<boolean> {

    return new Promise((resolve, reject) => {
      let tokenExp = new Date(fechExp * 1000);
      let ahora = new Date();

      ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000));

      console.log(tokenExp);
      console.log(ahora);

      if (tokenExp.getTime() > ahora.getTime()) {
        resolve(true);
      } else {
        this._usuarioService.renuevaToken()
          .subscribe(() => {
            resolve(true);
          }, () => {
            this._usuarioService.logOut();
            reject(false);
          }
          )
      }
    });
  }

  expirado(fechExp: number) {
    // Instancia actual de la hora del sistema
    let ahora = new Date().getTime() / 1000;

    if (fechExp < ahora) {
      return true;
    } else {
      return false;
    }
  }
}
