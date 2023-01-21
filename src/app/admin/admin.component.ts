import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { OfferDialogComponent } from '../dialogs/offer-dialog/offer-dialog.component';
import { OrderDialogComponent } from '../dialogs/order-dialog/order-dialog.component';
import { Offer } from '../models/offer.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { AdminService } from '../services/admin.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  devMode = false;

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;
  addTax = this.utilsService.addTaxToPrice;
  formatPrice = this.utilsService.formatPriceToString;
  sanitize = this.utilsService.sanitize;
  getLeafNodePaths = this.utilsService.getLeafNodePaths;

  // References to openable dialogs
  @ViewChild('newProductDialogRef') newProductDialogRef!: TemplateRef<any>;
  @ViewChild('deleteProductDialogRef') deleteProductDialogRef!: TemplateRef<any>;

  public categories: string[];

  // This variable keeps track of how many inputs should be visible
  public specialCategoryInputs: string[] = ['Nincs'];
  public imageUrls: string[] = [''];

  // The images to upload when uploading a new Product
  public productFiles: string[] = [];

  // Images that are visible when updating a Product
  public activeImageUrls: string[] = [];

  // Images that are going to be deleted when updating a Product
  public deletedImageUrls: string[] = [];

  // Form for Offer query
  public offerRange = new FormGroup({
    start: new FormControl(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    end: new FormControl(new Date()),
  });

  // Form for Order query
  public orderRange = new FormGroup({
    start: new FormControl(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    end: new FormControl(new Date()),
  });

  public offerColumns: string[] = ['date', 'email', 'answered', 'action'];
  public orderColumns: string[] = ['date', 'email', 'price', 'action'];

  public offers: Offer[] = [];
  public orders: Order[] = [];

  constructor(private utilsService: UtilsService, private dialog: MatDialog, private adminService: AdminService) { }

  ngOnInit(): void {

    // Convert categories JSON tree to leaf nodes with their absolute paths
    this.utilsService.getCategories().then(categoriesJson => {
      this.categories = this.getLeafNodePaths(categoriesJson);
    });
  }

  

  /**
   * Opens the dialog where admin can add new Products
   */
  openProductDialog(productToUpdate?: Product): void {
    this.dialog.open(this.newProductDialogRef, { data: productToUpdate, width: '1000px' });
  }

  attemptToOpenUpdateDialog(partNumber: string): void {
    this.adminService.getSingleProduct(partNumber).pipe(first()).subscribe(data => {
      if (data.length == 0) {
        this.showSnackBar(partNumber + ' cikkszámú termék nem létezik!', 'Bezárás', 4000);
      } else {
        this.activeImageUrls = data[0].imgurls;
        this.deletedImageUrls = [];
        this.openProductDialog(data[0]);
      }
    });
  }

  deleteImage(index: number): void {
    this.deletedImageUrls.push(this.activeImageUrls[index]);
    this.activeImageUrls.splice(index, 1);
  }

  openDeleteProductDialog(partNumber: string): void {
    this.adminService.getSingleProduct(partNumber).pipe(first()).subscribe(data => {
      if (data.length == 0) {
        this.showSnackBar(partNumber + ' cikkszámú termék nem létezik!', 'Bezárás', 4000);
      } else {
        this.dialog.open(this.deleteProductDialogRef, { data: data[0], width: '500px' });
      }
    });
  }

  deleteProduct(id: string): void {
    this.adminService.deleteProduct(id);
  }

  addSpecialCategory(): void {
    this.specialCategoryInputs.push('Nincs');
  }

  addImageUrl(): void {
    this.imageUrls.push('');
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
  async addNewProduct(partNumber: string, name: string, description: string, brand: string, price: string, stock: string, returnable: boolean): Promise<void> {
    let categories = this.createCategoriesArray();

    // Upload images first
    let imgUrls: string[] = [];
    for (let i = 0; i < this.productFiles.length; i++) {
      await this.adminService.uploadImage(this.productFiles[i]).then(data => {
        imgUrls.push(data);
      });
    }

    imgUrls.push(...this.imageUrls.filter(value => value !== ''));

    // Upload the actual Product
    let productToUpload = new Product(partNumber, name, description, [], categories, brand, price, [], [], parseInt(stock), returnable, imgUrls, []);
    this.adminService.uploadData('products', Object.assign({}, productToUpload)).then(() => {
      this.showSnackBar('A termék sikeresen fel lett töltve!', 'Bezár', 4000);
    });
  }

  /**
   * Split selected category inputs to distinct categories
   * Ex.: Equipment / Tools / Handtools => {'Equipment', 'Tools', 'Handtools'}
   *      ['Equipment / Tools / Handtools' , [Equipment / Tools / 'Electric tools'] => {'Equipment', 'Tools', 'Handtools', 'Electric tools'}
   * 
   * @returns An array of all distinct categories
   */
  createCategoriesArray(): string[] {
    let categories: string[] = [];
    for (let i = 0; i < this.specialCategoryInputs.length; i++) {
      if (this.specialCategoryInputs[i] != 'Nincs') {
        categories.push(...this.specialCategoryInputs[i].split('. ')[1].split(' / '));
      }
    }

    // Get rid of duplicataes
    categories = [...new Set(categories)];

    return categories;
  }

  async updateProduct(originalProduct: Product, uid: string, partNumber: string, name: string, description: string, brand: string, price: string, stock: string, returnable: boolean): Promise<void> {
    originalProduct.partNumber = partNumber;
    originalProduct.name = name;
    originalProduct.description = description;
    originalProduct.brand = brand;
    originalProduct.price = price;
    originalProduct.stock = parseInt(stock);

    let categories = this.createCategoriesArray();
    originalProduct.specialCategories = categories;

    if (!returnable)
      returnable = true;

    originalProduct.canBeReturned = returnable;

    this.adminService.updateProduct(Object.assign({}, originalProduct), uid).then(res => {
      this.deletedImageUrls.forEach(src => {
        this.adminService.deleteImage(src);
      });

      this.showSnackBar('A termék sikeresen módosítva lett!', 'Bezár', 4000);
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
      return 'Nincs megválaszolva';
  }

  /**
   * Opens a dialog when admin can answer an Offer
   * 
   * @param offer The Offer to answer
   */
  openOfferDialog(offer: Offer): void {
    offer['editable'] = true;
    this.dialog.open(OfferDialogComponent, { data: offer, width: '1000px' });
  }

  /**
   * Queries for Orders based on given criterias
   * 
   * @param from From which Date to query Orders
   * @param to To which Date to query Orders
   */
  queryForOrders(from: Date, to: Date): void {
    this.adminService.getOrders(from, to).subscribe(data => {
      this.orders = data;
      this.showSnackBar('Sikeres lekérdezés!', 'Bezár', 4000);
    });
  }

  /**
   * Opens the dialog where admin can view an Order
   */
  openOrderDialog(order: Order): void {
    this.dialog.open(OrderDialogComponent, { data: order, width: '1000px' });
  }

  categorizeProduct(): void {
    this.adminService.getNextUncategorizedProduct().pipe(first()).subscribe(data => {
      this.activeImageUrls = data[0].imgurls;
      this.deletedImageUrls = [];
      data[0].price = (parseInt(data[0].price) * 1.1).toString();
      this.openProductDialog(data[0]);
    });
  }

  uploadProductsFromTextFile(): void {

  }

  addUncategoriedProducts(): void {
    
  }

}
