import { URL_SERVICIOS } from './../../config/config';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../../models/medico.model';
import { Hospital } from '../../models/hospital.model';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html',
  styles: []
})
export class BusquedaComponent implements OnInit {

  medicos: Medico[] = [];
  hospitales: Hospital[] = [];
  usuarios: Usuario[] = [];

  constructor(
    public activatedRoute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.hospitales = [];
    this.medicos = [];
    this.usuarios = [];
    activatedRoute.params
      .subscribe(params => {
        let termino = params['termino'];
        this.buscar(termino);
      });
  }

  ngOnInit() {
  }

  buscar(termino: string) {
    if (termino.length <= 0) {
      this.hospitales = [];
      this.medicos = [];
      this.usuarios = [];
      return;
    }
    let url = URL_SERVICIOS + '/busqueda/todo/' + termino;
    this.http.get(url)
      .subscribe((resp: any) => {
        console.log(resp);
        this.hospitales = resp.hospitales;
        this.medicos = resp.medicos;
        this.usuarios = resp.usuarios;
      });
  }

}
