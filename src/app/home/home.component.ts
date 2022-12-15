import { Component } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-home',
   templateUrl: './home.component.html',
   styleUrls: ['./home.component.css']
})
export class HomeComponent {

   constructor(private utilsService: UtilsService) { }

   onCarSelectorButtonClick(): void {
      this.utilsService.openCarSelectorSidenav();
   }

}
