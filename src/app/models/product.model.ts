export class Product {
   public partNumber: string;
   public name: string;
   public description: string;
   public categories: string[];
   public specialCategories: string[];
   public brand: string;
   public price: string;
   public properties: string[];
   public factoryNumbers: string[];
   public stock: number;
   public canBeReturned: boolean;
   public imgurls: string[];
   public carIndexes: string[];

   constructor(partNumber: string, name: string, description: string, categories: string[], specialCategories: string[], brand: string, price: string, properties: string[], factoryNumbers: string[], stock: number, canBeReturned: boolean, imgurls: string[], carIndexes: string[]) {
      this.partNumber = partNumber;
      this.name = name;
      this.description = description;
      this.categories = categories;
      this.specialCategories = specialCategories;
      this.brand = brand;
      this.price = price;
      this.properties = properties;
      this.factoryNumbers = factoryNumbers;
      this.stock = stock;
      this.canBeReturned = canBeReturned;
      this.imgurls = imgurls;
      this.carIndexes = carIndexes;

      if (this.price == '-') {
         this.price = '990';
      }
   }

}
