import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Product } from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(public sanitizer: DomSanitizer, private _snackBar: MatSnackBar) { }

  /**
   * Adds a Product to the cart
   * Uses localStorage with JSON methods to store data
   * Products that were added before have their quantites increased
   * Products that does not have enough stock are not added
   * 
   * @param productToAdd The Product to add to the cart
   * @param quantity The amount of Product to add to the cart
   */
  addProductToCart(productToAdd: Product, quantity: number): void {

    // Get current cart from localStorage
    let currentCart = JSON.parse(localStorage.getItem('cart')) ?? [];

    // Check if product is already in cart (if no, inCartIndex will be -1)
    let inCartIndex = -1;
    for (let i = 0; i < currentCart.length; i++) {
      let productInCart: Product = currentCart[i];
      if (productInCart.partNumber == productToAdd.partNumber) {
        inCartIndex = i;
      }
    }

    // Product is not yet in cart
    if (inCartIndex == -1) {
      if (productToAdd.stock >= quantity || true) { // remove || true
        productToAdd['quantity'] = quantity;
        currentCart.push(productToAdd);
      }

      // Product is already in cart, just add quantity to alreadyInCartQuantity
    } else {
      let quantityAlreadyInCart = currentCart[inCartIndex].quantity;
      if (productToAdd.stock >= quantityAlreadyInCart + quantity || true) { // remove || true
        currentCart[inCartIndex].quantity = quantityAlreadyInCart + quantity;
      }
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
  }

  /**
  * Adds a tax to a net price
  * Ex.: 1000 => 1270
  * 
  * @param originalPrice The net price to add the tax to (string)
  * @returns A price with the tax added (string)
  */
  addTaxToPrice(originalPrice: string | number): string {
    if (typeof originalPrice == 'number')
      originalPrice = originalPrice.toString();

    return (parseInt(originalPrice) * 1.27).toString();
  }

  /**
   * Converts price strings to a prettier format
   * Ex.: 51274 => 51 274 Ft
   *      926 => 926 Ft
   *      295672 => 295 672 Ft
   * 
   * @param priceToFormat The price to format
   * @returns The formatted string
   */
  formatPriceToString(priceToFormat: string | number): string {
    let returnString = '';

    // Parse to number
    let total = 0;
    if (typeof priceToFormat == 'number') {
      total = priceToFormat;
    } else {
      total = parseInt(priceToFormat);
    }

    // Put whitespaces between numbers depending on price length
    if (total < 999)
      returnString = total + ' Ft';
    else if (total < 9999)
      returnString = total.toString().substring(0, 1) + '.' + total.toString().substring(1, total.toString().length) + ' Ft';
    else if (total < 99999)
      returnString = total.toString().substring(0, 2) + '.' + total.toString().substring(2, total.toString().length) + ' Ft';
    else if (total < 999999)
      returnString = total.toString().substring(0, 3) + '.' + total.toString().substring(3, total.toString().length) + ' Ft';

    return returnString;
  }

  /**
  * Call this function on any URL that does not get display due to security error
  * @param url The URL to sanitize
  * @returns Sanitized URL
  */
  sanitize = (url: string): SafeUrl => {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  };

  /**
    * Open a small dialog at the bottom of the screen
    * Mostly used to give feedbacks of various actions
    * 
    * @param message Text on the left of the dialog
    * @param action Button on the right of the dialog, closes the dialog
    * @param time Optional parameter, the time in miliseconds in which the dialog will close. If not provided, the dialog will not close.
    */
  openSnackBar = (message: string, action: string, time?: number): void => {
    if (time == undefined) {
      this._snackBar.open(message, action);
    } else {
      this._snackBar.open(message, action, { duration: time });
    }
  };

  /**
    * Gets the name of the guest from browser storage
    * 
    * @returns Previously saved guest name
    */
  getName(): string {
    let sessionName = sessionStorage.getItem('name');
    let localName = localStorage.getItem('name');
    if (sessionName != null) {
      return sessionName;
    } else if (localName != null) {
      return localName;
    } else {
      return '';
    }
  }

  /**
   * Gets the email of the guest from browser storage
   * 
   * @returns Previously saved guest email
   */
  getEmail(): string {
    let sessionEmail = sessionStorage.getItem('email');
    let localEmail = localStorage.getItem('email');
    if (sessionEmail != null) {
      return sessionEmail;
    } else if (localEmail != null) {
      return localEmail;
    } else {
      return '';
    }
  }

  /**
   * Gets the phone number of the guest from browser storage
   * 
   * @returns Previously saved guest phone number
   */
  getPhoneNumber(): string {
    let sessionPhone = sessionStorage.getItem('phone');
    let localPhone = localStorage.getItem('phone');
    if (sessionPhone != null) {
      return sessionPhone;
    } else if (localPhone != null) {
      return localPhone;
    } else {
      return '';
    }
  }

}