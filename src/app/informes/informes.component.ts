import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription, Subject, Observable, Observer } from 'rxjs';
import { SpeechService } from '../Services/speech.service';
import { HttpServiceService } from '../Services/http-service.service';
import { PopUpComponent } from './pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ConfirmarComponent } from './confirmar/confirmar.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfService } from '../Services/pdf.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { CKEditorComponent } from 'ng2-ckeditor/ckeditor.component';
import { ReadVarExpr } from '@angular/compiler';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
declare var CKEDITOR: any;


@Component({
    selector: 'app-informes',
    templateUrl: './informes.component.html',
    styleUrls: ['./informes.component.scss']
})
export class InformesComponent implements OnInit, AfterViewInit {
    lader = true;
    calendar: any;
    clase: string = "white";
    profilePic = [];
    documentDefinition;
    user: any = JSON.stringify({
        id: 0,
        name: '',
        lastname: '',
        lastname_mother: '',
        birthdate: '',
        rut: '',
    });
    m: any = [];
    InpuText: string = '';
    InpuText2: string = '';
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
    started2 = false;
    data: any = JSON.stringify({
        id: 0,
        name: '',
        lastname: '',
        lastname_mother: '',
        birthdate: '',
        rut: '',
    });
    id: any;
    urls: any;
    plan: any;
    sanity: DomSanitizer;
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
    estado2: boolean = false;
    temp = '';
    temp2 = '';
    us: any;
    frase2: any = '';
    content: any = false;
    showSearchButton2: boolean;
    showSearchButton: boolean;
    ckeditorContent: string = "";
    veces: any = 0;
    frase3: any;
    frase4: any;
    arr: any;
    arr2: any;
    state: any = true;
    plat: any = [];
    inf: any = [];
    exam: any = [];
    elim: any = [];
    j: any = 0;
    disa = false;
    panelOpenState = true;
    fromDate: any = 'dd/mm/aaaa';
    trueimg: Boolean = false;
    loader: Boolean = false;
    myimg: string;
    final: Boolean = true;
    msn: string;
    @ViewChild('CKEditorComponent.inline') ckeditor: CKEditorComponent;

