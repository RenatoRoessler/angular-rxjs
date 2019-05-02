import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, fromEvent, of } from 'rxjs';
import { Person } from './person.model';
import { HttpClient } from '@angular/common/http';
import { filter, map, mergeAll } from 'rxjs/operators';

@Component({
  selector: 'app-switch-merge',
  templateUrl: './switch-merge.component.html',
  styleUrls: ['./switch-merge.component.css']
})
export class SwitchMergeComponent implements OnInit {

  @ViewChild('searchBy') el: ElementRef;
  searchInput: string = '';
  people$: Observable<Person[]>;
  private readonly url: string = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    //this.firstOption();
    this.secondOption();
  }

  filterPeople(searchInput: string): Observable<Person[]> {
    if(searchInput.length === 0) {
      return of([]);
    }
    return this.http.get<Person[]>(`${this.url}/${searchInput}`);
  }

  firstOption() {
    fromEvent(this.el.nativeElement, 'keyup')
      .subscribe(e=> {
        this.filterPeople(this.searchInput)
          .subscribe( r=> console.log(r))
      });
  }

  secondOption() {
    let keyup$ = fromEvent(this.el.nativeElement, 'keyup');
    let fetch$ = keyup$.pipe(  map((e)=>  this.filterPeople(this.searchInput) ));
    this.people$ =  fetch$
      .pipe( mergeAll());   
    
  }

}
