import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }
  apiUrl= 'http://localhost/postgre';
  getData(id): Observable<any> {
    return this.http.post(this.apiUrl + '/post',id);
  }
  LoadM(id): Observable<any>{
    return this.http.post('http://localhost/postgre/post',id);
  }
  Calendar(id): Observable<any>{
    return this.http.post(this.apiUrl + '/calendar',id);
  }
  Empleado(id): Observable<any>{
    return this.http.post(this.apiUrl + '/empleados',id);
  }
  PdfToPhp(pdf){
    return this.http.post(this.apiUrl + '/pdfto.php',pdf)
  }

  
}
