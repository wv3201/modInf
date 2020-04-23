import { Injectable } from '@angular/core';
import htmlToPdfmake from 'html-to-pdfmake';
import { HttpClient } from '@angular/common/http';
import { HttpServiceService } from './http-service.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  estilos: any;
  f = new Date();
  profilePic;
  impre: any;
  halla: any;
  veces:any=0;
  me:any=JSON.stringify({
    id:0,
    name:'',
    lastname:'',
    rut:'',
});
  constructor(private Service: HttpServiceService,private http:HttpClient) { }
  loadTemplate(data: any, impre: any, halla: any, ante: any, D: any, tec, profilePic, fecf, p, m: any) {
    this.profilePic = profilePic;
    var stil = {
      'html-strong': { color: 'solid black', bold: true },
      'html-em': { italics: true },
      'html-u': { decoration: 'underline' },
      'html-p': { margin: [0, 5, 0, 10] },
      'html-b': { bold: true },
      'html-s': { decoration: 'lineThrough' },
      'html-i': { italics: true },
      'html-h1': { fontSize: 24, bold: true, marginBottom: 5 },
      'hmtl-h2': { fontSize: 22, bold: true, marginBottom: 5 },
      'html-h3': { fontSize: 20, bold: true, marginBottom: 5 },
      'html-h4': { fontSize: 18, bold: true, marginBottom: 5 },
      'html-h5': { fontSize: 16, bold: true, marginBottom: 5 },
      'html-h6': { fontSize: 14, bold: true, marginBottom: 5 },
      'html-a': { color: 'blue', decoration: 'underline' },
      'html-strike': { decoration: 'lineThrough' },
      'html-table': { marginBottom: 5 },
      'html-th': { bold: true, fillColor: '#EEEEEE' }
    }
      
    this.impre = htmlToPdfmake(impre);
    this.halla = htmlToPdfmake((halla));
    ante= this.examen(ante);
    this.estilos = {
        content: [
          { text: 'Informe Medico', bold: true, fontSize: 16, decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 20] },
          {
            columns: [[
              { text: 'Nombre: ' + data.name+' '+data.lastname+' '+data.lastname_mother, style: 'body' },
              { text: 'Edad: ' + data.edad, style: 'body' },
              { text: 'Fecha Examen: ' + fecf, style: 'body' },
              { text: ' ' },
              { text: 'Técnica:', style: 'header' },
              { text: tec, style: 'body' },
              { text: ' ' }
            ], [
              { text: 'RUT: ' + data.rut, style: 'body' },
              { text: ' ' },
              { text: 'Fecha Informe: ' + this.f.getDate() + '/' + '0' + (1 + this.f.getUTCMonth()) + '/' + this.f.getFullYear(), style: 'body' },
              { text: ' ' },
              { text: ' ' },
              { text: ' ' }
            ]]
          }, {
            columns: [[
              { text: 'Examen realizado:', style: 'header' },
              { text: ante, style:'body' },
              { text: ' ' },
              { text: ' ' },
              { text: 'Hallazgos:', style: 'header' },
              { text: this.halla, style: stil },
              { text: ' ' },
              { text: ' ' },
              { text: 'Impresión:', style: 'header' },
              { text: this.impre, style: stil },
              { text: ' ' },
              { text: ' ' }]]
          }, {
            columns: this.get(m,D)
          }], styles: {
            header: { fontSize: 10, bold: false, margin: [0, 0, 0, 0], decoration: 'underline' },
            body: { fontSize: 10, bold: false },
            firma: { fontSize: 10, bold: false, alignment: 'right' },
            name: { fontSize: 12, bold: true }
          }
      }
    return this.estilos;
  }
  examen(ante:any){
    let a='';
    for(let i=0;i<ante.length;i++){
      a+=i+1+'.- '+ante[i]+'<br>';
    }
    ante = htmlToPdfmake((a));
    return ante;
  }
  get(m,D){
    this.Service.Empleado(D).subscribe(
      data=>{
        var a=data[0].name.split(' ');
        this.me=data[0];
        this.me.name=a[0];
    });
    
    if(m ==null){
      return [[{
        text: this.me.name+' '+this.me.lastname,
        width: 100,
        fontSize: 10,
        alignment: 'center',
        margin: [0, 20, 0, 0]
      },{
        text: this.me.rut,
        width: 100,
        fontSize: 10,
        alignment: 'center'
      }]];
    }else{
    return [[{
      text: D.username,
      width: 100,
      fontSize: 10,
      alignment: 'center',
      margin: [0, 10, 0, 0]
    }],[{
      text: m.name+' '+m.lastname,
      width: 100,
      fontSize: 10,
      alignment: 'center',
      margin: [0, 10, 0, 0]
    }]]; }
  }
  getProfilePicObject2(D, m) {
    if (this.profilePic.length >= 2 && (this.profilePic[0] != null && this.profilePic[0] != '') && (this.profilePic[1] != null && this.profilePic[1] != '')) {
      return [[{
        image: this.profilePic[0],
        width: 100,
        height: 50,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }, {
        text: D.DR + '\n' + D.RUT + '\n' + D.Oficio,
        width: 50,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }
      ], [
        {
          image: this.profilePic[1],
          width: 100,
          height: 50,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        }, {
          text: m.DR + '\n' + m.RUT + '\n' + m.Oficio,
          width: 50,
          alignment: 'center',
          margin: [0, 10, 0, 0]
        }
      ]];
    } else if (this.profilePic.length == 0 || this.profilePic[0] == null) {
      return [[{
        text: D.DR + '\n' + D.RUT + '\n' + D.Oficio,
        width: 100,
        fontSize: 10,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }]]
    } else {
      return [[{
        image: this.profilePic[0],
        width: 100,
        height: 50,
        fontSize: 10,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }, {
        text: D.DR + '\n' + D.RUT + '\n' + D.Oficio,
        width: 100,
        fontSize: 10,
        alignment: 'center',
        margin: [0, 10, 0, 0]
      }]]
    }
  } 
}