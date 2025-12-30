import { ServerDataService } from '@/lib/serverDataService';
import HomeClient from '@/components/HomeClient';

export default async function Page() {
  const products = await ServerDataService.fetchProducts();

  return <HomeClient initialProducts={products} />;
}
