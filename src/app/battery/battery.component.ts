import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Battery } from '../models/products/battery.model';
import { BatteryService } from '../services/battery.service';

@Component({
   selector: 'app-battery',
   templateUrl: './battery.component.html',
   styleUrls: ['./battery.component.css']
})
export class BatteryComponent implements OnInit {

   // FormControls for elements that allow multiple selections
   capacities = new FormControl([]);
   starters = new FormControl([]);
   widths = new FormControl([]);
   lengths = new FormControl([]);
   heights = new FormControl([]);

   // Array that holds query results
   private batteries: Battery[] = [];

   constructor(private batteryService: BatteryService) { }

   ngOnInit(): void {

   }

   search(): void {
      this.batteryService.search(12, 0, ['20-40', '40-60']).subscribe(data => this.batteries = data);
      
   }

   isCapacityDisabled(opt: string): boolean {
      return this.capacities.value.length >= 2 && !this.capacities.value.find((el: string) => el == opt)
   }

   isStarterDisabled(opt: string): boolean {
      return this.starters.value.length >= 2 && !this.starters.value.find((el: string) => el == opt)
   }

   isLengthDisabled(opt: string): boolean {
      return this.lengths.value.length >= 2 && !this.lengths.value.find((el: string) => el == opt)
   }

   isWidthDisabled(opt: string): boolean {
      return this.widths.value.length >= 2 && !this.widths.value.find((el: string) => el == opt)
   }

   isHeightDisabled(opt: string): boolean {
      return this.heights.value.length >= 2 && !this.heights.value.find((el: string) => el == opt)
   }

}
