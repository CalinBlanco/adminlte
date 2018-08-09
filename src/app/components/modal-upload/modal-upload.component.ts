import { SubirArchivoService } from './../../services/subir-archivo/subir-archivo.service';
import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from './modal-upload.service';
import { UsuarioService } from './../../services/usuario/usuario.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {
  imagenSubir: File;
  imagenTemp: string;

  constructor(
    public _subirArchivoService: SubirArchivoService,
    public _modalUploadService: ModalUploadService,
    public _usuarioService: UsuarioService
  ) { }

  ngOnInit() {
  }

  seleccionImagen(archivo: File) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      this.imagenTemp = null;
      (<HTMLInputElement>document.getElementById('imagenInput')).value = '';
      return;
    }

    this.imagenSubir = archivo;

    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL(archivo);

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;
    this._modalUploadService.ocultarModal();
  }
  SubirImagen() {
    this._subirArchivoService.subirArchivo(this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id, this._usuarioService.token)
      .then(resp => {

        this._modalUploadService.notificacion.emit(resp);
        this.cerrarModal();

      })
      .catch(err => { console.log('Error en la carga ...'); });
  }

}
