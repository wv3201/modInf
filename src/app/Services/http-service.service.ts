import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import listaExam from '../../assets/json/bd.json';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }
  apiUrl = 'https://jsonplaceholder.typicode.com';
  getData(): Observable<any> {
    console.log("1");
    return this.http.get(this.apiUrl + '/users');
  }
  sendData(item) {
    //return this.http.post('../../assets/json/bd.json',item);
    /*writeFile('../../assetss/json/bd.json',item,finished);
    function finished(err){ console.log('all set.')}*/
  }
  //metodo para transformar imagenes
  toDataUrl(urlss, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', urlss);
    xhr.responseType = 'blob';
    xhr.send();
  }

  getIMG(url:string):Promise<any>{
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
      resolve(response);
    });
  });
}

  //metodo para cargar una imagen desde una url
  getBase64ImageFromURL(url: string):Observable<any> {
    return Observable.create((observer) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
           observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
 }
 //transformar la imagen a base64;
 getBase64Image(img: HTMLImageElement) {
    // We create a HTML canvas object that will create a 2d image
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    // This will draw image    
    ctx.drawImage(img, 0, 0);
    // Convert the drawn image to Data URL
    var dataURL = canvas.toDataURL("image/png");
 return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
 }
}
