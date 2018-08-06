import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  buscarUsuarioActivo: boolean = false;
  terminoGlobal: string = '';

  constructor(
    public _usuarioServices: UsuarioService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this._modalUploadService.notificacion
      .subscribe(resp => this.cargarUsuarios());

  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioServices.cargarUsuarios(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.usuarios = resp.usuarios;
        this.cargando = false;
      });
  }

  cambiarDesde(valor: number) {
    let desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    if (!this.buscarUsuarioActivo) {
      this.cargarUsuarios();
    } else {
      this.buscarUsuario(this.terminoGlobal);
    }
  }

  buscarUsuario(termino: string) {

    if (termino.length <= 0) {
      this.desde = 0;
      this.terminoGlobal = '';
      this.cargarUsuarios();
      this.buscarUsuarioActivo = false;
      return;
    }
    this.terminoGlobal = termino;
    this.cargando = true;
    this.buscarUsuarioActivo = true;

    this._usuarioServices.buscarUsuarios(termino, this.desde)
      .subscribe((resp: any) => {
        let usuarios: Usuario[] = resp.usuarios;
        this.usuarios = usuarios;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  borrarUsuario(usuario: Usuario) {
    if (usuario._id === this._usuarioServices.usuario._id) {
      swal('Error Al Borrar Usuario', 'No puede borrar su propio usuario', 'error');
      return;
    }

    swal({
      title: '¿Estás Seguro?',
      text: 'Está a unpo de borrar a ' + usuario.nombres,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(borrar => {
      if (borrar) {
        this._usuarioServices.borrarUsuario(usuario._id)
          .subscribe(() => {
            this.cargarUsuarios();
            if (this.totalRegistros <= 5) {
              return;
            }
            this.totalRegistros -= 1;
            if ((this.totalRegistros % 5) === 0) {
              let totalActual = ((this.totalRegistros / 5) - 1) * 5;
              this.desde = totalActual;
              this.buscarUsuario(this.terminoGlobal);
            }
          });
      }
    });
  }

  guardarUsuario(usuario: Usuario) {
    this._usuarioServices.actualizarUsuario(usuario)
      .subscribe();
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('usuarios', id);
  }
}
