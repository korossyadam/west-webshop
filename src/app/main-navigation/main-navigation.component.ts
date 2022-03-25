import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css'],
})
export class MainNavigationComponent implements OnInit {

  public step: number = 0;
  
  @Output() carSelectClickedEvent = new EventEmitter<boolean>();
  @ViewChild(ProductsComponent) child: ProductsComponent;

  value = "";
  public searchedText: string;
  public searchedSomething: boolean = false;

  isIf: boolean;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  updatChildIf(): void {
    this.isIf = !this.isIf;
    this.changeDetectorRef.detectChanges();
    console.log("child", this.child);
    if(localStorage.getItem('user') == null){}
  }

  onSearch(): void {
    this.searchedSomething = true;
    this.child.search()
  }

  onCarSelectorButtonClick(): void {
   this.carSelectClickedEvent.emit(true);
  }
   
   localStorageUser(): string {var currentUser = localStorage.getItem('user');
      if(currentUser != null){
         return currentUser;
      }else{
         return '';
      }
  }

}