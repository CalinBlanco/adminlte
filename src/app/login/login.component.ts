import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from './../services/service.index';
import { Usuario } from '../models/usuario.model';

// declare function init_plugins();

declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {
  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor(
    public router: Router,
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    // init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 0) {
      this.recuerdame = true;
    };
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '390345691142-ko7nprd29sacbjkooiiat7vc4uug8vg5.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // let profile = googleUser.getBasicProfile();
      // console.log(profile);
      let token = googleUser.getAuthResponse().id_token;

      this._usuarioService.loginGoogle(token)
        .subscribe(() => window.location.href = '/dashboard' );   //this.router.navigate(['/dashboard'])
    });
  }



  ingresar(forma: NgForm) {

    if (forma.invalid) {
      return;
    };

    let usuario = new Usuario(
      null, null, null,
      forma.value.email,
      forma.value.password
    );

    this._usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe(() => window.location.href = '/dashboard');    //this.router.navigate(['/dashboard'])

    // console.log(forma.valid);
    // console.log(forma.value);

    // this.router.navigate(['/dashboard']);
  }

}
