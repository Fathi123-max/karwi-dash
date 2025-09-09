"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { ImageUploadField } from "@/app/(main)/admin/_components/image-upload-field";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useBannersOffersStore } from "@/stores/admin-dashboard/banners-offers-store";
import { Offer } from "@/types/banners-offers";

const offerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  is_active: z.boolean(),
  link_url: z.string().optional(),
  code: z.string().optional(),
  discount_type: z.enum(["percentage", "fixed"]).optional(),
  discount_value: z.coerce.number().optional(),
});

type OfferFormValues = z.infer<typeof offerSchema>;

interface OfferFormProps {
  offer?: Offer;
  onClose: () => void;
}

export function OfferForm({ offer, onClose }: OfferFormProps) {
  const { addOffer, updateOffer } = useBannersOffersStore();

  const form = useForm<OfferFormValues>({
    resolver: zodResolver(offerSchema),
    defaultValues: offer ?? {
      title: "",
      description: "",
      image_url: "",
      is_active: true,
      link_url: "",
      code: "",
      discount_type: "percentage",
      discount_value: 0,
    },
  });

  const onSubmit = async (data: OfferFormValues) => {
    try {
      if (offer) {
        await updateOffer({ ...offer, ...data });
        toast.success("Offer updated successfully");
      } else {
        await addOffer(data);
        toast.success("Offer created successfully");
      }
      onClose();
    } catch (error) {
      toast.error(`Failed to ${offer ? "update" : "create"} offer`);
      console.error(error);
    }
  };

  return (
    <div className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm">
      <div className="bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg">
        <h2 className="text-lg font-semibold">{offer ? "Edit Offer" : "Create Offer"}</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Offer title" />
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
                    <Textarea {...field} placeholder="Offer description" className="min-h-[100px]" />
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
                    <ImageUploadField value={field.value || ""} onChange={field.onChange} bucket="offers" />
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
                  <FormDescription>Optional URL for the offer to link to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="OFFER10" />
                    </FormControl>
                    <FormDescription>Optional promotional code</FormDescription>
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
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                      <FormLabel className="!mt-0">Active</FormLabel>
                    </div>
                    <FormDescription>Inactive offers won't be displayed</FormDescription>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="discount_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" step="0.01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{offer ? "Update Offer" : "Create Offer"}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
