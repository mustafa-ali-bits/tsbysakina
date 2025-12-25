import { notFound } from 'next/navigation';
import { Product } from '@/types/product';
import { DataService } from '@/lib/dataService';
import ProductDetail from '@/components/ProductDetail';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  const products = await DataService.fetchFromGoogleSheets();
  const product = products.find(p => p.id === parseInt(params.id));

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
