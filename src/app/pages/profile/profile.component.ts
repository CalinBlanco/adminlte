import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';

// Importamos el SweetAlert
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  fileSize: string;
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public _usuarioService: UsuarioService
  ) {
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit() {
  }

  guardar(usuario: Usuario) {
    this.usuario.nombres = usuario.nombres;
    this.usuario.apePaterno = usuario.apePaterno;
    this.usuario.apeMaterno = usuario.apeMaterno;
    if (!this.usuario.google) {
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario(this.usuario)
      .subscribe();
  }

  dimensionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }
    // --INICIO Identificar el width y el height de la imagen
    let _URL = window.URL || (window as any).webkitURL;
    let file, img;
    let self = this;

    if (archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      this.imagenTemp = null;
      (<HTMLInputElement>document.getElementById('imagenInput')).value = '';
      return;
    }

    if ((file = archivo)) {
      let img = new Image();
      img.onload = function () {
        // console.log('Width: ', parseInt(img.width) + " y Height: " + parseInt(img.height));
        self.seleccionImagen(archivo, img.width, img.height);
      };
      img.onerror = function () {
        console.log('El archivo: ' + file.type + ' no es válido.');
      };
      img.src = _URL.createObjectURL(file);
    }
    // --  FIN Identificar el width y el height de la imagen
  }

  seleccionImagen(archivo: File, width: number, height: number) {

    // Emitiendo dimensiones de la imagen
    swal('Ancho: ' + width + ' px' + ', Alto: ' + height + ' px', '', 'info');

    this.imagenSubir = archivo;

    // Calculando el tamaño del archivo
    this.fileSize = this.bytesToSize(archivo.size);
    // console.log(this.fileSize);

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);
    
    // reader.onloadend = () => console.log(reader.result);
    reader.onloadend = () => this.imagenTemp = String(reader.result);
  }

  cambiarImagen() {
    this._usuarioService.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

  bytesToSize(bytes: number) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) { return '0 Byte'; }
    let i: number = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
  }

}
