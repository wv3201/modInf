import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }
  apiUrl = 'https://jsonplaceholder.typicode.com';
  getData(): Observable<any> {
    return this.http.get(this.apiUrl + '/users');
  }
}
