/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Tag, DollarSign, Hash, FileText, List, Image } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useProductCategoryStore } from "@/stores/admin-dashboard/product-category-store";
import { useProductStore } from "@/stores/admin-dashboard/product-store";
import { Product } from "@/types/supabase";

import { ProductPicturesField } from "./product-pictures-field";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock_quantity: z.coerce.number().min(0, "Stock quantity must be positive"),
  category_id: z
    .union([z.string(), z.literal("uncategorized")])
    .optional()
    .nullable(),
  pictures: z.union([z.array(z.string()), z.string()]).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export function ProductForm({ product, onClose }: ProductFormProps) {
  const { categories, fetchCategories } = useProductCategoryStore();
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name ?? "",
          description: product.description ?? "",
          price: product.price ?? 0,
          stock_quantity: product.stock_quantity ?? 0,
          category_id: product.category_id ?? "uncategorized",
          pictures: product.pictures ?? [],
        }
      : {
          name: "",
          description: "",
          price: 0,
          stock_quantity: 0,
          category_id: "uncategorized",
          pictures: [],
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      // Process the category_id field - convert "uncategorized" to null
      const processedCategoryId = data.category_id === "uncategorized" ? null : data.category_id;

      // Process the pictures field to ensure it's always an array
      let processedPictures = [];
      if (Array.isArray(data.pictures)) {
        processedPictures = data.pictures;
      } else if (typeof data.pictures === "string") {
        processedPictures = data.pictures ? data.pictures.split(",").map((item) => item.trim()) : [];
      }

      const processedData = {
        ...data,
        category_id: processedCategoryId,
        pictures: processedPictures,
      };

      if (product) {
        // Update existing product
        await updateProduct({
          ...product,
          ...processedData,
        });
      } else {
        // Create new product
        await addProduct(processedData);
      }
      onClose();
    } catch (error) {
      console.error("Error saving product:", error);
      // TODO: Add error notification to user
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder="e.g., Car Wash Shampoo" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Quantity</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input type="number" placeholder="e.g., 100" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input type="number" step="0.01" placeholder="e.g., 15.99" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value ?? "uncategorized"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="uncategorized">Uncategorized</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
          <TabsContent value="details" className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pictures"
              render={() => (
                <FormItem>
                  <ProductPicturesField
                    form={form}
                    name="pictures"
                    label="Pictures"
                    placeholder="Comma-separated URLs of product pictures"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{product ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}
