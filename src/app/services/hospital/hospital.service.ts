import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hospital } from '../../models/hospital.model';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from './../subir-archivo/subir-archivo.service';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital: Hospital;
  token: string;

  constructor(
    public http: HttpClient,
    public _subirArchivoService: SubirArchivoService,
    public _usuarioService: UsuarioService) { }

  cargarHospitalesAll() {
    let url = URL_SERVICIOS + '/hospital/all';
    return this.http.get(url);
  }
  cargarHospitales(desde: number = 0) {
    let url = URL_SERVICIOS + '/hospital?desde=' + desde;
    return this.http.get(url);
  }

  obtenerHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.hospital)
    );
  }

  borrarHospital(id: string) {
    let url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal(resp.body.nombre, 'Ha sido borrado correctamente!', {
          icon: "success"
        });
        return true;
      })
    );
  }

  buscarHospitales(termino: string, desde: number = 0) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino + '?desde=' + desde;
    return this.http.get(url).pipe(map((resp: any) => resp));
  }

  actualizarHospital(hospital: Hospital) {
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' + this._usuarioService.token;

    return this.http.put(url, hospital).pipe(
      map((resp: any) => {
        swal('Hospital actualizado', resp.body.nombre, 'success');
        return true;
      })
    );
  }

  cambiarImagen(archivo: File, id: string) {
    this._subirArchivoService.subirArchivo(archivo, 'hospitales', id, this._usuarioService.token)
      .then((resp: any) => {
        this.hospital.img = resp.hospitalActualizado.img;
        swal('Imagen Actualizada', this.hospital.nombre, 'success');
      })
      .catch(resp => {
        console.log(resp);
      });
  }

  crearHospital(nombre: string) {
    let url = URL_SERVICIOS + '/hospital?token=' + this._usuarioService.token;
    return this.http.post(url, { nombre }).pipe(
      map((resp: any) => {
        swal(resp.body.nombre, 'Ha sido creado correctamente', 'success');
        return resp.body;
      })
    );
  }
}
