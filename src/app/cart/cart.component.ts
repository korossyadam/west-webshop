import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
   selector: 'app-cart',
   templateUrl: './cart.component.html',
   styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

   firstFormGroup: FormGroup;
   secondFormGroup: FormGroup;

   cartItems: Product[];
   cartItemsAmount: number[];
   isCartItemUpdated: boolean[];
   subtotal: string = '';
   subtotalNet: string = '';

   trackByIdentifier = (index: number, item: Product) => item.partNumber;

   constructor(private productService: ProductsService, private _formBuilder: FormBuilder) { }

   ngOnInit(): void {
      this.firstFormGroup = this._formBuilder.group({
         firstCtrl: ['', Validators.required],
      });
      this.secondFormGroup = this._formBuilder.group({
         secondCtrl: ['', Validators.required],
      });

      this.fillCart();
   }

   fillCart(): void {
      this.cartItems = [];
      this.cartItemsAmount = [];

      var parts: string[] = localStorage.getItem('cart')?.split('/')!;

      var total = 0;
      if(parts[0] != 'undefined') {

         for(var i = 0; i < parts.length; i++) {
            var attributes = parts[i].split('!');

            var actualPrice = parseInt(attributes[3]) * this.cartItemsAmount[i];

            // Convert number to string
            var price = this.formatPriceToString(actualPrice);

            var product: Product = new Product(attributes[0], attributes[1], '', attributes[2], price, [], [], [], JSON.parse(attributes[4]), [attributes[5]]);
            this.cartItems.push(product);
            this.cartItemsAmount.push(parseInt(attributes[6]));
            total += actualPrice;
         }
      }

      // Subtotal formatting
      this.subtotal = this.formatPriceToString(total);
      this.subtotalNet = this.formatPriceToString(total / 1.27);

      
      // PLACEHOLDER
      var imgurl: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/i9gyjzcudo3yria8eoir.jpg'];
      var imgurl2: string[] = ['https://ic-files-res.cloudinary.com/image/upload/v1/item/afqdizxnrofc202wjcqa.jpg'];

      this.cartItems = [];
      var p1 = new Product("partNumber1", 'Légszűrő', 'desc', 'YATO', '2.525 Ft', [], [], [], false, imgurl)
      this.cartItems.push(p1);
      this.cartItemsAmount.push(2);
      var p2 = new Product("F142-A", 'Kalapács', 'desc', 'FILTRON', '195 Ft', [], [], [], false, imgurl2)
      this.cartItems.push(p2);
      this.cartItemsAmount.push(1);
      var p3 = new Product("AARM.S14.12", 'Xenon Fényszóró', 'desc', 'MANN-FILTER', '259.900 Ft', [], [], [], true, imgurl)
      this.cartItems.push(p3);
      this.cartItemsAmount.push(19);
      this.subtotal = '74.265 Ft';
      this.subtotalNet = '58.476 Ft';
      // PLACEHOLDER

      // Fill boolean array
      this.isCartItemUpdated = new Array(this.cartItems.length).fill(false);

   }

   openedItem(index: number): void {
      if(this.isCartItemUpdated[index])
         return;

      this.productService.getProduct('products', this.cartItems[index].partNumber).pipe(first()).subscribe(data => this.cartItems[index] = data[0]);
      this.isCartItemUpdated[index] = true;
   }

   deleteCartItem(index: number): void {

   }

   formatPriceToString(total: number): string {
      var returnString = '';

      if(total < 999)
         returnString = total + ' Ft';
      else if(total < 9999)
         returnString = total.toString().substring(0, 1) + ' ' + total.toString().substring(1, total.toString().length) + ' Ft';
      else if(total < 99999)
         returnString = total.toString().substring(0, 2) + ' ' + total.toString().substring(2, total.toString().length) + ' Ft';
      else if(total < 999999)
         returnString = total.toString().substring(0, 3) + ' ' + total.toString().substring(3, total.toString().length) + ' Ft';

      return returnString;
   }

}
