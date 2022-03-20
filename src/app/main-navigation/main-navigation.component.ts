import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

  @ViewChild(ProductsComponent) child: ProductsComponent;

  public searchedText: string;
  public searchedSomething: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  onSearch(): void {
    this.searchedSomething = true;
    this.child.search()
  }

}
