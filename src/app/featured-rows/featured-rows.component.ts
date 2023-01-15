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
  public featuredProductNumbers = ['MMT A174 031', '39080', 'MA 19-071', 'WG02821', '39-0306', 'YT-85915', 'FT-009C'];

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

}
