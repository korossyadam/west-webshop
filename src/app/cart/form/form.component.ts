import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  // Static functions
  showSnackBar = this.utilsService.openSnackBar;
  
  @Input() form: FormGroup;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
  }

  /**
    * Changes the display of 'Tax Number' input field
    * 'height: 0px' used instead of 'display: none' for smoother animations
    * 
    * @param event Whether the checkbox is checked or not
    */
  showTaxNumberFields(event: MatCheckboxChange): void {
    let container = <HTMLInputElement>document.getElementsByClassName('tax-number-container')[0];

    if (event.checked) {
      container.style.height = '46px';
    } else {
      container.style.height = '0px';
    }

    // Open invoice fields since Tax Number field is in invoice fields
    this.showInvoiceFields();
  }

  /**
   * Open up invoice input fields
   */
  showInvoiceFields(): void {
    let container = <HTMLInputElement>document.getElementsByClassName('invoice-container')[0];
    container.style.height = '160px';
  }

  /**
   * Changes the display of invoice input fields
   * 'height: 0px' used instead of 'display: none' for smoother animations
   * 
   * @param event Whether the checkbox is checked or not
   */
  changeInvoiceFieldsDisplay(event: MatCheckboxChange): void {
    let container = <HTMLInputElement>document.getElementsByClassName('invoice-container')[0];

    if (!event.checked) {
      container.style.height = '160px';
    } else {
      container.style.height = '0px';
    }
  }

  attemptToValidate(): void {
    if (this.form.controls.name.hasError('required')) {
      this.showSnackBar('A név mező kitöltése kötelező.', 'Bezárás', 4000);
    } else if (this.form.controls.email.hasError('required')) {
      this.showSnackBar('Az e-mail cím mező kitöltése kötelező.', 'Bezárás', 4000);
    } else if (this.form.controls.phone.hasError('required')) {
      this.showSnackBar('A telefonszám mező kitöltése kötelező.', 'Bezárás', 4000);
    } else if (this.form.controls.zip.hasError('required')) {
      this.showSnackBar('Az irányítószám mező kitöltése kötelező.', 'Bezárás', 4000);
    } else if (this.form.controls.city.hasError('required')) {
      this.showSnackBar('A település mező kitöltése kötelező.', 'Bezárás', 4000);
    } else if (this.form.controls.street.hasError('required')) {
      this.showSnackBar('Az utca mező kitöltése kötelező.', 'Bezárás', 4000);
    } else {
      this.autoFillInvoiceFields();
    }
  }

  /**
   * This function autofills every invoice related input fields when 'same as shipping address' checkbox is clicked
   */
  autoFillInvoiceFields(): void {
    if (!this.form.controls.sameAsShippingAddress.value)
      return;

    this.form.controls.invoiceName.setValue(this.form.controls.name.value);
    this.form.controls.invoiceZip.setValue(this.form.controls.zip.value);
    this.form.controls.invoiceCity.setValue(this.form.controls.city.value);
    this.form.controls.invoiceStreet.setValue(this.form.controls.street.value);
  }

}
