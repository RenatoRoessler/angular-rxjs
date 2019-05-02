import { Component, OnInit, ViewChild } from '@angular/core';
import { from, fromEvent, interval, Observable, Subscription, observable, Subject, timer } from 'rxjs';
import { map, delay, filter, tap, take, debounceTime, takeWhile, takeUntil } from 'rxjs/operators';
import { MatRipple } from '@angular/material';

@Component({
  selector: 'app-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.css']
})
export class OperatorsComponent implements OnInit {

  @ViewChild(MatRipple) ripple: MatRipple;
  private searchInput: string = '';

  constructor() { }

  ngOnInit() {
  }

  mapClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        map(i => 2 * i),
        map(i =>  i * 10),
        delay(1000)
      )
      .subscribe((a) => console.log(a) );
    fromEvent(document, 'click')
        .pipe(
          map((e: MouseEvent) => ({x: e.screenX, y: e.screenY}))
        )
        .subscribe((pos) => console.log(pos));
  }

  filterClick() {
    from([1, 2, 3, 4, 5, 6, 7])
      .pipe(
        filter(i => i % 2 === 1 )
      )
      .subscribe(i => console.log(i));

    interval(1000)
      .pipe(
        filter(i => i % 2 === 0 ),
        map( i =>  'value: ' + i ),
        delay(1000)
      )
      .subscribe(i => console.log(i));
  }

  tapClick() {
    interval(1000)
    .pipe(
      tap(i => console.log('')),
      tap(i => console.warn('before filter', i)),
      filter(i => i % 2 === 0 ),
      tap(i => console.warn('after filter', i)),
      map( i =>  'value: ' + i ),
      delay(1000)
    )
    .subscribe(i => console.log(i));

  }

  takeClick() {
    const observable = new Observable((observer) => {
      let i;
      for (i = 0; i < 20; i++) {
        setTimeout(() => observer.next(Math.floor( Math.random() * 100)), i * 100);
      }
      setTimeout(() => observer.complete, i * 100);
    });

    const s: Subscription = observable
      .pipe(
        tap(i => console.log(i)),
        take(10)
        )
      .subscribe(
        v => console.log('Output: ', v),
        (error) => console.error(error),
        () => console.log('complete')
      );

    const interv = setInterval(() => {
        console.log('cheking...');
        if (s.closed) {
          console.warn('subscriptioon closed!');
          clearInterval(interv);
        }
      }, 200);
  }


  debounceTimeClick() {
    fromEvent(document, 'click')
      .pipe(
        tap((e) => console.log('click')),
        debounceTime(1000)
      )
      .subscribe((e: MouseEvent) => {
        console.log('click with debousceTime: ', e);
        this.launcheRipple();
      });
  }

  launcheRipple() {
    const rippleRef = this.ripple.launch({
      persistent: true, centered: true
    });
    rippleRef.fadeOut();
  }

  searchEntry$: Subject<string> = new Subject<string>();
  debounceTimeSearchClick() {
    /*  para não ficar lendo toda a tecla,apenas quando parar de digitar */
    this.searchEntry$
      .pipe(
        debounceTime(500)
      )
      .subscribe((s) => console.log(s));
  }

  searchBy_UsingDebounce($event) {
    this.searchEntry$.next(this.searchInput);
  }

  takeWhileClick() {
     /* para pegar um evento até que alguma coisa seja feita */
    interval(500)
      .pipe( takeWhile((value, index) => (value < 5)))
      .subscribe(
        (i) => console.log('takeWhiçe: ', i),
        (error) => console.error(error) ,
        () => console.log('completed!') );

  }

  takeUntilClick() {
    const duetime$ = timer(5000);
    interval(500)
      .pipe( takeUntil(duetime$))
      .subscribe(
        (i) => console.log('takeWhiçe: ', i),
        (error) => console.error(error) ,
        () => console.log('completed!') );
  }

}
