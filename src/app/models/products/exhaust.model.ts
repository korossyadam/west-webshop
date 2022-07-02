import { Product } from "../product.model";

export class Exhaust extends Product {
   
   public diameter: number;
   public thickness: number;
   public length: number;
   public type: string;

   constructor(partNumber: string, name: string, description: string, brand: string, price: string, properties: string[], factoryNumbers: string[], uses: string[], canBeReturned: boolean, imgurl: string[],
               diameter: number, thickness: number, length: number, type: string) {
      super(partNumber, name, description, brand, price, properties, factoryNumbers, uses, canBeReturned, imgurl);
      this.diameter = diameter;
      this.thickness = thickness;
      this.length = length;
      this.type = type;
      
   }

}