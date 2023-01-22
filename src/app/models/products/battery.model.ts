import { Product, KeyValue } from "../product.model";

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

   constructor(partNumber: string, name: string, description: string, categories: string[], specialCategories: string[], brand: string, price: string, properties: KeyValue[], factoryNumbers: KeyValue[], stock: number, canBeReturned: boolean, imgurls: string[],
               carIndexes: string[], voltage: number, capacity: number, starterCurrent: number, pole: string, width: number, length: number, height: number, capacityCategory: string[]) {
      super(partNumber, name, description, categories, specialCategories, brand, price, properties, factoryNumbers, stock, canBeReturned, imgurls, carIndexes);
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
