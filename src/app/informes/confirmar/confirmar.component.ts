import { Component, OnInit, Optional, Inject, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpServiceService } from 'src/app/Services/http-service.service';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { PdfService } from '../../Services/pdf.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-confirmar',
  templateUrl: './confirmar.component.html',
  styleUrls: ['./confirmar.component.scss']
})
export class ConfirmarComponent implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;
  value: any;
  fromDialog: string;
  status: any;
  IT: any;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  img: any;
  imgs: any;
  sanity: DomSanitizer;

  constructor(private router: Router, public matDialog: MatDialog, sanity: DomSanitizer, public http: HttpServiceService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.sanity = sanity;
    pdfMake.createPdf(data.value).getBlob((blob) => {
      //console.log(blob);
      let objectURL = URL.createObjectURL(blob);
      //this.img=this.sanity.bypassSecurityTrustUrl(objectURL);
      this.img = objectURL;
      this.imgs = blob.size;
      //console.log(objectURL);
      //console.log(this.sanity.bypassSecurityTrustResourceUrl(this.img));
    });
  }
  ngOnInit() {
    //console.log(JSON.parse(this.data.value));
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
    //console.log(this.value);
    //this.value = JSON.parse(this.data.value);
    /*this.data.getBase64((data)=>{
      this.value='data:application/pdf;base64,'+data;  
    });*/
    //this.onLoad();
    //this.data.print();
    //this.value=(this.data.open({},window));
    //console.log(this.data);
  }
  imge() {
    return this.sanity.bypassSecurityTrustResourceUrl(this.img);
  }
  dispose() {
    this.matDialog.closeAll();
  }
  confirmar() {
    /*this.http.sendData(this.value).subscribe(
      status => {
        this.status=status;
      }
    );*/
    this.matDialog.closeAll();
    /*if(this.status!='OK'){
      this.matDialog.closeAll();
    }else{
      this._success.next(`${new Date()} - Error al guardar el informe.`);
    }*/
    //this._success.next(`Error al guardar el informe.`);
  }
}
