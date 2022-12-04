import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Offer } from '../models/offer.model';
import { Product } from '../models/product.model';
import { AdminService } from '../services/admin.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;

  // References to openable dialogs
  @ViewChild('newProductDialogRef') newProductDialogRef!: TemplateRef<any>;
  @ViewChild('offerDialogRef') offerDialogRef!: TemplateRef<any>;

  public productFiles: string[] = [];

  // Form for appointments query
  offerRange = new FormGroup({
    start: new FormControl(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    end: new FormControl(new Date()),
  });

  offerColumns: string[] = ['date', 'email', 'answered', 'action'];

  public offers: Offer[] = [];

  constructor(private utilsService: UtilsService, private dialog: MatDialog, private adminService: AdminService) { }

  ngOnInit(): void {}

  /**
   * Opens the dialog where admin can add new Products
   */
  openNewProductDialog(): void {
    this.dialog.open(this.newProductDialogRef, { width: '500px' });
  }

  /**
   * This function is called every time the file input value changes on new product dialog
   * @param event Contains the newly selected file references
   */
  onFileChange(event: any) {
    this.productFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      this.productFiles.push(event.target.files[i]);
    }
  }

  /**
   * Uploads a new Product
   * First, uploads all selected images, and stores their references
   * Next, the Product is saved with an array of the uploaded image's references
   */
  async addNewProduct(partNumber: string, name: string, description: string, specialCategory: string, brand: string, price: string, stock: string, returnable: boolean): Promise<void> {

    // Upload images first
    let imgUrls: string[] = [];
    for (let i = 0; i < this.productFiles.length; i++) {
      await this.adminService.uploadImage(this.productFiles[i]).then(data => {
        imgUrls.push(data);
      });
    }

    // Upload the actual Product
    let productToUpload = new Product(partNumber, name, description, [], parseInt(specialCategory), brand, price, [], [], parseInt(stock), returnable, imgUrls, []);
    this.adminService.addProduct(productToUpload).then(res => {
      this.showSnackBar('A termék sikeresen fel lett töltve!', 'Bezár', 4000);
    });

  }

  /**
   * Queries for Offers based on given criterias
   * @param from From which Date to query Offers
   * @param to To which Date to query Offers
   * @param unAnsweredOnly If true, only Offer that are not answered will show up
   */
  queryForOffers(from: Date, to: Date, unAnsweredOnly: boolean): void {
    this.adminService.getOffers(from, to, unAnsweredOnly).subscribe(data => {
      this.offers = data;
      this.showSnackBar('Sikeres lekérdezés!', 'Bezár', 4000);
    });
  }

  /**
   * Returns a string based on a boolean value
   * 
   * @param answered The boolean whether the Offer was already answered or not
   * @returns The string to be displayed
   */
  getAnsweredState(answered: boolean): string {
    if (answered)
      return 'Megválaszolva';
    else
      return 'Nincs megválaszolva'
  }

  /**
   * Opens a dialog when admin can answer an Offer
   * 
   * @param offer The Offer to answer
   */
  openOfferDialog(offer: Offer): void {
    this.dialog.open(this.offerDialogRef, { data: offer, width: '1000px' });
  }

  /**
   * Answers an Offer
   * Sets both 'answer' and 'answered' fields to appropriate value
   * @param offer The Offer we want to update
   * @param answer The answer string
   */
  answerOffer(offer: Offer, answer: string): void {
    offer.answer = answer;
    offer.answered = true;
    this.adminService.updateOffer(offer).then(res => {
      this.showSnackBar('Árajánlat sikeresen megválaszolva!', 'Bezár', 4000);
    });
  }

}
