export class Offer {
   public userId: string;
   public brand: string;
   public year: string;
   public ac: string;
   public engine: string;
   public chassis: string;
   public vin: string;
   public message: string;
   public email: string;
   public date: Date;
   public answered: boolean;
   public answer: string;

   public constructor(userId: string, brand: string, year: string, ac: string, engine: string, chassis: string, vin: string, message: string, email: string, date: Date) {
      this.userId = userId;
      this.brand = brand;
      this.year = year;
      this.ac = ac;
      this.engine = engine;
      this.chassis = chassis;
      this.vin = vin;
      this.message = message;
      this.email = email;
      this.date = date;

      this.answered = false;
      this.answer = '';
   }
}