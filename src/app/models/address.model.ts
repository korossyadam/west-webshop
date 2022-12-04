export class Address {
   public zipcode: string;
   public city: string;
   public street: string;
   public taxNumber: string;

   constructor(zipcode: string, city: string, street: string, taxNumber: string) {
      this.zipcode = zipcode;
      this.city = city;
      this.street = street;
      this.taxNumber = taxNumber;
   }

}