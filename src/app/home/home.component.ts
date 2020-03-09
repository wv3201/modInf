import { Component, OnInit } from '@angular/core';
import { HttpServiceService } from '../Services/http-service.service';
import { ActivatedRoute } from '@angular/router';
import data from '../../assets/json/Usuarios.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  data: any;
  id: any;
  apiUrl: any;
  constructor(private Service: HttpServiceService, private rutaActiva: ActivatedRoute) {
    this.loadData();
  }

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    console.log("0");
    this.data = data;
    /*this.Service.getData().subscribe(data=>{
      this.data=data;
      console.log("2")
    })*/
  }

}
