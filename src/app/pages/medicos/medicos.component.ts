import { Component, OnInit } from '@angular/core';
import { MedicoService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { Medico } from '../../models/medico.model';

declare const swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  buscarMedicoActivo: boolean = false;
  terminoGlobal: string = '';

  constructor(
    public _medicoServices: MedicoService,
    public _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.cargando = true;

    this._medicoServices.cargarMedicos(this.desde)
      .subscribe((resp: any) => {
        this.totalRegistros = resp.total;
        this.medicos = resp.medicos;
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
    if (!this.buscarMedicoActivo) {
      this.cargarMedicos();
    } else {
      this.buscarMedico(this.terminoGlobal);
    }
  }

  buscarMedico(termino: string) {

    if (termino.length <= 0) {
      this.desde = 0;
      this.terminoGlobal = '';
      this.cargarMedicos();
      this.buscarMedicoActivo = false;
      return;
    }
    this.terminoGlobal = termino;
    this.cargando = true;
    this.buscarMedicoActivo = true;

    this._medicoServices.buscarMedicos(termino, this.desde)
      .subscribe((resp: any) => {
        let medicos: Medico[] = resp.medicos;
        this.medicos = medicos;
        this.totalRegistros = resp.total;
        this.cargando = false;
      });
  }

  borrarMedico(medico: Medico) {
    swal({
      title: '¿Estás Seguro?',
      text: 'Está a punto de borrar a ' + medico.apePaterno + ' ' + medico.apeMaterno + ', ' + medico.nombres,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then(borrar => {
      if (borrar) {
        this._medicoServices.borrarMedico(medico._id)
          .subscribe(() => {
            this.cargarMedicos();
            if (this.totalRegistros <= 5) {
              return;
            }
            this.totalRegistros -= 1;
            if ((this.totalRegistros % 5) === 0) {
              let totalActual = ((this.totalRegistros / 5) - 1) * 5;
              this.desde = totalActual;
              this.buscarMedico(this.terminoGlobal);
            }
          });
      }
    });
  }

  crearMedico() {

  }


}
