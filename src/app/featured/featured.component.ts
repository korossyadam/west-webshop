import { Component, OnInit } from '@angular/core';
import { Product } from '../models/product.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {

  // Static functions
  formatPriceToString = this.utilsService.formatPriceToString;

  public featuredProducts: Product[];
  public slidersMoving: number = 0;

  constructor(private utilsService: UtilsService) { }

  ngOnInit(): void {
    //placeholder
    this.featuredProducts = [];
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/l9zklzftkza3nolgqzvi.jpg'], []));
    this.featuredProducts.push(new Product('MMT A174 031', 'Krokodil emelő 2T', '', [], 'TRW MOTO', '17440', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/esncqlncnstg09dy9ogo.jpg'], []));
    this.featuredProducts.push(new Product('TX-2952', 'Féktisztító spray', '', [], 'TEXTAR', '1040', [], [], 0, true, ['https://s13emagst.akamaized.net/products/29907/29906825/images/res_e0e628ebd6f21a555a5eace1067a88ce.jpg'], []));
    this.featuredProducts.push(new Product('YT-0208', 'Racsnis kulcs készlet', '', [], 'YATO', '11960', [], [], 0, true, ['https://pic.autopartner.dev/tecpic//9920/yt-0208.jpg'], []));
    this.featuredProducts.push(new Product('FE177203', 'Izzó 12V H4', '', [], 'MAXGEAR', '495', [], [], 0, true, ['https://pic.autopartner.dev/tecpic//AP_ZDJECIA/AX/78-0008_1_large.jpg'], []));
    this.featuredProducts.push(new Product('YT-3851', 'Gyertyakulcs 16mm', '', [], 'YATO', '520', [], [], 0, true, ['https://yatoszerszam.hu/image/cache/catalog/image/catalog/images/yt-3851-481x481.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/efovlcrjdnklahzfb1lv.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/l9zklzftkza3nolgqzvi.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/kuifjprbm2zo01jplhay.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/kuifjprbm2zo01jplhay.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/kuifjprbm2zo01jplhay.jpg'], []));
    this.featuredProducts.push(new Product('PJH112', 'Munkahenger, kuplung', '', [], 'TRW MOTO', '21656', [], [], 0, true, ['https://ic-files-res.cloudinary.com/image/upload/v1/item/qax8FuBskpZ25Fa7AVSU3AQ4TXALvNb2.jpg'], []));
  }

  /**
   * Moves the carousel forwards or backwards depending on parameter
   * 
   * @param backwards If true, slider moves backwards
   */
  async moveSlider(backwards: boolean) {
    if (this.slidersMoving > 0) {
      return;
    }

    this.slidersMoving += this.featuredProducts.length * 2;

    if (backwards) {
      this.moveSliderElements(280, false, true);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.featuredProducts = this.arrayRotate(this.featuredProducts, true);
      this.moveSliderElements(-280, true, true);
    } else {
      this.moveSliderElements(-280, false);
      await new Promise(resolve => setTimeout(resolve, 200));
      this.featuredProducts = this.arrayRotate(this.featuredProducts, false);
      this.moveSliderElements(280, true);
    }

  }

  /**
   * Moves every product in the slider to either left or right
   * 
   * @param amount The amount of pixels to move the products with (ex.: 240)
   * @param disableTransition This parameter is needed to disable animations during correction-movements
   */
  moveSliderElements(amount: number, disableTransition: boolean, backwards: boolean = false): void {
    let elements = Array.from(document.getElementsByClassName('featured-product') as HTMLCollectionOf<HTMLElement>);
    elements.forEach(async element => {
      if (disableTransition)
        element.classList.add('notransition');

      // Get current position of the product
      let currentPosition = parseInt(element.style.left, 10);

      if (!currentPosition) {
        currentPosition = 0;
      }

      // Modify position
      if (amount < 0)
        element.style.left = (currentPosition - (element.clientWidth + 20)) + 'px';
      else
        element.style.left = (currentPosition + (element.clientWidth + 20)) + 'px';

      // This class disables all animations on the products, it is removed after a delay
      await new Promise(resolve => setTimeout(resolve, 1));
      element.classList.remove('notransition');
      this.slidersMoving -= 1;
    });
  }

  /**
   * Rotates an array of Products
   * Direction depends on parameter
   * 
   * @param arr The array to rotate
   * @param reverse The direction of the rotation
   * @returns The rotated array
   */
  arrayRotate(arr: Product[], reverse: boolean) {
    if (reverse) {
      arr.unshift(arr.pop());
    } else {
      arr.push(arr.shift());
    }

    return arr;
  }

}