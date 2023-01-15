export interface ShippingAddress {
   name: string;
   email: string;
   phoneNumber: string;
   address: string;
   comment?: string
}

export interface BillingAddress {
   name: string;
   address: string;
   taxNumber?: string;
}

export interface OrderedProduct {
   partNumber: string;
   name: string;
   brand: string;
   price: number;
   quantity: number;
   imgurl: string;
}

export class Order {
   public userId: string;
   public deliveryPrice: number;
   public totalPrice: number;
   public date: Date;
   public orderedProducts: OrderedProduct[];
   public shippingAddress: ShippingAddress;
   public billingAddress: BillingAddress;
   public shippingMethod: string;
   public paymentMethod: string;

   public constructor(userId: string, date: Date, deliveryPrice: number, totalPrice: number, orderedProducts: OrderedProduct[], shippingAddress: ShippingAddress, billingAddress: BillingAddress, shippingMethod: string, paymentMethod: string) {
      this.userId = userId;
      this.date = date;
      this.deliveryPrice = deliveryPrice;
      this.totalPrice = totalPrice;
      this.orderedProducts = orderedProducts;
      this.shippingAddress = shippingAddress;
      this.billingAddress = billingAddress;
      this.shippingMethod = shippingMethod;
      this.paymentMethod = paymentMethod;
   }
}