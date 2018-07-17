import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: []
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('inputPorcentaje') inputPorcentaje: ElementRef;

  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() porcentaje: number = 50;

  @Output() cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() {
    // console.log('Leyenda : ', this.leyenda);
    // console.log('Porcentaje : ', this.porcentaje);
  }

  ngOnInit() {
    // console.log('Leyenda : ', this.leyenda);
    // console.log('Porcentaje : ', this.porcentaje);
  }

  cambiarValor(valor: number) {
    if (this.porcentaje >= 100 && valor > 0) {
      this.porcentaje = 100;
      return;
    };
    if (this.porcentaje <= 0 && valor < 0) {
      this.porcentaje = 0;
      return;
    };
    this.porcentaje = this.porcentaje + valor;

    this.cambioValor.emit( this.porcentaje );

    this.inputPorcentaje.nativeElement.focus();
  }

  cuandoCambia( newValue: number ){
    // let elementoHTML: any = document.getElementsByName('porcentaje')[0];
    // console.log(this.inputPorcentaje);

    if(newValue<=0){
      this.porcentaje = 0;
    }else{
      this.porcentaje = newValue;
    }

    if(newValue>=100){
      this.porcentaje = 100;
    }else{
      this.porcentaje = newValue;
    }

    // elementoHTML.value = this.porcentaje;
    this.inputPorcentaje.nativeElement.value = this.porcentaje;

    this.cambioValor.emit( this.porcentaje );
  }
}
