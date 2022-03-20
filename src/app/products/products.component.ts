import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  @Input() searchedText = '';
  public products: Product[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.productService.search('products', this.searchedText).subscribe(data => this.products = data);
    console.log('called');
  }

}
