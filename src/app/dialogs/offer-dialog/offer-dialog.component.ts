import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Offer } from 'src/app/models/offer.model';
import { AdminService } from 'src/app/services/admin.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-offer-dialog',
  templateUrl: './offer-dialog.component.html',
  styleUrls: ['./offer-dialog.component.css']
})
export class OfferDialogComponent implements OnInit {

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;
  timestampToDate = this.utilsService.timestampToDate;

  public offer: Offer;
  public isEditable = false;

  constructor(private utilsService: UtilsService, @Inject(MAT_DIALOG_DATA) private data: Offer, private adminService: AdminService) {
    this.offer = data;
    if (this.offer['editable']) {
      this.isEditable = true;
    }
  }

  ngOnInit(): void {
  }

  /**
   * Answers an Offer
   * Sets both 'answer' and 'answered' fields to appropriate value
   * @param offer The Offer we want to update
   * @param answer The answer string
   */
  answerOffer(offer: Offer, answer: string): void {
    if (answer) {
      offer.answer = answer;
      offer.answered = true;
      delete offer['editable'];
      this.adminService.updateOffer(offer).then(() => {
        this.showSnackBar('Árajánlat sikeresen megválaszolva!', 'Bezár', 4000);
      });
    } else {
      this.showSnackBar('A válasz üzenet nem lehet üres!', 'Bezár', 4000);
    }

  }

}
