import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, retry, catchError, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  constructor() {

    this.subscription =  this.regresaObservable()
      .subscribe(
        numero => console.log('Subs ', numero),
        error => console.log('Error ', error),
        () => console.log('El obs terminó!')
      );
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    console.log('La página se va a cerrar');
    this.subscription.unsubscribe();
  }

  regresaObservable(): Observable<any> {

    
    
    return new Observable(observer => {
      let contador = 0;

      let intervalo = setInterval(() => {

        let salida = {
          valor: contador
        }
        observer.next(salida);

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // };

        contador += 1;

        // if (contador === 2) {
        //   clearInterval(intervalo);
          // throw new Error();

        //   observer.error('Error en el obs');
        // };

      }, 500)
    }).pipe(
      retry(0),
      map((resp: any) => {
        return resp.valor;
      }), filter( (valor, index) => {
        // console.log('Filter: ', valor, 'Index:', index);

        if ( (valor % 2) === 1) {
          // inpar
          return true;
        }else {
          // par
          return false;
        }
      })
      // catchError( err => ('') )
    );
  }
}
