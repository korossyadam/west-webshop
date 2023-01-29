import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { UtilsService } from '../services/utils.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-featured-rows',
  templateUrl: './featured-rows.component.html',
  styleUrls: ['./featured-rows.component.css']
})
export class FeaturedRowsComponent implements OnInit {

  // Static functions
  formatPriceToString = this.utilsService.formatPriceToString;
  addToCart = this.utilsService.addProductToCart;

  // Products that are referenced in this array will be queried
  public featuredProductNumbers = ['PSZ-1-01', 'TLD-FE-8', 'ML-N-9x3', 'FKT-01', 'FT-009A', 'PCHARGE4V2', 'YT-14501'];

  // Gets populated on init
  public featuredProducts: Product[];

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

    let localStorageData = localStorage.getItem('featured-rows');
    if (localStorageData && localStorageData != '[]') {
      this.featuredProducts = JSON.parse(localStorageData);
    } else {
      this.productsService.getProductsByArray(this.featuredProductNumbers).subscribe(data => {
        this.featuredProducts = data;
        localStorage.setItem('featured-rows', JSON.stringify(data));
      });
    }
  }

  /**
   * Gets the last special category of a product
   * This is used to display a button to browse products in the same category
   * 
   * @param product The product whose last special category will be returned
   * @returns The buttons inner text, a string
   */
  getExactCategory(product: Product): string {
    let arr = product.specialCategories;
    if (!arr)
      return '';

    return arr[arr.length - 1];
  }

}
