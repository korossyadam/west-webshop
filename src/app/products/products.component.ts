import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public products: Product[] = [];

  constructor(private productService: ProductsService) {}

  ngOnInit(): void {
  }

  search(): void {
    this.productService.search('parts', 'cu40110').subscribe(data => this.products = data);
    console.log('called');
  }

}
