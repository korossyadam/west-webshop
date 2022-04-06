import * as internal from "stream";

export class Address {
   
   public name: string;
   public email: string;
   public phone: string;
   public zipcode: string;
   public county: string;
   public street: string;

   constructor(name: string, email: string, phone: string, zipcode: string, county: string, street: string) {
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.zipcode = zipcode;
      this.county = county;
      this.street = street;
      
   }

}