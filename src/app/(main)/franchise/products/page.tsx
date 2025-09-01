import { OrderHistory } from "./_components/order-history";
import { ProductCatalog } from "./_components/product-catalog";

export default function FranchiseProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <ProductCatalog />
      <OrderHistory />
    </div>
  );
}
