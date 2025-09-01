"use client";

import { useEffect, useState } from "react";

import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProductCategoryStore, ProductCategory } from "@/stores/admin-dashboard/product-category-store";
import { useFranchiseProductStore, Product } from "@/stores/franchise-dashboard/product-store";

import { ProductOrderForm } from "./product-order-form";

export function ProductCatalog() {
  const { products, fetchProducts } = useFranchiseProductStore();
  const { categories, fetchCategories } = useProductCategoryStore();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (selectedCategoryId === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((product) => product.category_id === selectedCategoryId));
    }
  }, [selectedCategoryId, products]);

  // Function to render product images
  const renderProductImages = (pictures: string[] | null) => {
    if (!pictures || pictures.length === 0) {
      return (
        <div className="flex h-48 items-center justify-center rounded-t-lg bg-gray-100">
          <div className="text-gray-400">No image</div>
        </div>
      );
    }

    if (pictures.length === 1) {
      return (
        <div className="h-48 overflow-hidden rounded-t-lg">
          <img
            src={pictures[0]}
            alt="Product"
            className="h-full w-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        </div>
      );
    }

    return (
      <div className="h-48 rounded-t-lg">
        <Carousel className="h-full">
          <CarouselContent className="h-full">
            {pictures.map((picture, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="h-full overflow-hidden">
                  <img
                    src={picture}
                    alt={`Product ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2" />
          <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2" />
        </Carousel>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Product Store</h2>
        <p className="text-muted-foreground">Browse and order products for your franchise.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Available Products</CardTitle>
              <CardDescription>Browse our catalog of products for your franchise.</CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden">
                  {renderProductImages(product.pictures)}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>
                      {categories.find((c) => c.id === product.category_id)?.name || "Uncategorized"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 pb-2">
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                    <p className="mt-2 text-sm">In stock: {product.stock_quantity}</p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Order Product
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Order {product.name}</DialogTitle>
                        </DialogHeader>
                        <ProductOrderForm
                          product={product}
                          onClose={() => {
                            // Dialog will close automatically when onClose is called
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-8 text-center">
                <p className="text-muted-foreground">
                  {selectedCategoryId === "all"
                    ? "No products found."
                    : "No products available in the selected category."}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
