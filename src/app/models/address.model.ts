import * as internal from "stream";

export class Address {
   
   public name: string;
   public email: string;
   public firstName: string;
   public lastName: string;
   public companyName: string;
   public companyTax: string;
   public phone: string;
   public zipcode: string;
   public city: string;
   public street: string;

   constructor(name: string, email: string, firstName: string, lastName: string, companyName: string, companyTax: string, phone: string, zipcode: string, city: string, street: string) {
      this.name = name;
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.companyName = companyName;
      this.companyTax = companyTax;
      this.phone = phone;
      this.zipcode = zipcode;
      this.city = city;
      this.street = street;
      
   }

}