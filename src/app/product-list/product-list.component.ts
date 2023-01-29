import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KeyValue, Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { Category, UtilsService } from '../services/utils.service';
import { Sort } from '@angular/material/sort';

class CommonProperty {
   title: string;
   values = new Set<string>();
}

@Component({
   selector: 'app-product-list',
   templateUrl: './product-list.component.html',
   styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

   @Input() searchedText = '';
   public products: Product[] = [];
   public activeProducts: Product[] = [];

   // Keeps track of unloaded images to display spinners in their place
   public loadFlags: boolean[] = [];

   // Static functions
   categories = this.utilsService.categories;
   getCategories = this.utilsService.getCategories;
   addTax = this.utilsService.addTaxToPrice;
   formatPriceToString = this.utilsService.formatPriceToString;
   showSnackBar = this.utilsService.openSnackBar;

   // Initial loading flag
   public initialLoading: boolean = true;

   public childCategories: string[];

   // Variables used to filter
   public onlyInStock: boolean = false;
   public selectedBrand: string = 'all';

   // Populated by unique brands from all displayed products
   public brands: string[] = [];

   public commonProperties: CommonProperty[] = [];
   public propertiesChecked: KeyValue[] = [];

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
         let searchedPartNumber = params['partNumber'];
         let clickedCategory = params['productCategory'];

         // This runs when a product category was clicked from main-navigation
         if (clickedCategory) {
            this.queryProductsByNavigationCategory(clickedCategory);
         } else if (searchedCategory) {
            let productsString = sessionStorage.getItem(searchedCategory).slice(0, -1).split('*');

            for (let i = 0; i < productsString.length; i++) {
               let productParts = productsString[i].split('!');
               let partNumber = productParts[0];
               let name = productParts[1];
               let imgurl = productParts[2];
               let price = productParts[3];
               let brand = productParts[4];

               let newProduct = new Product(partNumber, name, '', [], [], brand, price, [], [], 0, true, [imgurl], []);
               this.products.push(newProduct);
            }
            this.activeProducts = this.products;
            this.setLoadFlags();

            this.getDistinctBrands();
            this.initialLoading = false;
         } else if (searchedPartNumber) {
            this.productsService.search(searchedPartNumber).subscribe(data => {
               this.products = data;
               this.activeProducts = data;

               this.getDistinctBrands();
               this.initialLoading = false;
            });
         }
      });

   }

   async queryProductsByNavigationCategory(clickedCategory: string): Promise<void> {

      // Find the category that was clicked
      await this.getCategories().then(categories => {

         let clickedNode = null;
         for (let category of categories) {
            clickedNode = this.findNode(category, clickedCategory) ?? clickedNode;
         }

         // Create a list of clickable child categories
         this.childCategories = this.getAllChildren(clickedNode, clickedNode, []);

         // Sort alphabetically
         this.childCategories.sort((a, b) => a.localeCompare(b));
      });

      this.productsService.getProductsBySpecialCategory(clickedCategory).subscribe(data => {
         this.products = data;
         this.activeProducts = data;

         if (data.length > 0) {
            this.getDistinctBrands();
            this.getCommonProperties();
         }
         this.initialLoading = false;
      });
   }

   findNode(node: Category, categoryName: string) {
      if (node.name == categoryName) {
         return node;
      }

      if (node.children) {
         for (const child of node.children) {
            const foundNode = this.findNode(child, categoryName);
            if (foundNode) {
               return foundNode;
            }
         }
      }

      return null;
   }

   /**
    * Gets the 'name' field of all children node of a given root node
    * 
    * @param node The root node whose children is checked
    * @param names The accumulated names
    * @returns The array of names
    */
   getAllChildren(rootNode: Category, currentNode: Category, names: string[]) {
      if (rootNode !== currentNode) {
         names.push(currentNode.name);
      }

      if (currentNode.children) {
         currentNode.children.forEach(child => this.getAllChildren(rootNode, child, names));
      }

      return names;
   }

   /**
    * Populates loadFlags[] with 'true' values
    */
   setLoadFlags(): void {
      let len = this.products.length;
      this.loadFlags = new Array(len).fill(true);
   }

   /**
    * Sets a loading flag to 'false' at a given index
    * Gets called when an image is done loading
    * 
    * @param index The index of the flag to modify
    */
   disableLoadFlag(index: number): void {
      this.loadFlags[index] = false;
   }

   getDistinctBrands(): void {
      this.brands = Array.from(new Set(this.products
         .filter(product => product.brand !== "")
         .map(product => product.brand.toUpperCase()))
   );
   }

   getCommonProperties(): void {
      this.commonProperties = [];

      // Find all common properties, and all distinct values inside them
      const properties = this.products.map(p => p.properties);
      const initialValue = this.products[0].properties.map(p => p.key);
      properties.forEach(property => {
         property.forEach(p => {
            const existingProperty = this.commonProperties.find(cp => cp.title === p.key);
            if (existingProperty) {
               existingProperty.values.add(p.value);
            } else {
               this.commonProperties.push({ title: p.key, values: new Set([p.value]) });
            }
         });
      });

      // Sort properties by their first numerical value
      this.commonProperties.forEach(prop => {
         let values = Array.from(prop.values);
         values.sort((a, b) => {
            let aValue = parseInt(a.replace(/\D/g, ''));
            let bValue = parseInt(b.replace(/\D/g, ''));
            if (isNaN(aValue) || isNaN(bValue)) {
               return 0;
            }
            return aValue - bValue;
         });
         prop.values.clear();
         values.forEach(v => prop.values.add(v));
      });
   }

   reAddElements(): void {
      this.activeProducts = this.products.slice();
      for (let i = 0; i < this.activeProducts.length; i++) {
         let product = this.activeProducts[i];
         if ((this.onlyInStock && product.stock <= 0) || (this.selectedBrand != 'all' && this.selectedBrand != product.brand)) {
            const index = this.activeProducts.indexOf(product, 0);
            if (index > -1) {
               this.activeProducts.splice(index, 1);
               i--;
            }
         }
      };
   }

   onCheckboxChange(isChecked: boolean, propertyType: string, value: string) {
      let propertyToChange: KeyValue = { key: propertyType, value: value };
      if (isChecked) {
         this.propertiesChecked.push(propertyToChange);
      } else {
         const index = this.propertiesChecked.findIndex(prop => prop.key === propertyToChange.key && prop.value === propertyToChange.value);
         this.propertiesChecked.splice(index, 1);
      }

      if (this.propertiesChecked.length == 0) {
         this.activeProducts = this.products;
         return;
      }

      this.activeProducts = this.products.filter(product => {
         return this.propertiesChecked.some(property =>
            product.properties.some(p => p.key === property.key && p.value == property.value)
         );
      });
   }

   /**
    * This function is used by mat-table to sort invidual columns
    * 
    * @param sort 
    * @returns 
    */
   sortData(sort: Sort) {
      const data = this.activeProducts.slice();
      if (!sort.active || sort.direction === '') {
         this.activeProducts = data;
         return;
      }

      this.activeProducts = data.sort((a, b) => {
         const isAsc = sort.direction === 'asc';
         switch (sort.active) {
            case 'name':
               return this.compare(a.name, b.name, isAsc);
            case 'brand':
               return this.compare(a.brand, b.brand, isAsc);
            case 'price':
               return this.compare(parseInt(a.price), parseInt(b.price), isAsc);
            case 'stock':
               return this.compare(a.stock, b.stock, isAsc);
            default:
               return 0;
         }
      });
   }

   compare(a: number | string, b: number | string, isAsc: boolean) {
      return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
   }

   /**
   * Increments the cart button value by 1
   * Does not increment if incremented value would be higher than the avaible product stock
   */
   incrementInputValue(inputId: string, maxValue: number): void {
      let element = (<HTMLInputElement>document.getElementById(inputId));
      if (parseInt(element.value) >= maxValue)
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
      this.productsService.addToWishList(productToAdd).then(() => {
         this.showSnackBar('A termék a kívánságlistádhoz lett adva!', 'Bezárás', 4000);
      });
   }

}
