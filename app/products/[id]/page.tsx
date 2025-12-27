import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Product } from '@/types/product';
import { DataService } from '@/lib/dataService';
import ProductDetail from '@/components/ProductDetail';
import Header from '@/components/Header';
import { z } from 'zod';

interface PageProps {
  params: {
    id: string;
  };
}

const envSchema = z.object({
  GOOGLE_SHEET_ID: z.string().min(1, 'GOOGLE_SHEET_ID is required'),
  GOOGLE_API_KEY: z.string().min(1, 'GOOGLE_API_KEY is required'),
});

const envVars = envSchema.safeParse({
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
});

async function fetchProductsFromAPI() {
  try {
    if (!envVars.success) {
      return DataService.getDemoData();
    }

    const { GOOGLE_SHEET_ID: SHEET_ID, GOOGLE_API_KEY: API_KEY } = envVars.data;

    const sheetNames = await getSheetNames(SHEET_ID, API_KEY);
    const sheetName = sheetNames.includes('Products') ? 'Products' : sheetNames[0];

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}&_=${Date.now()}`;
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Cache for 60 seconds (1 minute)
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data from sheet "${sheetName}"`);
    }

    const data = await response.json();
    const rows = data.values;

    if (!rows || rows.length < 2) {
      throw new Error('No data found in the sheet');
    }

    const dataRows = rows.slice(1);
    const filteredRows = dataRows.filter((row: string[]) => row && row.length > 0 && row[0] && row[0].trim() !== '');

    const products = filteredRows.map((row: string[], index: number) => ({
      id: index + 1,
      name: row[0] || '',
      mrp: parseFloat(row[1]) || 0,
      price: parseFloat(row[2]) || 0,
      category: row[3] || '',
      subcategory: row[4] || '',
      description: row[5] || '',
      image: row[6] || 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400',
      rating: parseFloat(row[7]) || 4.5,
      inventory: (row[8] || '').toLowerCase() === 'yes',
      customizationNote: row[10] || '',
    }));

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return DataService.getDemoData();
  }
}

async function getSheetNames(sheetId: string, apiKey: string) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&_=${Date.now()}`;

  const response = await fetch(url, {
    next: { revalidate: 60 }, // Cache for 60 seconds (1 minute)
  });

  if (!response.ok) {
    throw new Error('Failed to fetch spreadsheet metadata');
  }

  const data = await response.json();
  return data.sheets.map((sheet: any) => sheet.properties.title);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const products = await fetchProductsFromAPI();
  const product = products.find((p: Product) => p.id === parseInt(params.id));

  if (!product) {
    return {
      title: 'Product Not Found | The Sweet Tooth by Sakina',
      description: 'The product you are looking for could not be found.',
    };
  }

  const productImage = product.image.startsWith('http') ? product.image : `https://www.thesweettoothbysakina.in${product.image}`;

  return {
    title: `${product.name} - ${product.category} | The Sweet Tooth by Sakina`,
    description: `${product.description} Price: ₹${product.price} (MRP: ₹${product.mrp}). ${product.inventory ? 'In Stock' : 'Out of Stock'}. Handcrafted by Sakina.`,
    keywords: [product.name, product.category, product.subcategory, 'chocolates', 'handcrafted', 'premium', 'fresh'],
    openGraph: {
      title: `${product.name} - ${product.category}`,
      description: product.description,
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.category}`,
      description: product.description,
      images: [productImage],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const products = await fetchProductsFromAPI();
  const product = products.find((p: Product) => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <ProductDetail product={product} />
    </>
  );
}
