import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Offer } from '../models/offer.model';
import { OfferService } from '../services/offer.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent {

  // Static functions
  getEmail = this.utilsService.getEmail;
  getUserId = this.utilsService.getUserId;
  showSnackBar = this.utilsService.openSnackBar;

  // ngModels
  public brand: string = '';
  public year: string = '';
  public ac: string = 'Klímaberendezés';
  public engine: string = '';
  public chassis: string = '';
  public vin: string = '';

  constructor(private utilsService: UtilsService, private offerService: OfferService, private router: Router) { }

  /**
   * Creates a new Offer
   * 
   * @param message The general message the user typed in
   * @param email The e-mail which the user wants to be notified at, can be empty, in which case default e-mail is used
   * @param additionalParams An array of strings, consists of products that the user checked in with checkboxes
   */
  createOffer(message: string, email: string, additionalParams: string[]): void {

    // Add checkboxes to end of the 'message'
    const additionalItems = additionalParams.filter(param => param !== '');
    if (additionalItems.length > 0) {
      message += ' EGYÉB TERMÉKEK: ' + additionalItems.join(', ');
    }

    // If user did not enter an e-mail, default e-mail address is used
    email = email || this.getEmail();

    // Create the Offer
    let offer: Offer = new Offer(this.getUserId(), this.brand, this.year, this.ac, this.engine, this.chassis, this.vin, message, email, new Date());
    this.offerService.createNewOffer(Object.assign({}, offer)).then(() => {
      this.showSnackBar('Árajánlat sikeresen létrehozva!', 'Bezárás', 4000);

      // Navigate to 'offers' screen on profile component
      this.router.navigate(['profile/4']);
    });
  }

}
