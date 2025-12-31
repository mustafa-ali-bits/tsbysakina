import { ServerDataService } from '@/lib/serverDataService';
import HomeClient from '@/components/HomeClient';

export default async function Page() {
  const [products, promotions] = await Promise.all([
    ServerDataService.fetchProducts(),
    ServerDataService.fetchPromotions(),
  ]);

  return <HomeClient initialProducts={products} promotions={promotions} />;
}
