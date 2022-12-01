import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../models/product.model';
import { AdminService } from '../services/admin.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;

  @ViewChild('dialogRef') dialogRef!: TemplateRef<any>;
  public productFiles: string[] = [];

  constructor(private utilsService: UtilsService, private dialog: MatDialog, private adminService: AdminService) { }

  ngOnInit(): void {
  }

  openNewProductDialog(): void {
    this.dialog.open(this.dialogRef, { width: '1000px' });
  }

  onFileChange(event: any) {
    this.productFiles = [];

    for (let i = 0; i < event.target.files.length; i++) {
      this.productFiles.push(event.target.files[i]);
    }
  }

  async addNewProduct(partNumber: string, name: string, description: string, specialCategory: string, brand: string, price: string, stock: string, returnable: boolean, images: any): Promise<void> {

    // Upload images first
    let imgUrls: string[] = [];
    for (let i = 0; i < this.productFiles.length; i++) {
      await this.adminService.uploadImage(this.productFiles[i]).then(data => {
        imgUrls.push(data);
      });
    }

    // Upload the actual Product
    let productToUpload = new Product(partNumber, name, description, [], parseInt(specialCategory), brand, price, [], [], parseInt(stock), returnable, imgUrls, []);
    this.adminService.addProduct(productToUpload).then(res => {
      this.showSnackBar('A termék sikeresen fel lett tölve!', 'Bezár', 4000);
    });
    
  }

}
