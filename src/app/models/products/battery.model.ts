import { Product } from "../product.model";

export class Battery extends Product {

   public voltage: number;
   public capacity: number;
   public starterCurrent: number;
   public pole: string;
   public width: number;
   public length: number;
   public height: number;
   public capacityCategory: string[];
   public starterCategory: string[];

   constructor(partNumber: string, name: string, description: string, brand: string, price: string, properties: string[], factoryNumbers: string[], uses: string[], canBeReturned: boolean, imgurl: string[],
               voltage: number, capacity: number, starterCurrent: number, pole: string, width: number, length: number, height: number, capacityCategory: string[]) {
      super(partNumber, name, description, brand, price, properties, factoryNumbers, uses, canBeReturned, imgurl);
      this.voltage = voltage;
      this.capacity = capacity;
      this.starterCurrent = starterCurrent;
      this.pole = pole;
      this.width = width;
      this.length = length;
      this.height = height;
      this.capacityCategory = capacityCategory;
   }

}
