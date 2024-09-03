import { PaymentMethod, SaleType,  } from "@prisma/client";

export type SaleItemProps = {
    qty: number,
salePrice: number,
productName :string,
productImage: string,
saleId: string,
productId: string
}

export interface SaleRequestBody {
    customerId: string; // or number, depending on your actual type
    saleAmount: number;
    balanceAmount: number;
    paidAmount: number;
    shopId:string;
    saleType: SaleType; // or a more specific type if you have predefined sale types
    paymentMethod: PaymentMethod; // or an enum if you have predefined methods
    transactionCode: string;
    customerName: string;
    customerEmail?: string; // Optional if it can be undefined or null
    saleItems: Array<{
        qty: number,
        salePrice: number,
        productName :string,
        productImage: string,
        saleId: string,
        productId: string
    }>;
  }
  