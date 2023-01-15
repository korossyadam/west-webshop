import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Order } from 'src/app/models/order.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.css']
})
export class OrderDialogComponent implements OnInit {

  // Static functions
  addTax = this.utilsService.addTaxToPrice;
  formatPriceToString = this.utilsService.formatPriceToString;
  sanitize = this.utilsService.sanitize;
  timestampToDate = this.utilsService.timestampToDate;

  // The Order whose data to display
  public order: Order;

  constructor(private utilsService: UtilsService, @Inject(MAT_DIALOG_DATA) private data: Order) {
    this.order = data;
  }

  ngOnInit(): void {
  }

}
