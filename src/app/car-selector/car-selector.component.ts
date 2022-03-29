import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
    public lastSelectedBrand: string;
    public lastSelectedChassis: string;
    public lastDecor = '';

    public imgCardStyle = {'position': 'absolute', 'top': '50px', 'left': '500px', 'width': '150px', 'height': '200px', 'z-index': '9999999'};
    public imgCardHeight = 0;

    public hoveredTextIndex = -1;

    constructor(private carSelectorService: CarSelectorService, private cdr: ChangeDetectorRef) {}

    @HostListener('document:keyup', ['$event'])
      handleKeyboardEvent(event: KeyboardEvent) { 
        if(event.key == 'Escape'){
          this.closeSideNavs();
        }
    }

    ngOnInit(): void {
        this.listElements = this.brands;
    }

    // Opens both lower and upper sidenavs
    openSideNav(){
        this.upperSideNav.toggle();
        this.lowerSideNav.toggle();
        this.hoveredTextIndex = -1;
        this.stage = 0;
        this.listElements = this.brands;
    }

    // Closes both lower and upper sidenavs
    closeSideNavs(){
        this.upperSideNav.close();
        this.lowerSideNav.close();
        this.hoveredTextIndex = -1;
    }

    // This method is called every time a character is typed into the brand search bar
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

    // This method calls carSelectorService to check for cars in searched brand
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
          this.lastSelectedBrand = selected;
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
          this.lastSelectedChassis = selected;
        });
      }
    
    }

  // Back button
  back(): void {
    if(this.stage == 1){
      this.listElements = this.brands;
      this.stage = 0;
    }else {
      this.stage = 0;
      this.selectElements(this.lastSelectedBrand);
    }
    
    this.cdr.detectChanges();
  }

  // Check if we need to change grey line decoration inbetween listElements
  getNewDecor(element: string): string {
    if(this.stage == 0){
      this.lastDecor = element.charAt(0);
    }else {
      this.lastDecor = element.split(' ')[0];
    }

    return this.lastDecor;
  }

  // Change mat-card Y position depending on hovered listElement position
  setHoveredIndex(i: number): void {
    this.hoveredTextIndex = i;
    
    const element = document.getElementById(this.hoveredTextIndex + '');
    var offset = element!.getBoundingClientRect();
    var imgCardHeight = offset.top;

    this.imgCardStyle = {'position': 'absolute', 'left': '560px', 'top': + Math.min(imgCardHeight-73, 757) + 'px', 'width': '220px', 'height': '145px', 'z-index': '9999999'};
  }

  /*
  addChassis(): void {
    fetch('assets/chassis.txt').then(response => response.text()).then(data => {
    var index = 0;
    var lines = data.split('\n');
    while(index < 1782){
          var chassisIndex = lines[index];
          var brand = lines[index+1].replace(/(\r\n|\n|\r)/gm, "");
          var name = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
          var year = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
          var imgurl = lines[index+4].replace(/(\r\n|\n|\r)/gm, "");
          var chassy = new Chassis(parseInt(chassisIndex), brand, name, year, imgurl);
          console.log(chassy);

          this.carSelectorService.addChassis('chassis', Object.assign({}, chassy));
          index += 6;
        }
        
      });
      
    }
    */

    /*
    addCars(): void {
      fetch('assets/cars.txt').then(response => response.text()).then(data => {
        var index = 0;
        var lines = data.split('\n');
        while(index < 45240){
          var carIndex = lines[index];
          var brand = lines[index+1].replace(/(\r\n|\n|\r)/gm, "");
          var chassisIndex = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
          var chassis = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
          var engine = lines[index+4].replace(/(\r\n|\n|\r)/gm, "");
          var engineCode = lines[index+5].replace(/(\r\n|\n|\r)/gm, "");
          var year = lines[index+6].replace(/(\r\n|\n|\r)/gm, "");
          var kw = lines[index+7].replace(/(\r\n|\n|\r)/gm, "");
          var hp = lines[index+8].replace(/(\r\n|\n|\r)/gm, "");
          var displacement = lines[index+9].replace(/(\r\n|\n|\r)/gm, "");
          var fuel = lines[index+10].replace(/(\r\n|\n|\r)/gm, "");

          var car = new Car(parseInt(carIndex), parseInt(chassisIndex), brand, chassis, engine, engineCode, kw, hp, displacement, year, fuel);
          console.log(car);
  
          this.carSelectorService.addCars('cars', Object.assign({}, car));
          index += 12;
        }
        
      });
      
    }
    */

}

  

  

    /*

  */