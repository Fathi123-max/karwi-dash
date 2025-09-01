"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Tag, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useProductCategoryStore } from "@/stores/admin-dashboard/product-category-store";
import { ProductCategory } from "@/types/supabase";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: ProductCategory;
  onClose: () => void;
}

export function CategoryForm({ category, onClose }: CategoryFormProps) {
  const addCategory = useProductCategoryStore((state) => state.addCategory);
  const updateCategory = useProductCategoryStore((state) => state.updateCategory);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? {
          name: category.name ?? "",
          description: category.description ?? "",
        }
      : {
          name: "",
          description: "",
        },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (category) {
        // Update existing category
        await updateCategory({
          ...category,
          ...data,
        });
      } else {
        // Create new category
        await addCategory(data);
      }
      onClose();
    } catch (error) {
      console.error("Error saving category:", error);
      // TODO: Add error notification to user
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <Tag className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input placeholder="e.g., Cleaning Supplies" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div className="relative">
                  <FileText className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Textarea placeholder="Category description" {...field} className="pl-10" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{category ? "Update" : "Create"}</Button>
        </div>
      </form>
    </Form>
  );
}
