import { Component, OnInit, OnChanges } from '@angular/core';

declare function init_plugins();

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: []
})
export class PagesComponent implements OnInit, OnChanges {

  constructor() {
    init_plugins();
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }

}
