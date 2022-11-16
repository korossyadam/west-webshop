import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { Utils } from '../utils';

@Component({
   selector: 'app-products',
   templateUrl: './products.component.html',
   styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

   @Input() searchedText = '';
   public products: Product[] = [];

   // Static function to add tax to price
   addTax = Utils.addTaxToPrice;

   constructor(private route: ActivatedRoute, private productService: ProductsService) { }

   /**
    * On init, check if there is a URL parameter specifying a product category
    * If yes, it means the user navigated here from the car-selection screen
    * This also means that the products that we need to display are saved in sessionStorage
    * Only the neccessary information is saved about the products
    */
   ngOnInit(): void {
      let searchedCategory = this.route.snapshot.paramMap.get('category');
      if (searchedCategory) {
         let productsString = sessionStorage.getItem(searchedCategory).slice(0, -1).split('*');
         console.log(productsString);

         for (let i = 0; i < productsString.length; i++) {
            let productParts = productsString[i].split('!');
            let partNumber = productParts[0];
            let name = productParts[1];
            let imgurl = productParts[2];
            let price = productParts[3];
            let brand = productParts[4];

            let newProduct = new Product(partNumber, name, '', [], brand, price, [], [], 0, true, [imgurl], []);
            this.products.push(newProduct);
         }

      }
   }

   /**
   * Increments the cart button value by 1
   * Does not increment if incremented value would be higher than the avaible product stock
   */
   incrementInputValue(inputId: string): void {
      let element = (<HTMLInputElement>document.getElementById(inputId));
      if (parseInt(element.value) >= 7)
         return;

      element.value = (parseInt(element.value) + 1).toString();
   }

   /**
    * Decrements the cart button value by 1
    * Does not decrement if decremented value would be lower than 1
    */
   decrementInputValue(inputId: string): void {
      let element = (<HTMLInputElement>document.getElementById(inputId));
      if (parseInt(element.value) <= 1)
         return;

      element.value = (parseInt(element.value) - 1).toString();
   }

   /**
   * Add a product to cart
   * Gets the value of quantity input with unique ID
   * @param productToAdd The Product to add to cart
   */
  addToCart(productToAdd: Product): void {
   let quantityInput = (document.getElementById(productToAdd.partNumber) as HTMLInputElement);
   let quantity = quantityInput.value;

   Utils.addProductToCart(productToAdd, parseInt(quantity));
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
      var returnString = '';

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

}
