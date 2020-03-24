import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription, Subject, Observable, Observer } from 'rxjs';
import { SpeechService } from '../Services/speech.service';
import { HttpServiceService } from '../Services/http-service.service';
import { PopUpComponent } from './pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import listaExam from '../../assets/json/bd.json';
import users from '../../assets/json/Plantillas.json';
import meidicos from '../../assets/json/Plantillas.json';
import data from '../../assets/json/Usuarios.json';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfService } from '../Services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { InformesService } from '../Services/informes.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { CKEditorComponent } from 'ng2-ckeditor/ckeditor.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var CKEDITOR: any;


@Component({
    selector: 'app-informes',
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit, AfterViewInit {
    clase: string = "white";
    profilePic = [];
    documentDefinition;
    bd: any = listaExam;
    us: any = users;
    user: any;
    m = [];
    InpuText: string = '';
    msg = '';
    mss = '';
    comment = '';
    ITAnte: string = '';
    tit: string = '';
    tec: string = '';
    analisis = '';
    ITHalla: string = '';
    impresion = '';
    ITImpre: string = '';
    subscription = Subscription.EMPTY;
    started = false;
    data: any;
    id: any;
    urls: any;
    plan: any;
    sanity: DomSanitizer;
    private _destroyed = new Subject<void>();
    media: any;
    a = 0;
    medicos: any;
    medicoI: any = null;
    plantilla: any;
    img: any;
    imgs: any;
    as: any[];
    fecha: any;
    documentDefinition3: any;
    iframe: boolean;
    ab: any = 'si';
    estado: boolean = false;
    temp = '';
    frase2: any = '';
    showSearchButton2: boolean;
    ckeditorContent: string = ""
    @ViewChild('CKEditorComponent.inline') ckeditor: CKEditorComponent;
    constructor(sanity: DomSanitizer, private http: HttpClient, public speechRecognitionService: SpeechService, private Service: HttpServiceService, private pdf: PdfService, private matDialog: MatDialog, public forms: FormsModule, private rutaActiva: ActivatedRoute, private infor: InformesService) {
        this.loadS();
        this.sanity = sanity;
    }
    ngOnInit(): void {
        this.loadData();
        this.iframe = false;
        this.user = users;
        this.showSearchButton2 = true;
    }
    title = "Angular Router Demo";
    shortcuts: ShortcutInput[] = [];
    shortcuts2: ShortcutInput[] = [];
    ngAfterViewInit() {
        this.shortcuts2.push(
            {
                key: ["cmd + shift"],
                label: "Voz",
                description: "Voz",
                command: e => this.Estado(),
                preventDefault: true
            }
        );
    }
    /*config: any = {
        language: 'es',
        toolbar: [
            { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo'] },
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
            { name: 'editing', items: ['Scayt'] },
            { name: 'paragraph', items: ['Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-'] },
            { name: 'styles', items: ['Styles', 'Format', 'FontSize'] },
        ]
    }*/
    //evento al elegir plantilla se cargue tecnica, titulo, y examen realizado
    evtselt(plan: any) {
        var c;
        var d;
        for (let index = 0; index < this.us.length; index++) {
            if (this.us[index].nombre == plan) {
                this.tec = this.us[index].tecnica;
                this.tit = this.us[index].titulo;
                this.ITAnte = this.us[index].examen;
                this.plantilla = this.us[index];
                d = this.us[index].Firma;
                //console.log(this.medicos);
            }
        }
        if (this.medicos.Nombre == 'Chaxapacs') {
            this.getBase64ImageFromURL(d).subscribe(base64data => {
                //console.log(base64data);
                this.profilePic[0] = 'data:image/jpg;base64,' + base64data;
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, '--', this.plantilla, ""));
                this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, '--', this.plantilla, "");
            });
        } else {
            this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI));
            this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, '--', this.plantilla, "");
        }
    }
    //evento para cargar las plantillas segun el medico seleccionado
    evtselt2(med) {
        var a;
        var b;
        for (let i = 0; i < users.length; i++) {
            if (med == users[i].Nombre) {
                this.us = users[i].plantillas;
                this.urls = users[i].firma[0].url;
                this.medicos = users[i];
                b = users[i].Nombre;
            }
        }
        if (this.urls == '') {
            this.profilePic[0] = null;
        } else if (this.medicos.Nombre == 'Chaxapacs') {
            console.log('');
        } else {
            this.getBase64ImageFromURL(this.urls).subscribe(base64data => {
                //console.log(base64data);
                this.profilePic[0] = 'data:image/jpg;base64,' + base64data;
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.us[0], this.medicoI));
                this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.us[0], this.medicoI);
            });
            //this.iframe = true;
        }
    }
    //cargar firma medico informante
    evtselt3(medico) {
        var b;
        var c;
        for (let i = 0; i < users.length; i++) {
            if (medico == users[i].id) {
                b = users[i].firma[0].url;
                c = users[i];
                this.medicoI = users[i];
            }
        }
        if (medico == 0) {
            this.profilePic[1] = null;
        } else {
            this.getBase64ImageFromURL(b).subscribe(base64data => {
                //console.log(base64data);
                this.profilePic[1] = 'data:image/jpg;base64,' + base64data;
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI));
                this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
            });
        }
    }
    evtselt4(fecha) {
        this.as = fecha.split("-");
        this.fecha = this.as[2] + '/' + this.as[1] + '/' + this.as[0];
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        this.pdf1(this.documentDefinition3);
    }
    evtselt5(event, tipo) {
        switch (tipo) {
            case 'ti':
                this.tit = event.target.value;
                break;
            case 'ex':
                this.ITAnte = event.target.value;
                break;
            case 'te':
                this.tec = event.target.value;
                break;
            case 'ha':
                this.ITHalla = event.target.value;
                break;
            case 'im':
                this.ITImpre = event.target.value;
                break;
            default:
                console.log("error");
                break;
        }
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
    }
    evtselt6(event) {
        this.pdf1(this.documentDefinition3);
    }
    //obtener base64 de la url de una imagen
    getBase64ImageFromURL(url: string) {
        return Observable.create((observer: Observer<string>) => {
            let img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = url; img.src = url;
            if (!img.complete) {
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
    //transformar Img a base64
    getBase64Image(img: HTMLImageElement) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        //console.log(dataURL);
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    //cargar segundo select medicos
    loadS() {
        for (let is = 0; is < meidicos.length; is++) {
            if (is != meidicos.length) {
                this.m[this.a] = meidicos[is];
            }
            if (is != 2) { this.a++; }
        }
    }

    cambiarModo() {
        if (this.clase == "white") {
            this.clase = "black";
        } else {
            this.clase = "white";
        }
    }
    //metodo para generar informe en pdf
    generatePdf(med, fecf: string, plant, me) {
        this.ITHalla=document.getElementById("ITHalla").innerHTML;
        this.ITImpre=document.getElementById("ITImpre").innerHTML;
        for (let i = 0; i < users.length; i++) {
            if (med == users[i].Nombre) {
                this.as = fecf.split("-");
                fecf = this.as[2] + '/' + this.as[1] + '/' + this.as[0];
                for (let j = 0; j < users[i].plantillas.length; j++) {
                    if (plant == users[i].plantillas[j].nombre) {
                        this.plan = users[i].plantillas[j];
                        for (let k = 0; k < this.m.length; k++) {
                            if (me == this.m[k].id) {
                                console.log(this.m[k].id)
                                const documentDefinition = this.pdf.loadTemplate(this.data, this.upper(this.ITImpre), this.upper(this.ITHalla), this.ITAnte, users[i], this.tec, this.profilePic, fecf, this.plan, this.m[k]);
                                //this.documentDefinition = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, users[i], tit, tec, this.profilePic, fecf, this.plan, this.m[k]);
                                //pdfMake.createPdf(documentDefinition).open();
                                this.matDialog.open(ConfirmarComponent, {
                                    data: { value: documentDefinition }
                                });
                                this.pdf1(documentDefinition);
                            }
                        }
                    }
                }
            }
        }
    }
    pdf1(documentDefinition2) {
        pdfMake.createPdf(documentDefinition2).getBlob((blob) => {
            let objectURL = URL.createObjectURL(blob);
            //this.img=this.sanity.bypassSecurityTrustUrl(objectURL);
            this.img = objectURL;
            this.imgs = blob.size;
            this.img = this.sanity.bypassSecurityTrustResourceUrl(this.img);
            this.iframe = true;
            //console.log(objectURL);
            //console.log(this.sanity.bypassSecurityTrustResourceUrl(this.img));
        });
    }
    imge() {
        this.ITHalla=document.getElementById("ITHalla").innerHTML;
        this.ITImpre=document.getElementById("ITImpre").innerHTML;
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.upper(this.ITImpre), this.upper(this.ITHalla), this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        this.pdf1(this.documentDefinition3);
        this.iframe = true;
        this.frase2 = '';
    }
    //limpiar caja de observaciones
    clean() {
        this.msg = '';
        this.InpuText = ' ';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    //limpiar caja de texto hallazgos
    cleanh() {
        this.analisis = '';
        this.ITHalla = '';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    //limpiar caja de texto Impresion
    cleani() {
        this.impresion = '';
        this.ITImpre = '';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    //Añadir texto de observacion a hallazgos
    addH() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITHalla += this.InpuText;
        this.ITHalla = this.transcod(this.ITHalla);
        document.getElementById("ITHalla").innerHTML = this.ITHalla;
        this.msg = '';
        this.InpuText = '';
        //this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        //this.pdf1(this.documentDefinition3);
    }
    //Añadir texto de observacion a impresion
    addI() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITImpre += this.InpuText;
        this.ITImpre = this.transcod(this.ITImpre);
        document.getElementById("ITImpre").innerHTML = this.ITImpre;
        this.msg = '';
        this.InpuText = '';
        //this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        //this.pdf1(this.documentDefinition3);
    }
    //cargar lista de medicos
    loadData() {
        /*this.Service.getData().subscribe(
            data => {
                this.id = this.rutaActiva.snapshot.params.id;
                console.log(this.id);
                this.data = data[this.id];
            }
        )*/
        this.id = this.rutaActiva.snapshot.params.id;
        this.data = data[this.id];
        /*const convertAge = new Date(this.data.fechaNac);
        const timeDiff = Math.abs(Date.now() - convertAge.getTime());
        this.data.edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);*/
        this.data.edad = this.calcularEdad(this.data.fechaNac);
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.upper(this.ITImpre), this.upper(this.ITHalla), this.ITAnte, null, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        //this.pdf1(this.documentDefinition3);
        //this.evtselt2('Seleccione medico');
    }
    calcularEdad(fecha) {
        var values = fecha.split("/");
        var dia = values[1];
        var mes = values[0];
        var ano = values[2];

        // cogemos los valores actuales
        var fecha_hoy = new Date();
        var ahora_ano = fecha_hoy.getFullYear();
        var ahora_mes = fecha_hoy.getMonth() + 1;
        var ahora_dia = fecha_hoy.getDate();

        // realizamos el calculo
        var edad = (ahora_ano + 1900) - ano;
        if (ahora_mes < mes) {
            edad--;
        }
        if ((mes == ahora_mes) && (ahora_dia < dia)) {
            edad--;
        }
        if (edad > 1900) {
            edad -= 1900;
        }

        // calculamos los meses
        var meses = 0;

        if (ahora_mes > mes && dia > ahora_dia)
            meses = ahora_mes - mes - 1;
        else if (ahora_mes > mes)
            meses = ahora_mes - mes
        if (ahora_mes < mes && dia < ahora_dia)
            meses = 12 - (mes - ahora_mes);
        else if (ahora_mes < mes)
            meses = 12 - (mes - ahora_mes + 1);
        if (ahora_mes == mes && dia > ahora_dia)
            meses = 11;

        // calculamos los dias
        var dias = 0;
        if (ahora_dia > dia)
            dias = ahora_dia - dia;
        if (ahora_dia < dia) {
            const ultimoDiaMes = new Date(ahora_ano, ahora_mes - 1, 0);
            dias = ultimoDiaMes.getDate() - (dia - ahora_dia);
        }

        return edad + " años, " + meses + " meses y " + dias + " días";
    }
    abrirModal() {
        this.matDialog.open(PopUpComponent, {
            data: { value: this.rutaActiva.snapshot.params.id }
        });
    }
    Estado() {
        this.msg = "";
        if (!this.estado) {
            this.started = true;
            this.activateSpeechSearchMovie2('si')
        } else {
            this.started = false;
            this.Stop();
        }
    }
    Stop() {
        this.ab = 'no'
        this.speechRecognitionService.DestroySpeechObject();
        this.estado = false;
    }
    activateSpeechSearchMovie2(e): void {
        this.ab = e;
        this.estado = true;
        //this.showSearchButton2 = false;
        //this.speechRecognitionService.record()
        this.speechRecognitionService.show()
            .subscribe(
                //listener
                (value) => {
                    this.temp = value + '';

                    console.log(value);
                },
                //errror
                (err) => {
                    console.log(err);
                    if (err.error == "no-speech") {
                        console.log("--restatring service--");
                        this.temp = '';
                        this.activateSpeechSearchMovie2(e);
                    }
                },
                //completion
                () => {
                    this.showSearchButton2 = true;
                    console.log("--complete--");
                    //this.msg+=' '+this.temp;
                    this.msg += this.temp;
                    this.temp = '';
                    if (this.ab != 'no') {
                        this.activateSpeechSearchMovie2(e);
                    }
                    this.InpuText += this.msg + '.';
                    //this.InpuText += ' '+this.upper(this.msg);
                });
    }
    upper(frase) {
        //frase = this.transcod(frase);
        
        this.frase2 = '';
        var ind;
        var i = frase.indexOf('. ', ind);
        while (i >= 0) {
            frase = frase.replace('. ', '.').replace('.&nbsp;', '.');
            i = frase.indexOf('. ', ind)
        }
        var inda;
        var i3 = frase.indexOf('.&nbsp;', inda)
        while (i3 >= 0) {
            frase = frase.replace('.&nbsp;', '.');
            i3 = frase.indexOf('.&nbsp;', inda);
        }
        var ind2;
        var i2 = frase.indexOf('</p>');
        while (i2 >= 0) {
            console.log(frase)
            frase = frase.replace('</p>', '\n').replace('<p>', '');
            i2 = frase.indexOf('</p>', ind2);
            console.log(i2);
        }
        if (frase != '' && frase.substring(0,3)!='<p>') {
            frase = '<p>' + frase + '</p>';
        }
        //frase=frase.replace(' ','').replace('. ','.').replace('. ','.');
        var indice = 3;
        var indicePunto = frase.indexOf('.', indice);
        console.log(frase)
        if (indicePunto < 0) {
            return frase;
        } else {
            while (indicePunto >= 0) {
                console.log(frase.substring(indice,indice+1)+frase.substring(indice+12,indice+13))
                if (frase.substring(indice, indice + 6) == ('&quot;')) {
                    this.frase2 += '"'
                    this.frase2 += frase.substring(indice + 6, indice + 7).toUpperCase();
                    this.frase2 += frase.substring(indice + 7, indicePunto + 1) + ' ';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else if (frase.substring(indice, indice + 8) == ('<strong>')) {
                    this.frase2 += '<strong>'
                    this.frase2 += frase.substring(indice + 8, indice + 9).toUpperCase();
                    this.frase2 += frase.substring(indice + 9, indicePunto + 1) + ' ';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                }  else if (frase.substring(indice, indice + 4) == ('<em>')) {
                    this.frase2 += '<em>'
                    this.frase2 += frase.substring(indice + 4, indice + 5).toUpperCase();
                    this.frase2 += frase.substring(indice + 5, indicePunto + 1) + ' ';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else if( '<' == frase.substring(indice,indice+1) && '>'==frase.substring(indice+12,indice+13)) {
                    this.frase2 += frase.substring(indice,indice+13);
                    this.frase2 += frase.substring(indice+13,indice+14).toUpperCase();
                    this.frase2 += frase.substring(indice+14,indicePunto+1) + '';
                    indice=indicePunto+1;
                    indicePunto= frase.indexOf('.', indice);
                } else if ('<span style="font-size:9px">' == frase.substring(indice, indice + 28) ||
                    '<span style="font-size:8px">' == frase.substring(indice, indice + 28)) {
                    this.frase2 += frase.substring(indice, indice + 28);
                    this.frase2 += frase.substring(indice + 28, indice + 29).toUpperCase();
                    this.frase2 += frase.substring(indice + 29, indicePunto + 1) + '';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else if ('</span><span style="font-size:9px">' == frase.substring(indice, indice + 35) ||
                    '</span><span style="font-size:8px">' == frase.substring(indice, indice + 35)) {
                    this.frase2 += frase.substring(indice, indice + 35);
                    this.frase2 += frase.substring(indice + 35, indice + 36).toUpperCase();
                    this.frase2 += frase.substring(indice + 36, indicePunto + 1) + '';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else if ('<span style="font-size:10px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:11px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:12px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:14px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:16px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:18px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:20px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:22px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:24px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:26px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:28px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:36px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:48px">' == frase.substring(indice, indice + 29) ||
                    '<span style="font-size:72px">' == frase.substring(indice, indice + 29)) {
                    this.frase2 += frase.substring(indice, indice + 29);
                    this.frase2 += frase.substring(indice + 29, indice + 30).toUpperCase();
                    this.frase2 += frase.substring(indice + 30, indicePunto + 1) + '';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else if ('</span><span style="font-size:10px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:11px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:12px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:14px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:16px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:18px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:20px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:22px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:24px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:26px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:28px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:36px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:48px">' == frase.substring(indice, indice + 36) ||
                    '</span><span style="font-size:72px">' == frase.substring(indice, indice + 36)) {
                    this.frase2 += frase.substring(indice, indice + 36);
                    this.frase2 += frase.substring(indice + 36, indice + 37).toUpperCase();
                    this.frase2 += frase.substring(indice + 37, indicePunto + 1) + '';
                    indice = indicePunto + 1;
                    indicePunto = frase.indexOf('.', indice);
                } else {
                    if (frase.substring(indice, indice + 1) != "\n") {
                        this.frase2 += frase.substring(indice, indice + 1).toUpperCase();
                        this.frase2 += frase.substring(indice + 1, indicePunto + 1) + ' ';
                        indice = indicePunto + 1;
                        indicePunto = frase.indexOf('.', indice);
                    } else {
                        this.frase2 += '\n';
                        indice++;
                    }
                }
            }
            return this.frase2 + ' ';
        }
    }
    //replace
    replace(str, re) {
        var n = str.search('punto');
        str = str.replace(' punto y aparte', '. <br>').replace(' dos puntos', ':').replace(' punto ', '.').replace(' comas', ',').replace('aparte', '<br> ').replace('a parte', '<br> ').replace('comillas ', '"').replace(' comilla', '"').replace('puntos suspensivos', '...').replace('etcetera', 'etc.');
        return str;
    }
    //metodo de traduccion de palabras a simbolos
    transcod(str) {
        console.log('//msg=' + str);
        for (var i = 0; i < str.length; i++) {
            str = this.replace(str, 'punto');
        }
        console.log(str);
        return str;
    }
} 