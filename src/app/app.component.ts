import { Component } from '@angular/core';
import listaExam from '../assets/json/bd.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isShown:boolean=false;
  title = 'ModuloInfo';
  bd: any = listaExam;
}
