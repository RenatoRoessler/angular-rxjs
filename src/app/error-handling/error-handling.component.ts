import { Component, OnInit } from '@angular/core';
import { Observable, of, throwError, timer, observable } from 'rxjs';
import { map, tap, catchError, retry, retryWhen, timeout } from 'rxjs/operators';
import { ObserversModule } from '@angular/cdk/observers';

@Component({
  selector: 'app-error-handling',
  templateUrl: './error-handling.component.html',
  styleUrls: ['./error-handling.component.css']
})
export class ErrorHandlingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  startTest() {
    let obj: Observable<any> = new Observable((observer) => {
      for(let i=0; i< 10; i++) {
        if (i==7) {
          observer.error('Um erro correu quando i = 7')
        } else {
          observer.next(i);
        }
      }
    });
    obj
      .pipe(
        map(i=> i*10),
        tap(i=>console.log('before erro handling' +1)),
        catchError(error => {
          console.error('inside catcherror: ', error);
          //return of(0);
          return throwError('throwError:' + error);
        }),
        //retry(2),
        retryWhen(i => timer(5000))
      )
      .subscribe(
      (i) => console.log('Normal output: '+i),
      err => console.log(err),
      () => console.log('completed')
    );
    

    let ibj2: Observable<any> = new Observable((observer) => {
      timer(2000).subscribe((n) => observer.next(1000));
      timer(2500).subscribe((n) => observer.complete());
    });
    obj
      .pipe(
        timeout(1000)
      )
      .subscribe(
      (i) => console.log('N: '+i),
      err => console.log(err),
      () => console.log('completed')
    );
  }

}
