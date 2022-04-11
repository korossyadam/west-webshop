import * as internal from "stream";

export class Product {

   public partNumber: string;
   public name: string;
   public description: string;
   public brand: string;
   public price: string;
   public properties: string[];
   public factoryNumbers: string[];
   public uses: string[];
   public canBeReturned: boolean;
   public imgurl: string[];

   constructor(partNumber: string, name: string, description: string, brand: string, price: string, properties: string[], factoryNumbers: string[], uses: string[], canBeReturned: boolean, imgurl: string[]) {
      this.partNumber = partNumber;
      this.name = name;
      this.description = description;
      this.brand = brand;
      this.price = price;
      this.properties = properties;
      this.factoryNumbers = factoryNumbers;
      this.uses = uses;
      this.canBeReturned = canBeReturned;
      this.imgurl = imgurl;

   }
}
