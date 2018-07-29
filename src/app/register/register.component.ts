import { Component, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { UsuarioService } from './../services/service.index';

import swal from 'sweetalert';
import { Usuario } from '../models/usuario.model';

// declare function init_plugins_icheck();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnChanges {

  checkboxValue: boolean;

  forma: FormGroup;


  constructor(
    public _usuarioServices: UsuarioService,
    public router: Router
  ) { }

  sonIguales(campo1: string, campo2: string) {
    return (group: FormGroup) => {

      let pass1 = group.controls[campo1].value;
      let pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      };

      return {
        sonIguales: true
      }
    };
  }

  ngOnInit() {
    // init_plugins_icheck();

    this.forma = new FormGroup({
      nombres: new FormControl(null, Validators.required),
      apePaterno: new FormControl(null, Validators.required),
      apeMaterno: new FormControl(null, Validators.required),
      correo: new FormControl(null, [Validators.required, Validators.email]),
      password1: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      condiciones: new FormControl(false)
    }, { validators: this.sonIguales('password1', 'password2') });

    this.forma.patchValue({
      nombres: 'Test',
      apePaterno: 'ApePaternoTest',
      apeMaterno: 'ApeMaternoTest',
      correo: 'test@test.com',
      password1: '123456',
      password2: '123456',
      condiciones: false
    });

  }

  ngOnChanges() {
    // init_plugins_icheck();
  }

  registrarUsuario() {
    if (this.forma.invalid) {
      return;
    };

    if (!this.forma.value.condiciones) {
      // console.log('Debe de aceptar las condiciones.');
      swal('Debe de aceptar las condiciones', '', 'warning');
      return;
    };

    // console.log('Forma válida: ', this.forma.valid);

    let usuario = new Usuario(
      this.forma.value.nombres,
      this.forma.value.apePaterno,
      this.forma.value.apeMaterno,
      this.forma.value.correo,
      this.forma.value.password1
    );

    this._usuarioServices.crearUsuario(usuario)
      .subscribe(resp => this.router.navigate(['/login']));
  }

}
