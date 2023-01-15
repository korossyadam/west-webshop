import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-featured-columns',
  templateUrl: './featured-columns.component.html',
  styleUrls: ['./featured-columns.component.css']
})
export class FeaturedColumnsComponent implements OnInit {

  // Static functions
  formatPriceToString = this.utilsService.formatPriceToString;
  addToCart = this.utilsService.addProductToCart;

   // Products that are referenced in this array will be queried
  public featuredProductNumbers = ['MMT A174 031', '39080', 'MA 19-071', 'WG02821', '39-0306', 'YT-85915', 'FT-009C'];

  // Gets populated on init
  public featuredProducts: Product[];
  public slidersMoving: number = 0;

  constructor(private utilsService: UtilsService, private productsService: ProductsService) { }

  ngOnInit(): void {
    this.populateProductsArray();
  }

  /**
   * Populates products[]
   * First attempts to fill array from localStorage, if empty, queries products from database
   */
  populateProductsArray(): void {
    this.featuredProducts = [];

    let localStorageData = localStorage.getItem('featured-columns');
    if (localStorageData && localStorageData != '[]') {
      this.featuredProducts = JSON.parse(localStorageData);
    } else {
      this.productsService.getProductsByArray(this.featuredProductNumbers).subscribe(data => {
        this.featuredProducts = data;
        localStorage.setItem('featured-columns', JSON.stringify(data));
      });
    }
  }

  /**
   * Moves the carousel forwards or backwards depending on parameter
   * 
   * @param backwards If true, slider moves backwards
   */
  async moveSlider(backwards: boolean) {
    if (this.slidersMoving > 0) {
      return;
    }

    this.slidersMoving += this.featuredProducts.length * 2;

    if (backwards) {
      this.moveSliderElements(280, false, true);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.featuredProducts = this.arrayRotate(this.featuredProducts, true);
      this.moveSliderElements(-280, true, true);
    } else {
      this.moveSliderElements(-280, false);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.featuredProducts = this.arrayRotate(this.featuredProducts, false);
      this.moveSliderElements(280, true);
    }

  }

  /**
   * Moves every product in the slider to either left or right
   * 
   * @param amount The amount of pixels to move the products with (ex.: 240)
   * @param disableTransition This parameter is needed to disable animations during correction-movements
   */
  moveSliderElements(amount: number, disableTransition: boolean, backwards: boolean = false): void {
    let elements = Array.from(document.getElementsByClassName('featured-product') as HTMLCollectionOf<HTMLElement>);
    elements.forEach(async element => {
      if (disableTransition)
        element.classList.add('notransition');

      // Get current position of the product
      let currentPosition = parseInt(element.style.left, 10);

      if (!currentPosition) {
        currentPosition = 0;
      }

      // Modify position
      if (amount < 0)
        element.style.left = (currentPosition - (element.clientWidth + 20)) + 'px';
      else
        element.style.left = (currentPosition + (element.clientWidth + 20)) + 'px';

      // This class disables all animations on the products, it is removed after a delay
      await new Promise(resolve => setTimeout(resolve, 1));
      element.classList.remove('notransition');
      this.slidersMoving -= 1;
    });
  }

  /**
   * Adds a featured Product to globally accessed cart
   * Always adds 1
   * 
   * @param product The Product to add
   */
  addProductToCart(product: Product): void {
    this.addToCart(product, 1);
  }

  /**
   * Rotates an array of Products
   * Direction depends on parameter
   * 
   * @param arr The array to rotate
   * @param reverse The direction of the rotation
   * @returns The rotated array
   */
  arrayRotate(arr: Product[], reverse: boolean) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }

    return arr;
  }

}
