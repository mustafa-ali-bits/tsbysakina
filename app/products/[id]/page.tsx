import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Product } from '@/types/product';
import { ServerDataService } from '@/lib/serverDataService';
import ProductDetail from '@/components/ProductDetail';
import Header from '@/components/Header';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const products = await ServerDataService.fetchProducts();
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
  const products = await ServerDataService.fetchProducts();
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
