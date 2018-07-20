import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

//Servicios
import { SettingsService } from '../../services/service.index';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styles: []
})
export class AccountSettingsComponent implements OnInit {

  constructor(public _ajustes: SettingsService) { }

  ngOnInit() {
    this.colocarCheckNav();
    this.colocarCheckSide();
  }

  cambiarColorNav(color: string, nav: any) {
    this.aplicarCheckNav(nav);
    this._ajustes.aplicarTemaNav(color);
  }
  aplicarCheckNav(nav: any) {
    console.log(nav);
    let selectoresNav: any = document.getElementsByClassName('selectorNav');

    for (let ref of selectoresNav) {
      ref.classList.remove('working');
    }

    nav.classList.add('working');
  }

  colocarCheckNav() {

    let selectoresNav: any = document.getElementsByClassName('selectorNav');

    if (this._ajustes.ajustes) {
      let tema = this._ajustes.ajustes.temaNav;
      for (let ref of selectoresNav) {
        if (ref.getAttribute('data-theme') === tema) {
          ref.classList.add('working');
          break;
        }
      }
    }
  }


  cambiarColorSide(color: string, side: any) {
    this.aplicarCheckSide(side);
    this._ajustes.aplicarTemaSide(color);
  }
  aplicarCheckSide(side: any) {
    console.log(side);
    let selectoresSide: any = document.getElementsByClassName('selectorSide');

    for (let ref of selectoresSide) {
      ref.classList.remove('working');
    }

    side.classList.add('working');
  }
  colocarCheckSide() {
    let selectoresSide: any = document.getElementsByClassName('selectorSide');

    if (this._ajustes.ajustes) {
      let tema = this._ajustes.ajustes.temaSide;
      for (let ref of selectoresSide) {
        if (ref.getAttribute('data-theme') === tema) {
          ref.classList.add('working');
          break;
        }
      }
    }
  }
}
