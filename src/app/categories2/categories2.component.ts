import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories2',
  templateUrl: './categories2.component.html',
  styleUrls: ['./categories2.component.css']
})
export class Categories2Component implements OnInit {

  public selectedCategoryIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
