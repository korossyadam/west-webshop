import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Chassis } from '../models/chassis.model';
import { CarSelectorService } from '../services/car-selector.service';

import * as fs from 'fs';
import { Car } from '../models/car.model';
import { MatSidenav } from '@angular/material/sidenav';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-car-selector',
  templateUrl: './car-selector.component.html',
  styleUrls: ['./car-selector.component.css']
})
export class CarSelectorComponent implements OnInit {

    subscription: Subscription;

    @ViewChild('upperSideNav') upperSideNav: MatSidenav;
    @ViewChild('lowerSideNav') lowerSideNav: MatSidenav;
    
    public brands: string[] = ['ABARTH', 'ACURA', 'AIXAM', 
    'ALFA ROMEO', 'ANDORIA', 'ARO', 'ASTON MARTIN', 'AUDI', 'AUSTIN', 'AVIA',
    'BEDFORD', 'BENTLEY', 'BMW', 'BUICK', 'CADILLAC', 'CHERY', 'CHEVROLET',
    'CHRYSLER', 'CITROEN', 'DACIA', 'DAEWOO', 'DAF', 'DAIHATSU', 'DODGE', 'DS',
    'ELARIS', 'FERRARI', 'FIAT', 'FORD', 'FORD USA', 'FSO', 'GAZ', 'GEO', 'GMC',
    'GREAT WALL', 'HONDA', 'HUMMER', 'HYUNDAI', 'INFINITI', 'INNOCENTI', 'ISUZU',
    'IVECO', 'JAGUAR', 'JEEP', 'KIA', 'LADA', 'LAMBORGHINI', 'LANCIA', 'LAND ROVER',
    'LDV', 'LEXUS', 'LINCOLN', 'LOTUS', 'MAN', 'MASERATI', 'MAYBACH', 'MAZDA',
    'MCLAREN', 'MERCEDES-BENZ', 'MG', 'MINI', 'MITSUBISHI', 'NISSAN', 'OPEL',
    'PEUGEOT', 'PLYMOUTH', 'PONTIAC', 'PORSCHE', 'RENAULT', 'RENAULT TRUCKS',
    'ROLLS-ROYCE', 'ROVER', 'SAAB', 'SEAT', 'SEVIC', 'SKODA', 'SMART', 'SSANGYONG',
    'SUBARU', 'SUZUKI', 'TATA', 'TESLA', 'TOYOTA', 'TRABANT', 'UAZ', 'VOLVO', 'VW',
    'WARTBURG', 'ZASTAVA', 'ZAZ'];

    public listElements: string[];
    public obj1: Chassis[];
    public obj2: Car[];
    public stage: number = 0;
    public lastDecor = '';

    public hoveredTextIndex = -1;

    constructor(private carSelectorService: CarSelectorService) {}

    @HostListener('document:keyup', ['$event'])
      handleKeyboardEvent(event: KeyboardEvent) { 
        if(event.key == 'Escape'){
          this.closeSideNavs();
        }
    }

    ngOnInit(): void {
        this.listElements = this.brands;
    }

    openSideNav(){
        this.upperSideNav.toggle();
        this.lowerSideNav.toggle();
    }

    closeSideNavs(){
        this.upperSideNav.close();
        this.lowerSideNav.close();
    }

    reAddBrands(inputEvent: any): void {
        var searchedText = (inputEvent.target as HTMLInputElement).value;
    
        this.listElements = [];
        var index = 0;
        for(var i = 0; i < this.brands.length; i++){
            if(this.brands[i].startsWith(searchedText.toUpperCase())){
                this.listElements[index] = this.brands[i];
            index += 1;
            }
        }
    }

  /*
  addChassis(): void {
    fetch('assets/chassis.txt').then(response => response.text()).then(data => {
      var index = 0;
      var lines = data.split('\n');
      while(index < 305){
        var chassisIndex = lines[index];
        var brand = lines[index+1].replace(/(\r\n|\n|\r)/gm, "");
        var name = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
        var imgurl = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
        var chassy = new Chassis(parseInt(chassisIndex), brand, name, imgurl);
        console.log(chassy);
        //this.networkProductService.add('NetworkProduct', Object.assign({}, new Product(uid,  this.HrefControl.value, 

        this.carSelectorService.add('chassis', Object.assign({}, chassy));

        index += 5;
      }
      
      //console.log(data);
    });
    
  }
  */
  
  addCars(): void {
    fetch('assets/cars.txt').then(response => response.text()).then(data => {
      var index = 0;
      var lines = data.split('\n');
      while(index < 911){
        var carIndex = lines[index];
        var brand = lines[index+1].replace(/(\r\n|\n|\r)/gm, "");
        var chassisIndex = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
        var chassis = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
        var engine = lines[index+4].replace(/(\r\n|\n|\r)/gm, "");
        var kw = engine.split(" ")[lines.length-3];
        var hp = engine.split(" ")[lines.length-2];
        var displacement = engine.split(" ")[lines.length-1];
        var fuel = lines[index+5].replace(/(\r\n|\n|\r)/gm, "");
        var year = "year";


        //var name = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
        //var imgurl = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
        //var chassy = new Chassis(parseInt(chassisIndex), brand, name, imgurl);
        var car = new Car(parseInt(carIndex), parseInt(chassisIndex), brand, chassis, engine, kw, hp, displacement, year, fuel);
        //console.log(chassy);
        //this.networkProductService.add('NetworkProduct', Object.assign({}, new Product(uid,  this.HrefControl.value, 

        this.carSelectorService.addCars('cars', Object.assign({}, car));

        index += 7;
      }
      
      //console.log(data);
    });
    
  }
  

  selectElements(selected: string): void {
    selected = selected.replace(/(\r\n|\n|\r)/gm, "");

    // Chassis selection (stage 0 -> stage 1)
    if(this.stage == 0){
      this.carSelectorService.selectBrand(selected).subscribe(data => {
        this.obj1 = data;
  
        this.listElements = [];
        var counter = 0;
        for(var objec of this.obj1){
          this.listElements[counter] = this.obj1[counter].name;
          counter += 1;
        }

        this.stage += 1;
      });
    
    // Engine selection (stage 1 -> stage 2)
    }else if(this.stage == 1){
      this.carSelectorService.selectChassis(selected).subscribe(data => {
        this.obj2 = data;
  
        this.listElements = [];
        var counter = 0;
        for(var objec of this.obj2){
          this.listElements[counter] = this.obj2[counter].engine;
          counter += 1;
        }

        this.stage += 1;
      });
    }
    
  }

  getNewDecor(element: string): string {
    if(this.stage == 0){
      this.lastDecor = element.charAt(0);
    }else {
      this.lastDecor = element.split(' ')[0];
    }

    return this.lastDecor;
  }

}
