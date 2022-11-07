import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  // Keeps track of product that we want to show
  public currentProductId: string;
  public currentProduct: Product;
  public propertyTypes: string[] = [];
  public propertyValues: string[] = [];
  public factoryNumberCodes: string[] = [];
  public factoryNumberBrands: string[] = [];

  // What information to display
  public displayedInformation: number;

  constructor(private route: ActivatedRoute, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.currentProductId = this.route.snapshot.paramMap.get('partNumber');
    this.productsService.getProduct(this.currentProductId).subscribe(data => {
      this.currentProduct = data[0];

      // Fill up properties array
      for (let i = 0; i < this.currentProduct.properties.length; i++) {
        this.propertyTypes[i] = this.currentProduct.properties[i].split('*')[0];
        this.propertyValues[i] = this.currentProduct.properties[i].split('*')[1];
      }

      // Fill up factory numbers array
      for (let i = 0; i < this.currentProduct.factoryNumbers.length; i++) {
        this.factoryNumberCodes[i] = this.currentProduct.factoryNumbers[i].split('*')[0];
        this.factoryNumberBrands[i] = this.currentProduct.factoryNumbers[i].split('*')[1];
      }
    });

    this.displayedInformation = 0;
  }

  /**
   * Increments the cart button value by 1
   * Does not increment if incremented value would be higher than the avaible product stock
   */
  incrementInputValue(): void {
    let element = (<HTMLInputElement> document.getElementById('amount-input'));
    if (parseInt(element.value) >= 7)
      return;

    element.value = (parseInt(element.value) + 1).toString();
  }

  /**
   * Decrements the cart button value by 1
   * Does not decrement if decremented value would be lower than 1
   */
  decrementInputValue(): void {
    let element = (<HTMLInputElement> document.getElementById('amount-input'));
    if (parseInt(element.value) <= 1)
      return;

    element.value = (parseInt(element.value) - 1).toString();
  }

  /**
   * Adds a tax to a net price
   * Ex.: 1000 => 1270
   * 
   * @param originalPrice The net price to add the tax to (string)
   * @returns A price with the tax added (string)
   */
  addTaxToPrice(originalPrice: string): string {
    return (parseInt(originalPrice)*1.27).toString();
  }

  /**
    * Converts price strings to a prettier format
    * Ex.: 51274 => 51 274 Ft
    *      926 => 926 Ft
    *      295672 => 295 672 Ft
    * 
    * @param totalString The price to format
    * @returns The formatted string
    */
  formatPriceToString(totalString: string): string {
    let returnString = '';

    let total = parseInt(totalString);
    if (total < 999)
      returnString = total + ' Ft';
    else if (total < 9999)
      returnString = total.toString().substring(0, 1) + ' ' + total.toString().substring(1, total.toString().length) + ' Ft';
    else if (total < 99999)
      returnString = total.toString().substring(0, 2) + ' ' + total.toString().substring(2, total.toString().length) + ' Ft';
    else if (total < 999999)
      returnString = total.toString().substring(0, 3) + ' ' + total.toString().substring(3, total.toString().length) + ' Ft';

    return returnString;
  }

  /**
   * Changes the displayed specification 
   * 
   * @param newState 
   */
  changeInformationDisplay(newState: number): void {
    this.displayedInformation = newState;
  }

}