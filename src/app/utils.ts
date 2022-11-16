import { Product } from "./models/product.model";

export class Utils {

   constructor() {}

   /**
    * Adds a Product to the cart
    * Uses localStorage with JSON methods to store data
    * Products that were added before have their quantites increased
    * Products that does not have enough stock are not added
    * 
    * @param productToAdd The Product to add to the cart
    * @param quantity The amount of Product to add to the cart
    */
   public static addProductToCart(productToAdd: Product, quantity: number): void {

      // Get current cart from localStorage
      let currentCart = JSON.parse(localStorage.getItem('cart')) ?? [];

      // Check if product is already in cart (if no, inCartIndex will be -1)
      let inCartIndex = -1;
      for (let i = 0; i < currentCart.length; i++) {
         let productInCart: Product = currentCart[i];
         if (productInCart.partNumber == productToAdd.partNumber) {
            inCartIndex = i;
         }
      }

      // Product is not yet in cart
      if (inCartIndex == -1) {
         if (productToAdd.stock >= quantity || true) { // remove || true
            productToAdd['quantity'] = quantity;
            currentCart.push(productToAdd);
         }
         
      // Product is already in cart, just add quantity to alreadyInCartQuantity
      } else {
         let quantityAlreadyInCart = currentCart[inCartIndex].quantity;
         if (productToAdd.stock >= quantityAlreadyInCart + quantity || true) { // remove || true
            currentCart[inCartIndex].quantity = quantityAlreadyInCart + quantity;
         }
      }

      localStorage.setItem('cart', JSON.stringify(currentCart));
   }

   /**
   * Adds a tax to a net price
   * Ex.: 1000 => 1270
   * 
   * @param originalPrice The net price to add the tax to (string)
   * @returns A price with the tax added (string)
   */
  public static addTaxToPrice(originalPrice: string): string {
   return (parseInt(originalPrice) * 1.27).toString();
 }

}