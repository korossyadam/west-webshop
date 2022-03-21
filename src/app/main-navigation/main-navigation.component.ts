import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

  public step: number = 0;

  @ViewChild(ProductsComponent) child: ProductsComponent;

  public searchedText: string;
  public searchedSomething: boolean = false;

  isIf: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  updatChildIf(): void {
    this.isIf = !this.isIf;
    this.changeDetectorRef.detectChanges();
    console.log("child", this.child);
  }

  onSearch(): void {
    this.searchedSomething = true;
    this.child.search()
  }

}
