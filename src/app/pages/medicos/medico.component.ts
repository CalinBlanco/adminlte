import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Hospital } from './../../models/hospital.model';
import { MedicoService, HospitalService } from '../../services/service.index';
import { Medico } from './../../models/medico.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalUploadService } from './../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '', '', '');
  hospital: Hospital = new Hospital('');
  btnInteligente: string = '';
  titulo: string = '';

  constructor(
    public _medicoService: MedicoService,
    public _hospitalService: HospitalService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _modalUploadService: ModalUploadService
  ) {
    activatedRoute.params.subscribe(params => {
      let id = params['id'];

      if (id !== 'nuevo') {
        this.obtenerMedico(id);
        this.btnInteligente = 'Actualizar Médico';
        this.titulo = 'Actualizar Médico';
      } else {
        this.btnInteligente = 'Guardar Médico';
        this.titulo = 'Crear Nuevo Médico';
      }
    });
  }

  ngOnInit() {
    this._hospitalService.cargarHospitalesAll()
      .subscribe((resp: any) => this.hospitales = resp.hospitales);

    this._modalUploadService.notificacion
      .subscribe(resp => {
        this.medico.img = resp.medico.img;
      });
  }

  guardarMedico(f: NgForm) {
    if (f.invalid) {
      return;
    }

    this._medicoService.guardarMedico(this.medico)
      .subscribe(medico => {
        this.medico._id = medico._id;
        this.router.navigate(['/medico', medico._id]);
      });
  }

  // Esta funcion me permite obtener el hospital enviando el ID
  cambioHospital(id: string) {
    this._hospitalService.obtenerHospital(id)
      .subscribe(hospital => this.hospital = hospital);
  }

  // Esta funcionme permite obtener el medico enviando en ID
  obtenerMedico(id: string) {
    this._medicoService.obtenerMedico(id)
      .subscribe(medico => {
        this.medico = medico;
        this.medico.hospital = medico.hospital._id;
        this.cambioHospital(this.medico.hospital);
      });
  }

  cambiarFoto() {
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }
}
