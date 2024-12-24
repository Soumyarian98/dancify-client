export interface OrderResponse {
  id: number;
  amount: string;
  currency: string;
  status: string;
  cretedAt: string;
  updatedAt: string;
  userId: number;
  items: Item[];
}

export interface Item {
  id: number;
  amount: number;
  currency: string;
  createdAt: string;
  category: Category;
}

export interface Category {
  id: number;
  categoryName: string;
  event: Event;
}

export interface Event {
  eventName: string;
  city: string;
}
