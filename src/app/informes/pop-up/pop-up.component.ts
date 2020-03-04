import { Component, OnInit, ViewChild, Input, ViewChildren, Optional, Inject } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { SpeechService } from '../../Services/speech.service';
import { takeUntil } from 'rxjs/operators';
import { HttpServiceService } from '../../Services/http-service.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InformesComponent } from '../informes.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {
  id: any;
  value: any;
  private _destroyed = new Subject<void>();

  constructor(public speech: SpeechService,private Service:HttpServiceService,private matDialog:MatDialog,private route:Router, @Optional() @Inject(MAT_DIALOG_DATA) public data:any ){
    this.value = data.value;
  }
  ngOnInit(): void {
}

ngOnDestroy(): void {
}

dispose(){
  this.matDialog.closeAll();
}
aceptar(){
  console.log(this.value);
  this.route.navigateByUrl('informes/'+this.value);
  this.dispose();
}
}
