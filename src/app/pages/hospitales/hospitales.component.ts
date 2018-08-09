import { Hospital } from './../../models/hospital.model';
import { Component, OnInit } from '@angular/core';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  hospital: Hospital;
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  buscarHospitalActivo: boolean = false;
  terminoGlobal: string = '';

  constructor(
    public _hospitalServices: HospitalService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarHospitales();

    this._modalUploadService.notificacion.subscribe(() => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;

    this._hospitalServices.cargarHospitales(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.hospitales = resp.hospitales;
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
    if (!this.buscarHospitalActivo) {
      this.cargarHospitales();
    } else {
      this.buscarHospital(this.terminoGlobal);
    }
  }

  buscarHospital(termino: string) {

    if (termino.length <= 0) {
      this.desde = 0;
      this.terminoGlobal = '';
      this.cargarHospitales();
      this.buscarHospitalActivo = false;
      return;
    }
    this.terminoGlobal = termino;
    this.cargando = true;
    this.buscarHospitalActivo = true;

    this._hospitalServices.buscarHospitales(termino, this.desde)
      .subscribe((resp: any) => {
        let hospitales: Hospital[] = resp.hospitales;
        this.hospitales = hospitales;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  actualizarHospital(hospital: Hospital) {
    this._hospitalServices.actualizarHospital(hospital)
      .subscribe();
  }

  borrarHospital(hospital: Hospital) {
    swal({
      title: '¿Estás Seguro?',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(borrar => {
      if (borrar) {
        this._hospitalServices.borrarHospital(hospital._id)
          .subscribe(() => {
            this.cargarHospitales();
            if (this.totalRegistros <= 5) {
              return;
            }
            this.totalRegistros -= 1;
            if ((this.totalRegistros % 5) === 0) {
              let totalActual = ((this.totalRegistros / 5) - 1) * 5;
              this.desde = totalActual;
              this.buscarHospital(this.terminoGlobal);
            }
          });
      }
    });
  }

  crearHospital() {
    swal({
      title: "Crear Hospital",
      text: "Nombre del hospital a crear:",
      content: "input",
      icon: "info",
      buttons: ["Cancelar", true],
    })
      .then((valor: string) => {
        if (!valor || valor.length === 0) {
          return;
        }

        this._hospitalServices.crearHospital(valor)
          .subscribe(() => this.cargarHospitales());
      });
  }

  mostrarModal(id: string) {
    this._modalUploadService.mostrarModal('hospitales', id);
  }

}
