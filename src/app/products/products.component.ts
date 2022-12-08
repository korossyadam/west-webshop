import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { UtilsService } from '../services/utils.service';

@Component({
   selector: 'app-products',
   templateUrl: './products.component.html',
   styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

   @Input() searchedText = '';
   public products: Product[] = [];

   // Static functions
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   showSnackBar = this.utilsService.openSnackBar;

   public initialLoading: boolean = true;

   constructor(private route: ActivatedRoute, private utilsService: UtilsService, private productsService: ProductsService) { }

   /**
    * On init, check if there is a URL parameter specifying a product category
    * If yes, it means the user navigated here from the car-selection screen
    * This also means that the products that we need to display are saved in sessionStorage
    * Only the neccessary information is saved about the products
    */
   ngOnInit(): void {
      this.route.params.subscribe(params => {
         let searchedCategory = params['category'];
         let searchedPartNumber =  params['partNumber'];
         let clickedCategory =  params['specialCategory'];

         if (searchedCategory) {
            let productsString = sessionStorage.getItem(searchedCategory).slice(0, -1).split('*');

            for (let i = 0; i < productsString.length; i++) {
               let productParts = productsString[i].split('!');
               let partNumber = productParts[0];
               let name = productParts[1];
               let imgurl = productParts[2];
               let price = productParts[3];
               let brand = productParts[4];

               let newProduct = new Product(partNumber, name, '', [], 0, brand, price, [], [], 0, true, [imgurl], []);
               this.products.push(newProduct);
            }
            
            this.initialLoading = false;
         } else if (clickedCategory) {
            this.productsService.getProductsBySpecialCategory(parseInt(clickedCategory)).subscribe(data => {
               this.products = data;
               this.initialLoading = false;
            })
         } else if (searchedPartNumber) {
            this.productsService.search(searchedPartNumber).subscribe(data => {
               this.products = data;
               this.initialLoading = false;
            })
         }
      });
      
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

      this.utilsService.addProductToCart(productToAdd, parseInt(quantity));
   }

   /**
    * Adds a Product to wishlist
    * On Promise resolve, show a snackbar as feedback
    * 
    * @param productToAdd The Product to add to wishlist
    */
   addToWishList(productToAdd: Product): void {
      this.productsService.addToWishList(productToAdd).then(res => {
         this.showSnackBar('A termék a kívánságlistádhoz lett adva!', 'Bezárás', 4000);
      });
   }

}
