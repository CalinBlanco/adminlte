import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  ajustes: Ajustes = {
    temaNavUrl: 'assets/css/colorTheme/nav/default.css',
    temaNav: 'default',
    temaSideUrl: 'assets/css/colorTheme/sidebar/default-dark.css',
    temaSide: 'default-dark'
    // temaNavUrl: '',
    // temaNav: '',
    // temaSideUrl: '',
    // temaSide: ''
  };

  constructor ( @Inject(DOCUMENT) private _document ) {
    this.cargarAjustes();
  }

  guardarAjustes () {
    // console.log('Guardado en el localStorage');
    localStorage.setItem('ajustes', JSON.stringify( this.ajustes ));
  }

  cargarAjustes () {
    if( localStorage.getItem('ajustes') ){
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      // console.log('Cargando del localStorage');

      this.aplicarTemaNav(this.ajustes.temaNav);
      this.aplicarTemaSide(this.ajustes.temaSide);
    }
    else{
      // console.log('Usando valores por defecto');
      this.aplicarTemaNav(this.ajustes.temaNav);
      this.aplicarTemaSide(this.ajustes.temaSide);
    }
  }

  aplicarTemaNav ( tema: string ) {
    let url = `assets/css/colorTheme/nav/${ tema }.css`;
    this._document.getElementById('temaNav').setAttribute('href', url);

    // Asignando valores a las variables del servicio
    this.ajustes.temaNav = tema;
    this.ajustes.temaNavUrl = url;

    //LLamando a la función gardarAjustes del servicio
    this.guardarAjustes();
  }

  aplicarTemaSide ( tema: string ) {

    let url = `assets/css/colorTheme/sidebar/${ tema }.css`;
    this._document.getElementById('temaSide').setAttribute('href', url);

    // Asignando valores a las variables del servicio
    this.ajustes.temaSide = tema;
    this.ajustes.temaSideUrl = url;

    //LLamando a la función gardarAjustes del servicio
    this.guardarAjustes();
  }

}

interface Ajustes {
  temaNavUrl: string;
  temaNav: string;
  temaSideUrl: string;
  temaSide: string;
}
