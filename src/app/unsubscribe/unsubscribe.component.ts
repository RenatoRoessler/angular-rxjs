import { Component, OnInit } from '@angular/core';
import { interval, fromEvent, Subscriber, Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  private subscriptionAreActive = false;
  private unsubscribeAll$: Subject<any> = new Subject();
  private intervalSubscription: Subscription = null;

  private subscriptions: Subscription[] =[];


  constructor() { }

  ngOnInit() {
    this.checkSubscriptions();
  }

  checkSubscriptions() {
    this.intervalSubscription = interval(100).subscribe(() => {
      let active = false;
      this.subscriptions.forEach((s) => {
        if(!s.closed) {
          active = true;
        }
      })
      this.subscriptionAreActive = active;
    })
  }

  subscribe() {
    const subscription1 =interval(100)
    .pipe( takeUntil(this.unsubscribeAll$))
    .subscribe((i) => {
      console.log(i)
    });
    const subscription2 = fromEvent(document, 'mousemove')
    .pipe( takeUntil(this.unsubscribeAll$))
    .subscribe((e) => console.log(e));

    this.subscriptions.push(subscription1);
    this.subscriptions.push(subscription2);
  }

  unsubscribe() {
    this.unsubscribeAll$.next();

  }

  ngOnDestroy() {
    if(this.intervalSubscription != null)
      this.intervalSubscription.unsubscribe();
    this.unsubscribeAll$.next();
  }

  

}