    //se cargan los servicios y complementos a utilizar en el component
    constructor(sanity: DomSanitizer, private http: HttpClient, public speechRecognitionService: SpeechService, private Service: HttpServiceService, private pdf: PdfService, private matDialog: MatDialog, public forms: FormsModule, private rutaActiva: ActivatedRoute) {
        this.sanity = sanity;
        this.panelOpenState = true;

    }
    //se instancian los servicios que son necesarios que se ejecuten al abrir el componente, por ejemplo para cargar informacion desde una bd
    ngOnInit(): void {
        this.loadData();
        /*setTimeout(() => {
            this.lader = false;
          }, 5000);*/
        this.iframe = false;
        this.panelOpenState = true;
        this.showSearchButton2 = true;
    }
    //Se utiliza para cargar el metodo de bindeo para usar el reconocimiento de voz con una combinacion de teclas
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
            },
            {
                key: ["alt + shift + z"],
                label: "Voz",
                description: "Voz",
                command: e => this.Estado2(),
                preventDefault: true
            }
        );
    }
    //evento al elegir plantilla se cargue tecnica, titulo, y examen realizado
    evtselt(plan: any) {
        var c;
        var d;
        for (let index = 0; index < this.us.length; index++) {
            //Si existe coincidencia almacena en examenes el examen seleccionado
            if (plan == this.us[index].name) {
                this.ITAnte = this.us[index].name;
            }
        }
        //Habilitar el boton añadir examen a informar
        this.disa = false;
        //Verificar los examenes añadidos y los que no
        for (let i = 0; i < this.inf.length; i++) {
            //Verificar si el examen seleccionado ya fue añadido
            if (this.inf[i] == plan) {
                //Si ya fue añadido desabilitar el boton añadir
                this.disa = true;
            }
        }
        this.fecha = this.fromDate;
        this.imge();
        this.lader = false;
        this.iframe = false;
    }
    //evento para cargar las plantillas segun el medico seleccionado
    evtselt2(med) {
        ////console.log(med)
        let dataPost3 = JSON.stringify({
            pet: "template",
            id: this.calendar.users_inf,
            calendar: this.plat.id,
            exam: med,
            patient: this.plat.patient
        })
        ////console.log(dataPost3)
        this.Service.getData(dataPost3).subscribe(
            data => {
                ////console.log(data)
                if (!data) {
                    this.us = [];
                } else {
                    this.us = data;
                    ////console.log(this.us)
                    for (let i = 0; i < this.us.length; i++) {
                        this.inf[i] = this.us[i].name;
                    }
                    this.exam = this.inf;
                    if (data[0].patient == this.data.id) {
                        this.evtselt(data[0].name);
                    }
                }
            }
        );
    }
    //añadir mas informes
    i: any = 0;
    addInf(plant: any) {

        this.exam[this.i] = plant;
        this.inf[this.i] = plant;
        ////console.log(this.inf);
        this.i++;
        this.disa = true;
        this.imge();
    }
    //limpiar lista de examenes seleccionados
    remInf() {
        var elementosRemovidos2 = this.inf.splice(0, this.inf.length);
        this.exam.splice(0, this.exam.length)
        this.disa = false;
        this.i = 0;
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
        return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }
    //alternar entre modo oscuro y normal
    cambiarModo() {
        if (this.clase == "white") {
            this.clase = "black";
        } else {
            this.clase = "white";
        }
    }
    //metodo para generar informe en pdf
    generatePdf(med, fecf: string, plant) {
        this.ITHalla = document.getElementById("ITHalla").innerHTML;
        this.ITImpre = document.getElementById("ITImpre").innerHTML;
        const documentDefinition = this.pdf.loadTemplate(this.data, this.upper(this.ITImpre), this.upper(this.ITHalla), this.ITAnte, this.medicos, this.tec, null, this.fecha, this.plantilla, this.medicoI);
        //this.documentDefinition = this.pdf.loadTemplate(this.data, this.ITImpre, this.ITHalla, this.ITAnte, users[i], tit, tec, this.profilePic, fecf, this.plan, this.m[k]);
        //pdfMake.createPdf(documentDefinition).open();
        this.matDialog.open(ConfirmarComponent, {
            data: { value: documentDefinition }
        });
        //pdfMake.createPdf(documentDefinition).download();
        this.pdf1(documentDefinition);
        /* pdfMake.createPdf(documentDefinition).getBlob((blob) => {
             //this.subiendoando(blob);
             this.getBase64(blob);
         }); */
    }

    //metodo para convertir el pdf en un objeto visible a traves de un iframe
    pdf1(documentDefinition2) {
        pdfMake.createPdf(documentDefinition2).getBlob((blob) => {
            let objectURL = URL.createObjectURL(blob);
            this.img = objectURL;
            this.imgs = blob.size;
            this.img = this.sanity.bypassSecurityTrustResourceUrl(this.img);
            //this.iframe = true;
            //console.log(blob);
            //this.getBase64(blob);
        });
    }
    //metodo para previsualizar el pdf en la pagina del modulo informes
    imge() {
        this.ITHalla = document.getElementById("ITHalla").innerHTML;
        this.ITImpre = document.getElementById("ITImpre").innerHTML;
        this.ITAnte = this.exam
        this.documentDefinition3 = this.pdf.loadTemplate(this.data, this.upper(this.ITImpre), this.upper(this.ITHalla), this.ITAnte, this.medicos, this.tec, this.profilePic, this.fecha, this.plantilla, this.medicoI);
        this.pdf1(this.documentDefinition3);
        this.iframe = true;
        this.frase2 = '';
    }
    //limpiar caja de observaciones
    /* clean() {
        this.msg = '';
        this.InpuText = ' ';
        this.subscription = Subscription.EMPTY;
        this.started = false;
    } */
    cleanH() {
        this.ITHalla = '';
        this.mss = '';
        this.InpuText = '';
        document.getElementById("ITHalla").innerHTML = this.ITHalla;
        this.subscription = Subscription.EMPTY;
        this.started = false;
    }
    cleanI() {
        this.ITImpre = '';
        this.msg = '';
        this.InpuText2 = ' ';
        this.started2 = false;
        document.getElementById("ITImpre").innerHTML = this.ITImpre;
        this.subscription = Subscription.EMPTY;
        this.started2 = false;
    }
    //Añadir texto de observacion a hallazgos 
    /* addH() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITHalla += this.InpuText+'.';
        document.getElementById("ITHalla").innerHTML = this.transcod(this.ITHalla);
        this.ITHalla = this.transcod(this.ITHalla);
        this.msg = '';
        this.InpuText = '';
    } */
    //Añadir texto de observacion a impresion
    /* addI() {
        if (this.InpuText == ' ') {
            this.InpuText = this.msg;
        }
        this.ITImpre += this.InpuText+'.';
        this.ITImpre = this.transcod(this.ITImpre);
        document.getElementById("ITImpre").innerHTML = this.ITImpre;
        this.msg = '';
        this.InpuText = '';
    } */
    //cargar información inicial
    loadData() {
        //obtener el id enviado por cabecera desde el calendar
        var ids = atob(this.rutaActiva.snapshot.params.id);
        console.log(ids);
        let adis = ids.split(',');
        //convertir el id en un json
        let dataP = JSON.stringify({
            //id: ids
            id: adis[0]
        });

        //llamar al http-service y enviar el json para recibir la informacion del calendar
        this.Service.Calendar(dataP).subscribe(
            data => {
                //Almacenar los datos de respuesta en una variable local
                this.calendar = data;
                //Reformatear la fecha para que tenga el formato dd/mm/aaaa
                let f = this.calendar.date_c.split('-');
                this.fromDate = f[2] + '/' + f[1] + '/' + f[0];
                //Almacenar en una variable auxiliar los datos del calendar para ser usados en otro metodo
                this.plat = this.calendar
                //Almacenar en un json el Id del paciente
                let dataPost = JSON.stringify({
                    id: this.calendar.patient,
                    pet: "patient"
                });
                //Enviar el Id del paciente en un JSON al http-service
                this.Service.getData(dataPost).subscribe(
                    data => {
                        //Almacenar la data devuelta desde el Web Service
                        this.data = data[0];
                        //Añadir el dato edad a partir de la fecha de nacimiento del paciente
                        this.data.edad = this.calcularEdad(this.data.birthdate);
                    }
                )
                //Almacenar el id del medico informante en un JSON
                let dataPost2 = JSON.stringify({
                    id: this.calendar.users_inf,
                    pet: "medico"
                })
                //Enviar el JSON para obtener los datos del medico informante
                this.Service.LoadM(dataPost2).subscribe(
                    data => {
                        //Almacenar los datos devueltos en las variables correspondientes
                        this.user = data[0];
                        this.medicos = data[0];
                    }
                )
                //Almacenar en un JSON el Medico de referencia.
                let dataPost3 = JSON.stringify({
                    id: this.calendar.ref_doctor,
                    pet: "doctor"
                })
                //Obtener la informacion del medico de referencia.
                this.Service.LoadM(dataPost3).subscribe(
                    data => {
                        for (let i = 0; i < data.length; i++) {
                            if (this.calendar.ref_doctor == data[i].id) {
                                this.m = data[i];
                                this.state = true;
                            }
                        }
                    }, error => {
                        if (this.m.length == 0) {
                            this.state = true;
                        }
                    }
                )
                let ads = '';

                for (let i = 1; i < adis.length; i++) {
                    ads += adis[i] + ',';
                }
                ads = ads.substring(0, ads.length - 1);
                //Cargar los examenes correspondientes al paciente y medico informante
                this.evtselt2(ads);

                this.content = true;
            }
        )
    }
    //Metodo para calcular la edad a partir de la fecha
    calcularEdad(fecha) {
        var values = fecha.split("-");
        var dia = values[2];
        var mes = values[1];
        var ano = values[0];

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
            data: { value: this.profilePic[0] }
        });
    }
    //Metodo para activar y desactivar el reconocimiento de voz.
    Estado() {
        console.log("Estado");
        if (!this.estado) {
            this.started = true;
            this.activateSpeechSearchMovie('si')
        } else {
            this.started = false;
            this.Stop();
        }
    }
    Estado2() {
        console.log("Estado2");

        if (!this.estado2) {
            this.started2 = true;
            this.activateSpeechSearchMovie2('si')
        } else {
            this.started2 = false;
            this.Stop2();
        }
    }
    //Metodo para detener el reconocimiento de voz
    Stop() {
        this.ab = 'no'
        this.speechRecognitionService.DestroySpeech();
        this.estado = false;
    }
    Stop2() {
        this.ab = 'no'
        this.speechRecognitionService.DestroySpeech();
        this.estado2 = false;
    }
    //Metodo de reconocimiento de Voz
    activateSpeechSearchMovie(e): void {
        this.ab = e;
        this.estado = true;
        this.speechRecognitionService.record()
            .subscribe(
                //listener
                (value) => {
                    this.temp = value;
                },
                //errror
                (err) => {
                    if (err.error == "no-speech") {
                        console.log("--restatring service--");
                        this.temp += '';
                        this.activateSpeechSearchMovie(e);
                    }
                },
                //completion
                () => {
                    this.showSearchButton = true;
                    console.log("--complete--");
                    this.msg += this.temp;
                    this.temp = '';
                    if (this.ab != 'no') {
                        this.activateSpeechSearchMovie(e);
                    }
                    this.InpuText += this.msg;
                    this.InpuText = this.transcod(this.InpuText + '.');
                    this.InpuText = this.InpuText.replace('</p>', '')
                    .replace('. ','.').replace('..', '.').replace('. .', '.');
                    this.InpuText = this.upper(this.transcod(this.InpuText));
                    document.getElementById("ITHalla").innerHTML = this.InpuText;
                    this.msg = '';
                });
    }
    activateSpeechSearchMovie2(e): void {
        this.ab = e;
        this.estado2 = true;
        this.speechRecognitionService.record()
            .subscribe(
                //listener
                (value) => {
                    this.temp2 = value;

                    //console.log(value);
                },
                //errror
                (err) => {
                    //console.log(err);
                    if (err.error == "no-speech") {
                        console.log("--restatring service--");
                        this.temp2 += '';
                        this.activateSpeechSearchMovie2(e);
                    }
                },
                //completion
                () => {
                    this.showSearchButton2 = true;
                    console.log("--complete--");
                    this.mss += this.temp2;
                    this.temp2 = '';
                    if (this.ab != 'no') {
                        this.activateSpeechSearchMovie2(e);
                    }
                    this.InpuText2 += this.mss;
                    /* this.addI(); */
                    this.InpuText2 = this.transcod(this.InpuText2 + '.');
                    this.InpuText2 = this.upper(this.transcod(this.InpuText2));
                    this.InpuText2 = this.InpuText2.replace('</p>', '')
                    .replace('. ','.').replace('..', '.').replace('. .', '.');
                    document.getElementById("ITImpre").innerHTML = this.InpuText2;
                    this.mss = '';
                });
    }
    //Metodo para convertir en mayúsculas la primera letra despues de un punto.
    upper(frase) {
        //Verificar que el texto no este vacia
        if (frase != "") {
            frase = this.contar(frase);
        }
        //limpiar variable auxiliar
        this.frase2 = '';
        //Declarar variables de indice y indicador
        var ind;
        var i = frase.indexOf('. ', ind);

        //Reemplazar los punto espacio por un punto sin espacio.
        while (i >= 0) {
            frase = frase.replace('. ', '.').replace('.&nbsp;', '.');
            i = frase.indexOf('. ', ind)
        }
        //Declarar variable auxiliar 2.
        var inda;
        var i3 = frase.indexOf('.&nbsp;', inda)
        //Reemplazar el .&nbsp; por un punto sin espacio.
        while (i3 >= 0) {
            frase = frase.replace('.&nbsp;', '.');
            i3 = frase.indexOf('.&nbsp;', inda);
        }
        //Declarar variable auxiliar 3.
        var ind2;
        var i2 = frase.indexOf('</p>');
        //Eliminar la etiqueta <p> y </p> por un espacio vacio y un salto de linea segun corresponda
        while (i2 >= 0) {
            frase = frase.replace('</p>', '\n').replace('<p>', '');
            i2 = frase.indexOf('</p>', ind2);
        }
        //Añadir etiquetas <p></p> para que este al principio y fin
        if (frase != '' && frase.substring(0, 3) != '<p>') {
            frase = '<p>' + frase + '</p>';
        }
        //Declarar variables auxiliares 4.
        var indice = 3;
        var indicePunto = frase.indexOf('.', indice);
        //Verificar la existencia de puntos en el texto
        //En caso de no existir punto devolver el texto
        if (indicePunto < 0) {
            return frase;
        }
        //Si existe al menos un punto pasa al siguiente metodo
        else {
            //Verificamos la ubicacion del punto dentro del texto
            while (indicePunto >= 0) {
                //Verificamos que si los primeros 6 caracteres del texto son un espacio en blanco.
                if (frase.substring(indice, indice + 6) == ('&quot;')) {
                    this.frase2 += '"'
                    this.frase2 += frase.substring(indice + 6, indice + 7).toUpperCase();
                    this.frase2 += frase.substring(indice + 7, indicePunto + 1) + ' ';
                    indice = indicePunto + 1;
                    //Detectar el siguiente punto
                    indicePunto = frase.indexOf('.', indice);
                } else
                    //Verificamos si los primeros 8 caracteres son una etiqueta strong
                    if (frase.substring(indice, indice + 8) == ('<strong>')) {
                        this.frase2 += '<strong>'
                        this.frase2 += frase.substring(indice + 8, indice + 9).toUpperCase();
                        this.frase2 += frase.substring(indice + 9, indicePunto + 1) + ' ';
                        indice = indicePunto + 1;
                        //Detectar el siguiente punto
                        indicePunto = frase.indexOf('.', indice);
                    } else
                        //Verificamos si los primeros caracteres son las etiquetas <ol><li>
                        if (frase.substring(indice, indice + 8) == ('<ol><li>') || frase.substring(indice, indice + 8) == ('<ul><li>')) {
                            this.frase2 += frase.substring(indice, indice + 8);
                            this.frase2 += ' ' + frase.substring(indice + 8, indice + 9).toUpperCase();
                            this.frase2 += frase.substring(indice + 9, indicePunto + 1);
                            //Verificamos la existencia de las etiquetas </li></ol> o </li></ul>
                            if (frase.substring(indicePunto + 1, indicePunto + 11) == '</li></ol>' || frase.substring(indice, indice + 8) == ('</li></ul>')) {
                                //En caso de existir el indice sera igual a 14 caracteres despues del punto
                                indice = indicePunto + 14;
                            } else {
                                //Sino sera un carácter despues del punto
                                indice = indicePunto + 1;
                            }
                            //Detectar el siguiente punto en el texto
                            indicePunto = frase.indexOf('.', indice);
                        } else
                            //Verificar si los primeros 4 caracteres son una etiqueta <em>
                            if (frase.substring(indice, indice + 4) == ('<em>')) {
                                this.frase2 += '<em>'
                                this.frase2 += frase.substring(indice + 4, indice + 5).toUpperCase();
                                this.frase2 += frase.substring(indice + 5, indicePunto + 1) + ' ';
                                indice = indicePunto + 1;
                                //Determinar la ubicación del siguiente punto
                                indicePunto = frase.indexOf('.', indice);
                            } else
                                //Verificar la existencia de un espacio vacio al principio de un texto
                                if (frase.substring(indice, indice + 1) == ' ') {
                                    this.frase2 += ' ';
                                    indice++;
                                } else
                                    //Verificar la existencia de un espacio vacio al principio de un texto
                                    if (frase.substring(indice, indice + 1) == '') {
                                        this.frase2 += '';
                                        indice++;
                                    } else
                                        //Verificar si despues del punto existe un salto de linea (<br>)
                                        if (frase.substring(indice, indice + 4) == '<br>') {
                                            this.frase2 += '<br>';
                                            indice += 4;
                                        } else {
                                            //Verificar si despues del punto no existe un salto de linea (\n)
                                            if (frase.substring(indice, indice + 2) != "\n") {
                                                this.frase2 += frase.substring(indice, indice + 1).toUpperCase();
                                                this.frase2 += frase.substring(indice + 1, indicePunto + 1) + ' ';
                                                indice = indicePunto + 1;
                                                //Detectar la ubicacion del siguiente punto
                                                indicePunto = frase.indexOf('.', indice);
                                            } else {
                                                //Si existe el salto de linea se añade al texto auxiliar
                                                this.frase2 += '\n';
                                                indice++;
                                            }
                                        }
            }

            //Se le añade al texto auxiliar el resto de texto despues del ultimo punto
            this.frase2 += frase.substring(indice, indice + 1).toUpperCase() + frase.substring(indice + 1, frase.length);
            //Se devuelve el texto.
            return this.frase2.replace('<br><br>', '<br>');
        }
    }
    //Reemplazar palabras literales añadidas desde el reconocimiento de voz
    replace(str) {
        var n = str.search('punto');
        for (let i = 0; i < 2; i++) {
            str = str.replace(' punto y aparte ', '. <br>').replace('nueva línea ', '<br>').replace(' dos puntos', ':').replace(' punto', '.').replace('.s', ' puntos ').replace(' comas', ',').replace('aparte', '<br>').replace('a parte ', '<br>').replace('comillas ', '"').replace(' comilla', '"').replace('puntos suspensivos', '...').replace('etcetera', 'etc.').replace('. ', '.');
        }
        console.log(str)
        return str;
    }
    //Metodo de traduccion de palabras a simbolos
    transcod(str) {
        for (var i = 0; i < 5; i++) {
            str = this.replace(str);
        }
        return str;
    }

    //Metodo para enumerar y listar textos de hallazgos y observacion
    contar(str: any) {
        var ind = 0;
        var k = 0;
        var ol = str.indexOf('<ol>', ind);
        //Verificar si se tiene que enumerar
        if (ol >= 0) {
            var frase = str.split('<ol>');
            str = '';
            for (var i = 0; i < frase.length; i++) {
                if (frase[i].indexOf('</ol>', 0) >= 0) {
                    this.frase3 = frase[i].split('</ol>');
                    str += ' str ' + this.frase3[1].replace('<p>', '').replace('</p>', '');
                    //Almacenar el resto del texto que no esta incluido dentro de la enumeración
                    this.arr = this.frase3[0];

                } else {
                    str += frase[i];
                    //console.log(str)
                }
            }
            var pos = this.arr.indexOf('<li>', ind);
            while (pos >= 0) {
                if (pos >= 0) {
                    this.veces++;
                    k++;
                }
                //Reemplazar enumeracion <li> por un número
                this.arr = this.arr.replace('<li>', k + '. ').replace('</li>', '.<br>');
                pos = this.arr.indexOf('<li>', ind);

            }
            //Añadir texto no incluido en la enumeración
            str = str.replace('str', '<br>' + this.arr + '<br>');
        }
        var ul = str.indexOf('<ul>', ind);
        //Verificar si hay que listar
        if (ul >= 0) {
            var fras = str.split('<ul>');
            str = ''
            for (var i = 0; i < fras.length; i++) {
                if (fras[i].indexOf('</ul>', 0) >= 0) {
                    this.frase4 = fras[i].split('</ul>');
                    str += ' stt ' + this.frase4[1];
                    //Almacenar el resto del texto que no esta incluido en la lista
                    this.arr2 = this.frase4[0];
                } else {
                    str += fras[i];
                }
            }
            var pos2 = this.arr2.indexOf('<li>', ind);
            while (pos2 >= 0) {
                if (pos2 >= 0) {
                    this.veces++;
                }
                //Reemplazar <li> por un punto de lista.
                this.arr2 = this.arr2.replace('<li>', '&#149;. ').replace('</li>', '<br>');
                pos2 = this.arr2.indexOf('<li>', ind);
            }
            //Añadir el texto que no incluia la lista.
            str = str.replace('stt', '<br>' + this.arr2 + '<br>').replace('<p>', '').replace('</p>', '');;
        }
        return str.replace('<br><br>', '<br>');
    }

    //convertir el blob del pdf en base64
    getBase64(file) {
        console.log(file)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            //console.log(reader.result);
            this.profilePic[0] = reader.result as string;
            console.log(this.profilePic[0])
            var a = this.profilePic[0].split(',');
            let dataP = JSON.stringify({
                type: a[0],
                base64: a[1]
            });
            this.matDialog.open(PopUpComponent, {
                data: this.profilePic[0]
            });
            /*this.Service.PdfToPhp(dataP).subscribe(data=>{
                    console.log('post res');
                    console.log(data);
                    
                    //this.document.location.href  = res.url;
                  });*/
            reader.onerror = (error) => {
                console.log('Error: ', error);
            };
        }
    }
}