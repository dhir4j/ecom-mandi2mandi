// This file is responsible for fetching and processing product data from the new JSON structure.
import fs from 'fs/promises';
import path from 'path';
import type { Product, CategoryData } from '@/lib/types';

// This is the structure of the raw data from the JSON file
type RawProduct = {
  url: string;
  id: string;
  image: string;
  date: string;
  title: string;
  price: string;
  seller: string;
  location: string;
};

// This will hold the parsed product data in memory
let cachedProducts: Product[] | null = null;
let cachedCategories: CategoryData | null = null;


function parsePrice(priceStr: string): { price: number; unit: string } {
    const defaultResult = { price: 0, unit: 'piece' };

    if (!priceStr || typeof priceStr !== 'string') {
        return defaultResult;
    }

    // Example: "₹ 180 /- Kg" or "₹ 12 /- Piece"
    const match = priceStr.match(/₹\s*([\d,.]+)\s*\/\-\s*(.+)/);
    
    if (match) {
        const value = parseFloat(match[1].replace(/,/g, ''));
        let unit = match[2].trim().toLowerCase();
        // Normalize different unit variations
        if (unit.includes('kg')) {
            unit = 'kg';
        } else if (unit.includes('piece')) {
            unit = 'piece';
        }

        if (!isNaN(value)) {
            return { price: value, unit: unit || 'piece' };
        }
    }
    
    return defaultResult;
}


function processRawProduct(rawProduct: RawProduct, category: string, subcategory: string): Product {
  const { price, unit } = parsePrice(rawProduct.price);

  // Use .webp image if available
  const imageUrl = rawProduct.image.replace(/\..+$/, '.webp');

  return {
    id: rawProduct.id,
    title: rawProduct.title,
    location: rawProduct.location,
    price: price,
    unit: unit,
    images: [imageUrl],
    date: rawProduct.date,
    seller: rawProduct.seller,
    category: category,
    subcategory: subcategory,
    aiHint: rawProduct.title.split(' ').slice(0, 2).join(' ').toLowerCase(),
  };
}

async function loadAndProcessData(): Promise<{ products: Product[], categories: CategoryData }> {
  if (cachedProducts && cachedCategories) {
    return { products: cachedProducts, categories: cachedCategories };
  }

  let rawData: { [category: string]: { [subcategory: string]: RawProduct[] } };
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'db', 'commodity_data.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    rawData = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to read or parse commodity_data.json:", error);
    return { products: [], categories: {} };
  }
  
  const allProducts: Product[] = [];
  const allCategories: CategoryData = {};

  for (const category in rawData) {
    allCategories[category] = [];
    for (const subcategory in rawData[category]) {
      allCategories[category].push(subcategory);
      const products = rawData[category][subcategory];
      if (Array.isArray(products)) {
        for (const rawProduct of products) {
          // Ensure product has a valid ID before processing
          if (rawProduct && rawProduct.id) {
              allProducts.push(processRawProduct(rawProduct, category, subcategory));
          }
        }
      }
    }
  }

  cachedProducts = allProducts;
  cachedCategories = allCategories;

  return { products: allProducts, categories: allCategories };
}


export async function getProducts(): Promise<Product[]> {
  const { products } = await loadAndProcessData();
  return products;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

export async function getCategories(): Promise<CategoryData> {
    const { categories } = await loadAndProcessData();
    return categories;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.category === category);
}


export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
    const allProducts = await getProducts();
    return allProducts.filter(p => p.category === category && p.subcategory === subcategory);
}