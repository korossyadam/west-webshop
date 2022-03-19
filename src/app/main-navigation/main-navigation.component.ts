import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {

  public searchedText: string;
  public searchedSomething: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmitSearch(): void {
    console.log("submitted");
    this.searchedSomething = true;
  }

}
