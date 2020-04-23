import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isShown:boolean=false;
  title = 'ModuloInfo';
  lader=true;
  constructor(){
    setTimeout(() => {
      this.lader = false;
    }, 1000);
  }
}
