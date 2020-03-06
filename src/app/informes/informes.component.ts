import { Component, OnInit } from '@angular/core';
import { Subscription, Subject, Observable, Observer } from 'rxjs';
import { SpeechService } from '../Services/speech.service';
import { takeUntil } from 'rxjs/operators';
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
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { InformesService } from '../Services/informes.service';
import { DomSanitizer } from '@angular/platform-browser';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
    selector: 'app-informes',
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit {

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
    ITAnte: string = '   ';
    tit: string = '';
    tec: string = '';
    analisis = '';
    ITHalla: string = '   ';
    impresion = '';
    ITImpre: string = '   ';
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
    documentDefinition3:any;
    iframe:boolean;

    constructor(sanity: DomSanitizer, private http: HttpClient, public speech: SpeechService, private Service: HttpServiceService, private pdf: PdfService, private matDialog: MatDialog, public forms: FormsModule, private rutaActiva: ActivatedRoute, private infor: InformesService) {
        //this.loadData();
        this.loadS();
        this.sanity = sanity;
    }
    ngOnInit(): void {
        this.loadData();
        this.iframe=false;
        /*setInterval(()=>{
            //this.imge();
            this.pdf1(this.documentDefinition3);
        },1000);*/
        
        this.user = users;
        this.speech.init();
        this.speech.stop();
        this.speech.message.pipe(
            takeUntil(this._destroyed)
        ).subscribe(msg => this.msg += ' ' + this.transcod(msg));
        this.speech.context.pipe(
            takeUntil(this._destroyed)
        ).subscribe(context => this.analisis = context);
        this.speech.started.pipe(
            takeUntil(this._destroyed)
        ).subscribe(started => this.started = started);
    }
   
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
                console.log(this.medicos);
            }
        }
        if (this.medicos.Nombre == 'Chaxapacs') {
            this.getBase64ImageFromURL(d).subscribe(base64data => {
                //console.log(base64data);
                this.profilePic[0] = 'data:image/jpg;base64,' + base64data;
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, '--', this.plantilla, ""));
            });
        } else {
            this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI));
        }
    }
    //evento para cargar las plantillas segun el medico seleccionado
    evtselt2(med) {
        var a;
        var b;
        console.log(med);
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
                console.log('1');
                this.profilePic[0] = 'data:image/jpg;base64,' + base64data;
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.us[0], this.medicoI));
            });
            this.iframe=true;
        }
    }
    //cargar firma medico informante
    evtselt3(medico) {
        var b;
        var c;
        console.log(medico);
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
                this.pdf1(this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI));
            });
        }
        


    }
    evtselt4(fecha) {
        this.as = fecha.split("-");
        this.fecha = this.as[2] + '/' + this.as[1] + '/' + this.as[0];
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        this.pdf1(this.documentDefinition3);
    }
    evtselt5(event,tipo) {
        switch (tipo) {
            case 'ti':
                this.tit=event.target.value;
                break;
            case 'ex':
                this.ITAnte=event.target.value;
                break;
            case 'te':
                this.tec=event.target.value;
                break;
            case 'ha':
                this.ITHalla=event.target.value;
                break;
            case 'im':
                this.ITImpre=event.target.value;
                break;
            default:
                console.log("error");
                break;
        }
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        
    }
    evtselt6(event){
        this.pdf1(this.documentDefinition3);
    }
    onKeydown(event){
        if(event.key === "." || event.key === ","){
            this.pdf1(this.documentDefinition3);
        }
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
    getBase64ImageFromURL2(url: string) {
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
    //metodo para transformar imagenes
    toDataUrl(urlss, callback) {
        var vara;
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
                vara = reader.result as string;

            }
            reader.readAsDataURL(xhr.response);
        };
        console.log(vara)
        xhr.open('GET', urlss);
        xhr.responseType = 'blob';
        xhr.send();
        console.log(xhr);
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
    //metodo de traduccion de palabras a simbolos
    transcod(str) {
        console.log('//msg=' + str.message);
        this.mss = str.message.replace(' punto y aparte', '.\n ^').replace(' dos puntos', ':').replace(' punto p', '.').replace(' comas', ',').replace('aparte', '\n ').replace('a parte', '\n ').replace('comillas ', '"').replace(' comilla ', '"');
        this.InpuText += this.mss[0].toLocaleUpperCase() + this.mss.substring(1);
        console.log(this.InpuText);
        return this.InpuText;
    }
    ngOnDestroy(): void {
        this._destroyed.next();
        this._destroyed.complete();
        this.subscription.unsubscribe();
    }
    //metodo para mostrar en pantalla un examen anterior
    verExamen(exam) {
        for (let i = 0; i < users.length; i++) {
            if (exam.usuario == users[i].id) {
                this.media = users[i].Nombre;
                for (let j = 0; j < users[i].plantillas.length; j++) {
                    if (exam.plantilla == users[i].plantillas[j].nombre) {
                        const documentDefinition2 = this.infor.loadTemplate2(this.data, exam.Impresión, exam.Hallazgos, users[i].plantillas[j].examen, users[i], users[i].plantillas[j].titulo, users[i].plantillas[j].tecnica, '', exam.fechaE, users[i].plantillas[j], exam.fechaI);
                        this.matDialog.open(ConfirmarComponent, {
                            data: { value: documentDefinition2 }
                        });
                    }
                }
            }
        }
    }
    toggleVoiceRecognition(): void {
        if (this.started) {
            this.speech.stop();
        } else {
            this.speech.start();
        }
    }
    cambiarModo(){
        var cuerpoweb= document.body;
        cuerpoweb.classList.toggle("oscuro");
    }
    //metodo para generar informe en pdf
    generatePdf(med, tit, tec, fecf: string, plant, me) {
        for (let i = 0; i < users.length; i++) {
            if (med == users[i].Nombre) {
                this.as = fecf.split("-");
                fecf = this.as[2] + '/' + this.as[1] + '/' + this.as[0];
                console.log(fecf);
                console.log(med);
                for (let j = 0; j < users[i].plantillas.length; j++) {
                    if (plant == users[i].plantillas[j].nombre) {
                        this.plan = users[i].plantillas[j];
                        for (let k = 0; k < this.m.length; k++) {
                            if (me == this.m[k].id) {
                                console.log(this.m[k].id)
                                const documentDefinition = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, users[i], tit, tec, this.profilePic, fecf, this.plan, this.m[k]);
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
            //console.log(blob);
            let objectURL = URL.createObjectURL(blob);
            //this.img=this.sanity.bypassSecurityTrustUrl(objectURL);
            this.img = objectURL;
            this.imgs = blob.size;
            this.iframe=true;
            //console.log(objectURL);
            //console.log(this.sanity.bypassSecurityTrustResourceUrl(this.img));
        });

    }
    imge() {
        if(this.iframe==true){
        return this.sanity.bypassSecurityTrustResourceUrl(this.img);
    }
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
        this.ITHalla = '  ';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    //limpiar caja de texto Impresion
    cleani() {
        this.impresion = '';
        this.ITImpre = '  ';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    //Añadir texto de observacion a hallazgos
    addH() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITHalla += this.InpuText;
        this.msg = '';
        this.InpuText = '';
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);

        this.pdf1(this.documentDefinition3);

    }
    //Añadir texto de observacion a impresion
    addI() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITImpre += this.InpuText;
        this.msg = '';
        this.InpuText = '';
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, this.medicos, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);

        this.pdf1(this.documentDefinition3);

    }
    recordStart(): void {
        this.subscription = this.speech.message.subscribe(msg => {
            this.msg = msg.message;
        });
    }
    recordStop(): void {
        this.subscription.unsubscribe();
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
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, null, this.tit, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        this.pdf1(this.documentDefinition3);
        //this.evtselt2('Seleccione medico');

    }
    abrirModal() {
        this.matDialog.open(PopUpComponent, {
            data: { value: this.rutaActiva.snapshot.params.id }
        });
    }
    //elegir firma medico
    fileChanged(e) {
        const file = e.target.files[0];
        this.getBase64(file);
    }
    fileChanged2(e) {
        const file = e.target.files[0];
        this.getBase642(file);
    }
    //quitar firma medico
    cleanf() {
        this.profilePic[0] = null;
    }
    cleanfi() {
        this.profilePic[1] = null;
    }
    //transformar imagen en base 64 para ser mostrada en el informe
    getBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result);
            this.profilePic[0] = reader.result as string;
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }
    getBase642(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            console.log(reader.result);
            this.profilePic[1] = reader.result as string;
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }
    getBase643(file) {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = () => {
            console.log(reader.result);
            this.profilePic[1] = reader.result as string;
        };
        reader.onerror = (error) => {
            console.log('Error: ', error);
        };
    }
} 