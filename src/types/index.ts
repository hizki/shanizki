import type { ReactNode } from 'react';

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
  product_processes?: Array<{ process_id: string }>;
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

export interface RecipeImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface RecipeIngredientGroup {
  title: string;
  items: RecipeIngredient[];
  note?: string;
}

export interface RecipeStep {
  text: ReactNode;
  image?: RecipeImage;
}

export interface RecipeWarning {
  title: string;
  paragraphs: ReactNode[];
  image?: RecipeImage;
}

export interface RecipeSection {
  title: string;
  timeLabel?: string;
  steps: RecipeStep[];
  warning?: RecipeWarning;
}

export interface RecipeSchedulePhase {
  title: string;
  items: ReactNode[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  heroImage: RecipeImage;
  sources: ReactNode[];
  scheduleIntro: string;
  schedule: RecipeSchedulePhase[];
  ingredientGroups: RecipeIngredientGroup[];
  sections: RecipeSection[];
  finalImage?: RecipeImage;
}