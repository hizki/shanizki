export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  what_is_it: string;
  what_to_do: string;
  instructions?: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
  processes?: Process[];
}

export interface Process {
  id: string;
  name: string;
  description: string;
  further_reading_links?: Array<{
    title: string;
    url: string;
  }>;
  created_at?: string;
  updated_at?: string;
}

export type ProductInput = Omit<Product, 'id' | 'created_at' | 'updated_at'>;