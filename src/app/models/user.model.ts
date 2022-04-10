import { Address } from "./address.model";

export class User {

   public email: string;
   public firstName: string;
   public lastName: string;
   public phone: string;
   public garage: number[];
   public addresses: Address[];
   public cart: string;

   constructor(email: string, firstName: string, lastName: string, phone: string, garage: number[], addresses: Address[], cart: string) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;
      this.garage = garage;
      this.addresses = addresses;
      this.cart = cart;
      
   }
}