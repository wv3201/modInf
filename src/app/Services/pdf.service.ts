import { Injectable } from '@angular/core';
import htmlToPdfmake from 'html-to-pdfmake'

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  estilos: any;
  f = new Date();
  profilePic;
  impre:any;
  halla:any;

  constructor() { }
  loadTemplate(data: any, impre: any, halla: any, ante: any, D: any, tec, profilePic, fecf, p, m: any) {
    this.profilePic = profilePic;
    var stil={'html-strong':{ color:'solid black', bold:true},
        'html-em':{ italics:true},
        'html-u':{ decoration:'underline'},
        'html-h1':{ fontSize:24, bold:true, marginBottom:5},
        'html-p': { margin:[0, 5, 0, 10] }}
    this.impre=htmlToPdfmake(impre);
    this.halla=htmlToPdfmake(halla);
    //console.log(halla);
    if (D == null) {
      //console.log("2.1")
      this.estilos = {
        content: [
          { text: 'Informe Medico', bold: true, fontSize: 16, decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 20] },
          {
            columns: [[
              { text: 'Nombre: ' + data.name, style: 'body' },
              { text: 'Edad: ' + data.edad, style: 'body' },
              { text: ' ' },
              { text: 'Fecha Examen: ' + fecf, style: 'body' },
              { text: ' ' },
              { text: ' ' },
              { text: 'Examen realizado:', style: 'header' },
              { text: ante, style: 'body' },
              { text: ' ' }
            ], [
              { text: 'RUT: ' + data.rut, style: 'body' },
              { text: 'Contant No: ' + data.phone, style: 'body' },
              { text: ' ' },
              { text: 'Fecha Informe: ' + this.f.getDate() + '/' + '0' + (1 + this.f.getUTCMonth()) + '/' + this.f.getFullYear(), style: 'body' },
              { text: ' ' },
              { text: ' ' },
              { text: 'Técnica:', style: 'header' },
              { text: tec, style: 'body' },
              { text: ' ' }
            ]]
          }, {
            columns: [[
              { text: 'Hallazgos:', style: 'header' },
              { text: halla, style: 'body' },
              { text: ' ' },
              { text: ' ' },
              { text: 'Impresión:', style: 'header' },
              { text: impre, style: 'body' },
              { text: ' ' },
              { text: ' ' }]]
          }], styles: {
            header: { fontSize: 10, bold: false, margin: [0, 0, 0, 0], decoration: 'underline' },
            body: { fontSize: 10, bold: false },
            firma: { fontSize: 10, bold: false, alignment: 'right' },
            name: { fontSize: 12, bold: true }
          }
      }
      return this.estilos;
    } else {
      //console.log("2.2")
      this.estilos = {
        General: {
          content: [
            { text: 'Informe Medico', bold: true, fontSize: 16, decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 20] },
            {
              columns: [[
                { text: 'Nombre: ' + data.name, style: 'body' },
                { text: 'Edad: ' + data.edad, style: 'body' },
                { text: ' ' },
                { text: 'Fecha Examen: ' + fecf, style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Examen realizado:', style: 'header' },
                { text: ante, style: 'body' },
                { text: ' ' }
              ], [
                { text: 'RUT: ' + data.rut, style: 'body' },
                { text: 'Contant No: ' + data.phone, style: 'body' },
                { text: ' ' },
                { text: 'Fecha Informe: ' + this.f.getDate() + '/' + '0' + (1 + this.f.getUTCMonth()) + '/' + this.f.getFullYear(), style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Técnica:', style: 'header' },
                { text: tec, style: 'body' },
                { text: ' ' }
              ]]
            }, {
              columns: [[
                { text: 'Hallazgos:', style: 'header' },
                { text: halla, style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Impresión:', style: 'header' },
                { text: impre, style: 'body' },
                { text: ' ' },
                { text: ' ' }]]
            }, {
              columns: this.getProfilePicObject2(D, m)
            }], styles: {
              header: { fontSize: 10, bold: false, margin: [0, 0, 0, 0], decoration: 'underline' },
              body: { fontSize: 10, bold: false },
              firma: { fontSize: 10, bold: false, alignment: 'right' },
              name: { fontSize: 12, bold: true }
            }
        }, Chaxapacs: {
          content: [
            { text: 'Informe Medico', bold: true, fontSize: 16, decoration: 'underline', alignment: 'center', margin: [0, 0, 0, 20] },
            {
              columns: [[
                { text: 'Nombre: ' + data.name, style: 'body' },
                { text: 'Edad: ' + data.edad, style: 'body' },
                { text: ' ' },
                { text: 'Fecha Examen: ' + fecf, style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Examen realizado:', style: 'header' },
                { text: ante, style: 'body' },
                { text: ' ' }
              ], [
                { text: 'RUT: ' + data.rut, style: 'body' },
                { text: 'Contant No: ' + data.phone, style: 'body' },
                { text: ' ' },
                { text: 'Fecha Informe: ' + this.f.getDate() + '/' + '0' + (1 + this.f.getUTCMonth()) + '/' + this.f.getFullYear(), style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Técnica:', style: 'header' },
                { text: tec, style: 'body' },
                { text: ' ' }
              ]]
            },
            {
              columns: [[
                { text: 'Hallazgos:', style: 'header' },
                { text: halla, style: 'body' },
                { text: ' ' },
                { text: ' ' },
                { text: 'Impresión:', style: 'header' },
                { text: impre, style: 'body' },
                { text: ' ' },
                { text: ' ' }
              ]]
            },
            {
              columns:
                this.getProfilePicObject2(p, m)
            }], styles: {
              header: { fontSize: 10, bold: false, margin: [0, 0, 0, 0], decoration: 'underline' },
              body: { fontSize: 10, bold: false },
              firma: { fontSize: 10, bold: false, alignment: 'right' },
              name: { fontSize: 12, bold: true }
            }
        }
      }
      switch (D.Nombre) {
        case 'Chaxapacs':
          return this.estilos.Chaxapacs;
        default:
          return this.estilos.General;
      }
    }
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