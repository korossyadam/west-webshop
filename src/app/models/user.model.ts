
export class User {

   public email: string;
   public firstName: string;
   public lastName: string;
   public phone: string;

   constructor(email: string, firstName: string, lastName: string, phone: string) {
      this.email = email;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phone = phone;

   }
}