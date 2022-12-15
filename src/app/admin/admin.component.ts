import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
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

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;
  addTax = this.utilsService.addTaxToPrice;
  formatPrice = this.utilsService.formatPriceToString;

  // References to openable dialogs
  @ViewChild('newProductDialogRef') newProductDialogRef!: TemplateRef<any>;
  @ViewChild('deleteProductDialogRef') deleteProductDialogRef!: TemplateRef<any>;
  @ViewChild('offerDialogRef') offerDialogRef!: TemplateRef<any>;
  @ViewChild('orderDialogRef') orderDialogRef!: TemplateRef<any>;

  public productFiles: string[] = [];

  // Form for offer query
  public offerRange = new FormGroup({
    start: new FormControl(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    end: new FormControl(new Date()),
  });

  // Form for order query
  public orderRange = new FormGroup({
    start: new FormControl(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    end: new FormControl(new Date()),
  });

  public offerColumns: string[] = ['date', 'email', 'answered', 'action'];
  public orderColumns: string[] = ['date', 'email', 'price', 'action'];

  public offers: Offer[] = [];
  public orders: Order[] = [];

  constructor(private utilsService: UtilsService, private dialog: MatDialog, private adminService: AdminService) { }

  ngOnInit(): void { }

  /**
   * Opens the dialog where admin can add new Products
   */
  openProductDialog(productToUpdate?: Product): void {
    this.dialog.open(this.newProductDialogRef, { data: productToUpdate, width: '500px' });
  }

  attemptToOpenUpdateDialog(partNumber: string): void {
    this.adminService.getSingleProduct(partNumber).pipe(first()).subscribe(data => {
      if (data.length == 0) {
        this.showSnackBar(partNumber + ' cikkszámú termék nem létezik!', 'Bezárás', 4000);
      } else {
        this.openProductDialog(data[0]);
      }
    });
  }

  /**
   * Opens the dialog where admin can add new Products
   */
  openDeleteProductDialog(productToDelete: Product): void {
    this.dialog.open(this.deleteProductDialogRef, { data: productToDelete, width: '500px' });
  }

  attemptToOpenDeleteProductDialog(partNumber: string): void {
    this.adminService.getSingleProduct(partNumber).pipe(first()).subscribe(data => {
      if (data.length == 0) {
        this.showSnackBar(partNumber + ' cikkszámú termék nem létezik!', 'Bezárás', 4000);
      } else {
        this.openDeleteProductDialog(data[0]);
      }
    });
  }

  deleteProduct(id: string): void {
    this.adminService.deleteProduct(id);
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
    this.adminService.addProduct(Object.assign({}, productToUpload)).then(res => {
      this.showSnackBar('A termék sikeresen fel lett töltve!', 'Bezár', 4000);
    });
  }

  async updateProduct(originalProduct: Product, uid: string, partNumber: string, name: string, description: string, specialCategory: string, brand: string, price: string, stock: string, returnable: boolean): Promise<void> {
    originalProduct.partNumber = partNumber;
    originalProduct.name = name;
    originalProduct.description = description;
    originalProduct.specialCategory = parseInt(specialCategory);
    originalProduct.brand = brand;
    originalProduct.price = price;
    originalProduct.stock = parseInt(stock);
    originalProduct.canBeReturned = returnable;

    this.adminService.updateProduct(Object.assign({}, originalProduct), uid).then(res => {
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
    this.dialog.open(this.orderDialogRef, { data: order, width: '1000px' });
  }

  /**
    * Converts a Firebase Timestamp object to a more readable Date object
    * 
    * @param timestamp The Timestamp to convert
    * @returns The Date object
    */
  timestampToDate(timestamp: any): Date {
    return timestamp.toDate();
  }

  /*
   addQuantity(): void {
      fetch('assets/quantity.txt').then(response => response.text()).then(data => {
         var index = 0;
         var lines = data.split('\n');
         while (index < 350) {
            this.carSelectorService.modifyQuantity(lines[index]);
            index += 1;
         }
      });
   }
   */


  addProducts(): void {
    fetch('assets/products.txt').then(response => response.text()).then(data => {
      var index = 257010;
      var lines = data.split('\n');
      while (index < 396123) {

        let partNumber = lines[index].replace(/(\r\n|\n|\r)/gm, "");
        let categories = lines[index + 1].replace(/(\r\n|\n|\r)/gm, "").split('*');
        let name = lines[index + 2].replace(/(\r\n|\n|\r)/gm, "");
        let description = lines[index + 3].replace(/(\r\n|\n|\r)/gm, "");
        let brand = lines[index + 4].replace(/(\r\n|\n|\r)/gm, "");
        let price = lines[index + 5].replace(/(\r\n|\n|\r)/gm, "");
        let imgurls = lines[index + 6].replace(/(\r\n|\n|\r|[|]|')/gm, "").replace('[', '').replace(']', '').split(',');
        let properties = lines[index + 7].replace(/(\r\n|\n|\r|[|]|')/gm, "").split(", ");

        for (let i = 0; i < properties.length; i++) {
          if (properties[i]) {
            properties[i] = properties[i].trim();
            if (properties[i].charAt(0) == '[') {
              properties[i] = properties[i].substring(1, properties[i].length);
            }
            if (properties[i].charAt(properties[i].length - 1) == ']') {
              properties[i] = properties[i].substring(0, properties[i].length - 1);
            }
            if (properties[i] == '*') {
              properties.splice(i, 1);
              i--;
            }
          }
        }


        for (let i = 0; i < imgurls.length; i++) {
          if (imgurls[i])
            imgurls[i] = imgurls[i].trim();
        }

        let stock = 0;
        let storages = lines[index + 8].replace(/(\r\n|\n|\r|[|]|')/gm, "").split(',');
        for (let i = 0; i < storages.length; i++) {
          let stockString = (storages[i].replace('[', '').replace(']', '').replace('>', '').split('/')[2]);
          if (stockString) {
            stock += parseInt(stockString.trim());
          } else {
            stock += 0;
          }
        }

        let factoryNumbers = lines[index + 9].replace(/(\r\n|\n|\r|[|]|')/gm, "").replace('[', '').replace(']', '').split(',');
        let returnable = lines[index + 10].replace(/(\r\n|\n|\r)/gm, "").toLowerCase() == 'true';
        let carIndexes = lines[index + 11].replace(/(\r\n|\n|\r)/gm, "").replace(' ', '').split(',');

        for (let i = 0; i < factoryNumbers.length; i++) {
          if (factoryNumbers[i])
            factoryNumbers[i] = factoryNumbers[i].trim();
        }

        for (let i = 0; i < carIndexes.length; i++) {
          if (carIndexes[i])
            carIndexes[i] = carIndexes[i].trim();
        }

        let newProduct = new Product(partNumber, name, description, categories, -1, brand, price, properties, factoryNumbers, stock, returnable, imgurls, carIndexes);
        //console.log(newProduct);
        //this.carSelectorService.addProduct(Object.assign({}, newProduct)).then(res => {
        //console.log(partNumber + ' was added');
        //});

        index += 13;
      }

    });
  }


  /*
  addChassis(): void {
    fetch('assets/chassis.txt').then(response => response.text()).then(data => {
    var index = 0;
    var lines = data.split('\n');
    while (index < 26904) {
          var chassisIndex = lines[index];
          var brand = lines[index+1].replace(/(\r\n|\n|\r)/gm, "");
          var name = lines[index+2].replace(/(\r\n|\n|\r)/gm, "");
          var year = lines[index+3].replace(/(\r\n|\n|\r)/gm, "");
 
          var hasImg = true;
          var hasImgString = lines[index+4].replace(/(\r\n|\n|\r)/gm, "");
          if (hasImgString == 'false') {
           hasImg = false;
          }
 
          var chassy = new Chassis(parseInt(chassisIndex), brand, name, year, hasImg);
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
      while(index < 185364){
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
