import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Chassis } from '../models/chassis.model';
import { CarSelectorService } from '../services/car-selector.service';
import { Car } from '../models/car.model';
import { MatSidenav } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-sidenav',
   templateUrl: './sidenav.component.html',
   styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

   // Static functions
   getName = this.utilsService.getName;
   getEmail = this.utilsService.getEmail;

   // To access sidenavs from TS
   @ViewChild('carSelectorSidenav') carSelectorSidenav: MatSidenav;
   @ViewChild('mobileSidenav') mobileSidenav: MatSidenav;

   // Whether to display menu navigation sidenav or car selector sidenav
   public menuMode: boolean = false;

   // Stores all unique prefixes is list
   public decorativeRows: string[];

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

   // Query results are stored in these arrays
   public activeBrands: string[];
   public chassis: Chassis[];
   public activeChassis: Chassis[];
   public cars: Car[];
   public activeCars: Car[];

   // Stage represents the stage of vehicle search, (ex. 1 means brand is already selected, chassis is not)
   public stage: number = 0;

   // Decorative rows in list
   public lastSelectedBrand: string;
   public lastSelectedChassis: string;

   // Image of selected chassis
   public imgCardStyle = { top: '50px' };
   public imgCardHeight = 0;
   public hoveredTextIndex = -1;
   public needToShowErrorIcon = false;

   public loading = false;

   constructor(private utilsService: UtilsService, private carSelectorService: CarSelectorService, private cdr: ChangeDetectorRef) { }

   // KeyBoardListener - we use this to close all sidenavs with ESCAPE
   @HostListener('document:keyup', ['$event'])
   handleKeyboardEvent(event: KeyboardEvent) {
      if (event.key == 'Escape') {
         this.closeSidenavs();
      }
   }

   ngOnInit(): void {
      this.activeBrands = this.brands;

      // Create listeners for both sidenavs to allow opening from utilsService
      this.utilsService.openSidenavEvent.subscribe(() => {
         this.openCarSelectorSidenav();
      });
      this.utilsService.openMobileSidenavEvent.subscribe(() => {
         this.openMenuSidenav();
      });

   }

   /**
    * Opens car selector sidenav
    * Gets called when utilsService emits a specific event
    */
   openCarSelectorSidenav() {
      this.menuMode = false;
      this.cdr.detectChanges();

      this.carSelectorSidenav.toggle();
      this.hoveredTextIndex = -1;
      this.stage = 0;
      this.activeBrands = this.brands;
      this.createDecorativeRows();
   }

   /**
    * Opens menu sidenav
    * Gets called when utilsService emits a specific event
    */
   openMenuSidenav() {
      this.menuMode = true;
      this.cdr.detectChanges();

      this.mobileSidenav.toggle();
   }

   /**
    * Closes both lower and upper sidenavs
    */
   closeSidenavs() {
      if (this.menuMode) {
         this.mobileSidenav.close();
      } else {
         this.carSelectorSidenav.close();
         this.hoveredTextIndex = -1;
      }
   }

   /**
    * This method is called every time a character is typed into the brand search bar
    * Performs a client side data filtering, only leaves in car brands that start with the searched text
    * @param inputEvent 
    */
   reAddBrands(inputEvent: any): void {
      let searchedText = (inputEvent.target as HTMLInputElement).value;

      this.activeBrands = [];
      for (let i = 0; i < this.brands.length; i++) {
         if (this.brands[i].startsWith(searchedText.toUpperCase())) {
            this.activeBrands.push(this.brands[i]);
         }
      }
   }

   /**
    * This method is called every time a character is typed into the chassis search bar
    * Filters out chassis depending on function parameters
    * 
    * @param type User input, any text, the model of car (ex. E46)
    * @param year User input, only number, the year of the car (ex. 2003)
    */
   reAddChassis(type: string, year: string): void {
      if ((parseInt(year) < 1000 || parseInt(year) > 10000) && year != '')
         return;

      this.activeChassis = [];
      this.hoveredTextIndex = -1;
      let counter = 0;

      // Check for every chassis whether they should be displayed in the list
      for (let i = 0; i < this.chassis.length; i++) {
         let c: Chassis = this.chassis[i];

         // Remove all whitespaces to make search more accurate
         let name = c.name.replace(/\s/g, '');
         type = type.replace(/\s/g, '');

         // Name check
         if (!name.toUpperCase().startsWith(type.toUpperCase()))
            continue;

         // The year the chassis started being produced
         let yearRange = c.year;
         let yearStart = parseInt(yearRange.split('/')[0]);

         // This means the chassis is still being produced as of today
         if (yearRange.split('-').length == 3) {
            if (yearStart <= parseInt(year) || year == '') {
               this.activeChassis[counter] = c;
               counter += 1;
            }
         } else {
            let yearEnd = parseInt(yearRange.split('/')[1].split(' ')[2]);
            if ((yearStart <= parseInt(year) && yearEnd >= parseInt(year)) || year == '') {
               this.activeChassis[counter] = this.chassis[i];
               counter += 1;
            }
         }
      }

      // Force change detection to avoid ERROR NG0100
      this.cdr.detectChanges();
   }

   /**
    * This method is called every time a character is typed into the engine code search bar
    * Filters out cars depending on function parameters
    * 
    * @param engine User input, any text, the model of car (ex. E46)
    * @param year User input, only number, the year of the car (ex. 2003)
    * @param kw User input, only number, the model of car (ex. 132)
    * @param hp User input, only number, the model of car (ex. 180)
    * @param fuel User input, pre-selected values, the fuel of car (ex. Gas)
    */
   reAddCars(engine: string, year: string, kw: string, hp: string, fuel: string): void {
      if ((parseInt(year) < 1000 || parseInt(year) > 10000) && year != '')
         return;

      this.activeCars = [];
      this.hoveredTextIndex = -1;
      let counter = 0;

      // Check for every car whether they should be displayed in the list
      for (let i = 0; i < this.cars.length; i++) {
         let c: Car = this.cars[i];

         // Remove all whitespaces to make search more accurate
         engine = engine.replace(/\s/g, '');

         // Engine Code check
         let engineCodes = c.engineCode.split(",");
         let exists = false;
         for (let j = 0; j < engineCodes.length; j++) {
            engineCodes[j] = engineCodes[j].replace(/\s/g, '');
            if (engineCodes[j].toUpperCase().startsWith(engine.toUpperCase()))
               exists = true;
         }

         // If none of the engine codes are present, skip this car
         if (!exists)
            continue;

         // Performance check: KW - allow +-5 error
         let carKw = c.kw;
         if (kw != '' && (parseInt(carKw) - 5 > parseInt(kw) || parseInt(carKw) + 5 < parseInt(kw)))
            continue;

         // Performance check: HP - allow +-7 error
         let carHp = c.hp;
         if (hp != '' && (parseInt(carHp) - 7 > parseInt(hp) || parseInt(carHp) + 7 < parseInt(hp)))
            continue;

         // Remove all cars with not appropriate fuel type, except when 'all' is selected
         if (fuel != 'all' && c.fuel != fuel)
            continue;

         // The year the car started being produced
         let yearRange = c.year;
         let yearStart = parseInt(yearRange.split('/')[0]);

         // This means the car is still being produced as of today
         if (yearRange.split('-').length == 3) {
            if (yearStart <= parseInt(year) || year == '') {
               this.activeCars[counter] = c;
               counter += 1;
            }
         } else {
            let yearEnd = parseInt(yearRange.split('/')[1].split(' ')[2]);
            if ((yearStart <= parseInt(year) && yearEnd >= parseInt(year)) || year == '') {
               this.activeCars[counter] = this.cars[i];
               counter += 1;
            }
         }
      }

      // Force change detection to avoid ERROR NG0100
      this.cdr.detectChanges();
   }

   // This method calls carSelectorService to check for cars in searched brand
   selectElements(selected: string): void {
      this.loading = true;
      
      // Scroll to top of the lower menu
      document.querySelectorAll('.lower-menu')[0]!.scrollTop = 0;

      selected = selected.replace(/(\r\n|\n|\r)/gm, '');
      this.hoveredTextIndex = -1;

      // Chassis selection (stage 0 -> stage 1)
      if (this.stage == 0) {
         this.stage += 1;

         // Check if chassis is already saved in localStorage
         let localStorageQuery = localStorage.getItem(selected);
         if (localStorageQuery) {
            let localStorageQueryParts = localStorageQuery.split('*');
            let data = [];
            for (let i = 0; i < localStorageQueryParts.length; i++) {
               let object = JSON.parse(localStorageQueryParts[i]);
               data.push(object);
            }

            this.chassis = data;
            this.activeChassis = this.chassis;

            // Preload all chassis images
            let urls = [];
            for (let i = 0; i < this.chassis.length; i++) {
               if (this.chassis[i].hasImg) {
                  urls.push('https://storage.googleapis.com/west-webshop.appspot.com/' + this.chassis[i].chassisIndex + '.png');
               }
            }
            this.preloadImages(urls);

            this.lastSelectedBrand = selected;
            this.loading = false;

         } else {
            this.carSelectorService.selectBrand(selected).pipe(first()).subscribe(data => {
               this.chassis = data;
               this.activeChassis = this.chassis;

               this.chassis = data;

               this.lastSelectedBrand = selected;
               this.loading = false;

               // Add query result to localStorage to optimize future queries
               let localStorageLine = '';
               for (let i = 0; i < data.length; i++) {
                  localStorageLine += '{"chassisIndex": ' + data[i].chassisIndex + ',"name": "' + data[i].name + '","year": "' + data[i].year + '","hasImg": ' + data[i].hasImg + '}*';
               }

               // Remove last '*' seperator character from string
               localStorageLine = localStorageLine.slice(0, -1);
               localStorage.setItem(selected, localStorageLine);
            });
         }

         this.createDecorativeRows();

         // Engine selection (stage 1 -> stage 2)
      } else if (this.stage == 1) {
         this.stage += 1;
         this.carSelectorService.selectChassis(selected).pipe(first()).subscribe(data => {
            this.cars = data;
            this.activeCars = this.cars;

            // Fill listelements with engine names
            this.cars = data;

            this.lastSelectedChassis = selected;
            this.loading = false;

            this.createDecorativeRows();
         });
      }

   }

   /**
    * Creates decorative rows between list elements of data
    * Depending on current stage, loops through display list
    * When a new prefix is detected, adds that to decorativeRows[]
    * Where new decorative row is not needed, element at that index will be undefined
    */
   createDecorativeRows(): void {
      this.decorativeRows = [];

      let lastRowText = '';
      if (this.stage == 0) {
         for (let i = 0; i < this.brands.length; i++) {
            let currentRowText = Array.from(this.brands[i])[0];
            if (lastRowText != currentRowText) {
               this.decorativeRows[i] = currentRowText;
               lastRowText = currentRowText;
            }
         }
      } else if (this.stage == 1) {
         for (let i = 0; i < this.chassis.length; i++) {
            let currentRowText = this.chassis[i].name.split(' ')[0];
            if (lastRowText != currentRowText) {
               this.decorativeRows[i] = currentRowText;
               lastRowText = currentRowText;
            }
         }
      } else {
         for (let i = 0; i < this.cars.length; i++) {
            let currentRowText = this.cars[i].engine.split(' ')[0];
            if (lastRowText != currentRowText) {
               this.decorativeRows[i] = currentRowText;
               lastRowText = currentRowText;
            }
         }
      }
   }

   /**
    * Check whether text prefix is included in decorativeRows[]
    * 
    * @param text The prefix to look for
    * @returns A boolean, depending if prefix is in decorativeRows[] or not
    */
   checkForDecorativeRow(text: string): boolean {
      if (!this.decorativeRows)
         return false;

      // If stage is 0, we only need the prefix's first character
      if (this.stage == 0)
         return this.decorativeRows.includes(Array.from(text)[0]);
      else
         return this.decorativeRows.includes(text);
   }

   /**
    * This function gets called when user clicks the back button
    */
   back(): void {
      if (this.stage == 1) {
         this.activeBrands = this.brands;
         this.stage = 0;
      } else {
         this.stage = 0;
         this.selectElements(this.lastSelectedBrand);
      }

      this.createDecorativeRows();
   }

   /**
    * Change the Y position of the displayed image when hovering above a selectable car
    * 
    * @param index The index of listElement that the user is hovering over
    */
   setHoveredIndex(index: number): void {
      this.hoveredTextIndex = index;
      this.needToShowErrorIcon = false;

      if (index == -1)
         return;

      const element = document.getElementById(this.hoveredTextIndex + '');
      let offset = element!.getBoundingClientRect();
      let imgCardHeight = offset.top;

      this.imgCardStyle.top = (Math.min(imgCardHeight - 73, 757) + 'px');
   }

   /**
    * Preloads images to avoid visible buffering
    * 
    * @param urls An array of image URL's to preload
    */
   preloadImages(urls: string[]) {
      for (let i = 0; i < urls.length; i++) {
         let img = new Image();
         img.src = urls[i];
      }
   }

   /**
    * Opens car selector sidenav from mobile sidenav
    */
   switchToCarSelector(): void {
      this.closeSidenavs();
      this.menuMode = false;

      this.openCarSelectorSidenav();
   }

   logOut() {
      console.log('not implemented');
   }

}
