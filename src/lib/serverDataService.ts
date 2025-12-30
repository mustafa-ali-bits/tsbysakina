import { Product } from '@/types/product';
import { DataService } from '@/lib/dataService';

export const ServerDataService = {
  async fetchProducts(): Promise<Product[]> {
    try {
      const SHEET_ID = process.env.GOOGLE_SHEET_ID;
      const API_KEY = process.env.GOOGLE_API_KEY;

      if (!SHEET_ID || !API_KEY) {
        console.warn('Missing Google Sheets credentials, falling back to demo data');
        return DataService.getDemoData();
      }

      const sheetNames = await this.getSheetNames(SHEET_ID, API_KEY);
      const sheetName = sheetNames.includes('Products') ? 'Products' : sheetNames[0];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}&_=${Date.now()}`;

      // Revalidate every 60 seconds
      const response = await fetch(url, {
        next: { revalidate: 60 },
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

      const products = filteredRows.map((row: string[], index: number) => {
        // Validate and clean image URL
        const rawImageUrl = row[6] || '';
        let imageUrl = 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400'; // Default fallback

        // Check if URL is valid (not #VALUE! error or empty)
        if (rawImageUrl &&
          !rawImageUrl.includes('#VALUE!') &&
          !rawImageUrl.includes('#ERROR') &&
          !rawImageUrl.includes('#REF!') &&
          rawImageUrl.trim() !== '') {
          // Check if it's a valid HTTP/HTTPS URL
          if (rawImageUrl.startsWith('http://') || rawImageUrl.startsWith('https://')) {
            imageUrl = rawImageUrl;
          }
        }

        return {
          id: index + 1,
          name: row[0] || '',
          mrp: parseFloat(row[1]) || 0,
          price: parseFloat(row[2]) || 0,
          category: row[3] || '',
          subcategory: row[4] || '',
          description: row[5] || '',
          image: imageUrl,
          rating: parseFloat(row[7]) || 4.5,
          inventory: (row[8] || '').toLowerCase() === 'yes',
          customizationNote: row[10] || '',
          storageCare: row[11] || '',
          shelfLife: parseInt(row[12]) || 0,
        };
      });

      return products;
    } catch (error) {
      console.error('Error fetching products from server:', error);
      return DataService.getDemoData();
    }
  },

  async getSheetNames(sheetId: string, apiKey: string) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?key=${apiKey}&_=${Date.now()}`;

    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch spreadsheet metadata');
    }

    const data = await response.json();
    return data.sheets.map((sheet: any) => sheet.properties.title);
  }
};
