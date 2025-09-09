import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFranchiseProductStore } from "@/stores/franchise-dashboard/product-store";
import { Product } from "@/types/supabase";

const orderFormSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(10000, "Quantity cannot exceed 10,000"),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

interface ProductOrderFormProps {
  product: Product;
  onClose: () => void;
}

export function ProductOrderForm({ product, onClose }: ProductOrderFormProps) {
  const t = useTranslations("franchise.products.orderForm");
  const { placeOrder, checkStockAvailability } = useFranchiseProductStore();

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      quantity: 1,
    },
  });

  const onSubmit = async (data: OrderFormValues) => {
    try {
      // Check stock availability before placing order
      const isAvailable = await checkStockAvailability(product.id, data.quantity);
      if (!isAvailable) {
        toast.error(t("insufficientStock"));
        return;
      }

      await placeOrder({
        product_id: product.id,
        quantity: data.quantity,
        price_per_unit: product.price,
      });
      toast.success(t("orderPlaced"));
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(t("failedToPlaceOrder"));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-muted-foreground text-sm">{t("pricePerUnit", { price: product.price.toFixed(2) })}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">{t("inStock", { quantity: product.stock_quantity })}</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("quantity")}</FormLabel>
              <FormControl>
                <Input type="number" min="1" max={product.stock_quantity} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit">{t("placeOrder")}</Button>
        </div>
      </form>
    </Form>
  );
}
