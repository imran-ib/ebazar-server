export interface ItemArgs {
  id?: string;
  title: string;
  description: string;
  overview: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  materials?: string;
  otherInfo?: string;
  videoLink?: string;
  price: number;
  beforeDiscountPrice: number;
  stock?: number;
  images?: string[];
  catagory?: string[];
  tags?: string[];
  colors?: string[];
  oherFeatures?: string[];
}
export interface UpdateItemArgs {
  id?: string;
  title?: string;
  description?: string;
  overview?: string;
  brand?: string;
  weight?: string;
  dimensions?: string;
  materials?: string;
  otherInfo?: string;
  videoLink?: string;
  price?: number;
  beforeDiscountPrice?: number;
  stock?: number;
  images?: string[];
  catagory?: string[];
  tags?: string[];
  colors?: string[];
  oherFeatures?: string[];
}
