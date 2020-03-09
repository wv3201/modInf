import { Component, OnInit, Optional, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { SpeechService } from '../../Services/speech.service';
import { HttpServiceService } from '../../Services/http-service.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
