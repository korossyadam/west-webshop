
export interface Address {
   partNumber: string;
   name: string;
   price: number;
   quantity: number;
   imgurl: string;
}

export class User {
   public email: string;
   public name: string;
   public phoneNumber: string;
   public garage: number[];
   public address: Address;
   public cart: string;

   constructor(email: string, name: string) {
      this.email = email;
      this.name = name;
   }
}