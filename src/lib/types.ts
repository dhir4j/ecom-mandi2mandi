// src/lib/types.ts
// Type definitions for the commodity trading application

export type Product = {
  id: string;
  title: string;
  location: string;
  price: number;
  unit: string;           // 'Kg', 'Piece', 'Quintal', etc.
  images: string[];
  date: string;
  seller: string;
  seller_id?: number;     // Optional seller ID for database products
  category: string;       // Main category like 'spices', 'fruits', 'vegetables'
  subcategory: string;    // Subcategory like 'Ajwain', 'Apple', etc.
  aiHint: string;        // For AI-based search and recommendations
};

export type CategoryData = {
  [category: string]: string[];  // Key is category, value is array of subcategories
};