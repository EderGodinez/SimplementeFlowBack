export interface OrderInfoResponse{
  UserId?:          string;
  numOrder:        number;
  PayMethod:       string;
  Details:         Detail[];
  shipping?:        Shipping;
  TotalPay:        number;
  OrderDate:       Date;
}

export interface Detail {
  productName:        string;
  Image:              string;
  Amount:             number;
  Price:              number;
  Size?:               number;
}



export interface Shipping {
  address?:    Address;
  email?:      string;
  name?:       string;
  phone?:      string;
  tax_exempt?: string;
  tax_ids?:    any[];
}

export interface Address {
  city?:        string;
  country?:     string;
  line1?:       string;
  line2?:       string;
  postal_code?: string;
  state?:       string;
}
