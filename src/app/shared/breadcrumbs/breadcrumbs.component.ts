import { Component, OnInit } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { map, retry, catchError, filter } from 'rxjs/operators';
import { Title, Meta, MetaDefinition } from "@angular/platform-browser";

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: []
})
export class BreadcrumbsComponent implements OnInit {

  label: string = '';

  constructor(private _router: Router,
    public _title: Title,
    public _meta: Meta
  ) {
    this.getDataRoute()
      .subscribe(data => {
        this.label = data.titulo;
        this._title.setTitle(this.label);

        let metaTag: MetaDefinition = {
          name: 'description',
          content: this.label
        }
        this._meta.updateTag(metaTag);
      })
  }

  getDataRoute() {
    return this._router.events.pipe(
      filter(evento => evento instanceof ActivationEnd),
      filter((evento: ActivationEnd) => evento.snapshot.firstChild === null),
      map(evento => evento.snapshot.data)
    )
  }

  ngOnInit() {
  }

}
