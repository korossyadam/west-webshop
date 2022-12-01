export class Product {

   public partNumber: string;
   public name: string;
   public description: string;
   public categories: string[];
   public secondCategory: string;
   public specialCategory: number;
   public brand: string;
   public price: string;
   public properties: string[];
   public factoryNumbers: string[];
   public stock: number;
   public canBeReturned: boolean;
   public imgurls: string[];
   public carIndexes: string[];

   constructor(partNumber: string, name: string, description: string, categories: string[], specialCategory: number, brand: string, price: string, properties: string[], factoryNumbers: string[], stock: number, canBeReturned: boolean, imgurls: string[], carIndexes: string[]) {
      this.partNumber = partNumber;
      this.name = name;
      this.description = description;
      this.categories = categories;
      this.specialCategory = specialCategory;
      this.brand = brand;
      this.price = price;
      this.properties = properties;
      this.factoryNumbers = factoryNumbers;
      this.stock = stock;
      this.canBeReturned = canBeReturned;
      this.imgurls = imgurls;
      this.carIndexes = carIndexes;

      this.secondCategory = this.categories[1];
      if (this.secondCategory === undefined) {
         this.secondCategory = '';
      }
   }

}
