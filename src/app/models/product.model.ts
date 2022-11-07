export class Product {

   public partNumber: string;
   public name: string;
   public description: string;
   public categories: string[];
   public secondCategory: string;
   public brand: string;
   public price: string;
   public properties: string[];
   public factoryNumbers: string[];
   public uses: string[];
   public canBeReturned: boolean;
   public imgurls: string[];
   public carIndexes: string[];

   
   constructor(partNumber: string, name: string, description: string, categories: string[], brand: string, price: string, properties: string[], factoryNumbers: string[], canBeReturned: boolean, imgurls: string[], carIndexes: string[]) {
      this.partNumber = partNumber;
      this.name = name;
      this.description = description;
      this.categories = categories;
      this.brand = brand;
      this.price = price;
      this.properties = properties;
      this.factoryNumbers = factoryNumbers;
      this.canBeReturned = canBeReturned;
      this.imgurls = imgurls;
      this.carIndexes = carIndexes;

      this.secondCategory = this.categories[1];
      if (this.secondCategory === undefined) {
         this.secondCategory = '';
      }
   }

   

}
