import * as internal from "stream";

export class Order {
   
   public price: number;
   public date: string;
   public productIds: string[];
   public productNames: string[];
   public productPrices: number[];
   public productQuantities: number[];
   public shippingAddressId: string;
   public billingAddressId: string;

   public constructor(price: number, date: string, productIds: string[], productNames: string[], productPrices: number[], productQuantities: number[], shippingAddressId: string, billingAddressId: string) {
      this.price = price;
      this.date = date;
      this.productIds = productIds;
      this.productNames = productNames;
      this.productPrices = productPrices;
      this.productQuantities = productQuantities;
      this.shippingAddressId = shippingAddressId;
      this.billingAddressId = billingAddressId;
      
   }
}