"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Banner } from "@/types/banners-offers";
import { toast } from "sonner";
import { ImageUploadField } from "@/app/(main)/admin/_components/image-upload-field";
import { useBannersOffersStore } from "@/stores/admin-dashboard/banners-offers-store";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean(),
  link_url: z.string().optional(),
  priority: z.coerce.number().int().min(0, "Priority must be a positive number"),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  banner?: Banner;
  onClose: () => void;
}

export function BannerForm({ banner, onClose }: BannerFormProps) {
  const { addBanner, updateBanner } = useBannersOffersStore();
  
  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: banner ?? {
      title: "",
      description: "",
      image_url: "",
      is_active: true,
      link_url: "",
      priority: 0,
    },
  });

  const onSubmit = async (data: BannerFormValues) => {
    try {
      if (banner) {
        await updateBanner({ ...banner, ...data });
        toast.success("Banner updated successfully");
      } else {
        await addBanner(data);
        toast.success("Banner created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${banner ? "update" : "create"} banner`);
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <h2 className="text-lg font-semibold">
          {banner ? "Edit Banner" : "Create Banner"}
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Banner title" />
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
                    <Textarea 
                      {...field} 
                      placeholder="Banner description" 
                      className="min-h-[100px]" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={field.value || ""}
                      onChange={field.onChange}
                      bucket="banners"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="link_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormDescription>
                    Optional URL for the banner to link to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormDescription>
                      Higher numbers appear first
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-end">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <FormLabel className="!mt-0">Active</FormLabel>
                    </div>
                    <FormDescription>
                      Inactive banners won't be displayed
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}