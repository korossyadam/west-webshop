import { Address } from "./address.model";
import { Product } from "./product.model";

export class User {
   public email: string;
   public name: string;
   public phoneNumber: string;
   public garage: number[];
   public address: Address;
   public wishList: Product[];

   constructor(email: string, name: string) {
      this.email = email;
      this.name = name;
      this.phoneNumber = '';
      this.garage = [];
      this.wishList = [];
   }
}