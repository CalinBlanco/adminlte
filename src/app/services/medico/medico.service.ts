import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from './../../config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import { Medico } from '../../models/medico.model';

// Importamos el SweetAlert
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    public http: HttpClient,
    public _usuarioService: UsuarioService
  ) { }

  cargarMedicos(desde: number = 0) {
    let url = URL_SERVICIOS + '/medico?desde=' + desde;
    return this.http.get(url);
  }

  buscarMedicos(termino: string, desde: number = 0) {
    let url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino + '?desde=' + desde;
    return this.http.get(url).pipe(map((resp: any) => resp));
  }

  borrarMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id + '?token=' + this._usuarioService.token;
    return this.http.delete(url).pipe(
      map((resp: any) => {
        swal('Médico borrado correctamente!', resp.body.apePaterno + ' ' + resp.body.apeMaterno + ', '
          + resp.body.nombres, {
            icon: "success"
          });
        return true;
      })
    );
  }

  guardarMedico(medico: Medico) {
    let url = URL_SERVICIOS + '/medico';

    if (medico._id) {
      // Actualizando
      url += '/' + medico._id + '?token=' + this._usuarioService.token;
      return this.http.put(url, medico).pipe(
        map((resp: any) => {
          swal('Médico actualizado correctamente!', resp.body.apePaterno + ' ' + resp.body.apePaterno + ', ' + resp.body.nombres, {
            icon: "success"
          });
          return resp.body;
        })
      );
    } else {
      // Creando
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico).pipe(
        map((resp: any) => {
          swal('Médico creado correctamente!', resp.body.apePaterno + ' ' + resp.body.apePaterno + ', ' + resp.body.nombres, {
            icon: "success"
          });
          return resp.body;
        })
      );
    }

  }

  obtenerMedico(id: string) {
    let url = URL_SERVICIOS + '/medico/' + id;
    return this.http.get(url).pipe(
      map((resp: any) => resp.medico)
    );
  }
}
