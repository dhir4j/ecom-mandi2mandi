// src/lib/products.ts
// Complete rewrite to use commodity_data.json exclusively
import fs from 'fs/promises';
import path from 'path';
import type { Product, CategoryData } from '@/lib/types';

// Raw product structure from commodity_data.json
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

// Cache for performance
let cachedProducts: Product[] | null = null;
let cachedCategories: CategoryData | null = null;

/**
 * Process raw product data into our Product type
 */
function processRawProduct(rawProduct: RawProduct, category: string, subcategory: string): Product {
  // Parse price from format "₹ 180 /- Kg" or "₹ 12 /- Piece"
  const priceMatch = rawProduct.price.match(/₹\s*([\d,.]+)\s*\/-\s*(\w+)/i);
  
  let price = 0;
  let unit = 'Kg';
  
  if (priceMatch) {
    const priceStr = priceMatch[1].replace(/,/g, '');
    price = parseFloat(priceStr);
    unit = priceMatch[2].trim();
  }

  // Handle image: use placeholder if N/A or invalid
  const image = rawProduct.image && rawProduct.image !== 'N/A' && rawProduct.image.startsWith('http')
    ? rawProduct.image
    : '/placeholder.svg';

  return {
    id: rawProduct.id,
    title: rawProduct.title,
    location: rawProduct.location,
    price: price,
    unit: unit,
    images: [image],
    date: rawProduct.date,
    seller: rawProduct.seller,
    category: category,
    subcategory: subcategory,
    aiHint: `${subcategory} ${category}`.toLowerCase(),
  };
}

/**
 * Load and process all data from commodity_data.json
 */
async function loadAndProcessData(): Promise<{ products: Product[], categories: CategoryData }> {
  // Return cached data if available
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

  // Process each category and subcategory
  for (const category in rawData) {
    allCategories[category] = [];
    
    for (const subcategory in rawData[category]) {
      allCategories[category].push(subcategory);
      const products = rawData[category][subcategory];
      
      if (Array.isArray(products)) {
        for (const rawProduct of products) {
          // Ensure product has valid ID before processing
          if (rawProduct && rawProduct.id) {
            allProducts.push(processRawProduct(rawProduct, category, subcategory));
          }
        }
      }
    }
  }

  // Cache the processed data
  cachedProducts = allProducts;
  cachedCategories = allCategories;

  console.log(`Loaded ${allProducts.length} products from ${Object.keys(allCategories).length} categories`);
  
  return { products: allProducts, categories: allCategories };
}

/**
 * Get all products
 */
export async function getProducts(): Promise<Product[]> {
  const { products } = await loadAndProcessData();
  return products;
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find(p => p.id === id);
}

/**
 * Get all categories with their subcategories
 */
export async function getCategories(): Promise<CategoryData> {
  const { categories } = await loadAndProcessData();
  return categories;
}

/**
 * Get all products in a specific category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.category === category);
}

/**
 * Get all products in a specific subcategory
 */
export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p => p.category === category && p.subcategory === subcategory);
}