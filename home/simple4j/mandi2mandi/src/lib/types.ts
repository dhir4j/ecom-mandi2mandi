// This file contains shared type definitions for the application.

export type Product = {
  id: string;
  title: string;
  location: string;
  price: number;
  unit: string;
  images: string[];
  date: string;
  seller: string;
  category: string;
  subcategory: string;
  aiHint: string;
};

export type CategoryData = {
    [category: string]: string[]; // Key is the category, value is an array of sub-categories
}
