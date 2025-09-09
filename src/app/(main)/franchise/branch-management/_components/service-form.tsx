/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable complexity */

"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Tag, DollarSign, Clock, Globe } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { ServicePromotionManagement } from "@/app/(main)/franchise/services/_components/service-promotion-management";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore, Service } from "@/stores/franchise-dashboard/service-store";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  duration_min: z.coerce.number().int().min(5, "Duration must be at least 5 minutes."),
  todos: z.string().optional(),
  include: z.string().optional(),
  is_global: z.boolean().default(false),
});

type ServiceFormValues = z.infer<typeof formSchema>;

interface ServiceFormProps {
  branchId: string;
  service?: Service & { is_global?: boolean };
  onSuccess: () => void;
}

export function ServiceForm({ branchId, service, onSuccess }: ServiceFormProps) {
  const t = useTranslations("franchise.services.form");
  const { addService, addGlobalService, updateService } = useFranchiseServiceStore();
  const { fetchBranches } = useFranchiseBranchStore();

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: service?.name ?? "",
      description: service?.description ?? "",
      price: service?.price ?? 0,
      duration_min: service?.duration_min ?? 30,
      todos: service?.todos?.join(", ") ?? "",
      include: service?.include?.join(", ") ?? "",
      is_global: service?.is_global ?? false,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Handle form submission for both add and edit operations
  const onSubmit = async (data: ServiceFormValues) => {
    try {
      // Process the todos and include fields
      const processedData = {
        ...data,
        todos: data.todos ? data.todos.split(",").map((item) => item.trim()) : [],
        include: data.include ? data.include.split(",").map((item) => item.trim()) : [],
      };

      if (service) {
        // EDIT FEATURE: Update existing service with new data
        await updateService({ ...service, ...processedData });
        toast.success(t("serviceUpdated"));
      } else {
        if (data.is_global) {
          // ADD FEATURE: Create global service that applies to all branches
          await addGlobalService({
            ...processedData,
            name: processedData.name,
            price: processedData.price,
            duration_min: processedData.duration_min,
          });
          toast.success(t("globalServiceCreated"));
        } else {
          // ADD FEATURE: Create branch-specific service
          await addService({
            ...processedData,
            branchId: branchId,
            is_global: false,
          });
          toast.success(t("serviceCreated"));
        }
      }
      await fetchBranches(); // Refetch branches to get updated service lists
      onSuccess();
    } catch (error) {
      toast.error(t("errorOccurred"));
      console.error(error);
    }
  };

  // Watch the is_global field to control other fields
  const isGlobal = form.watch("is_global");
  const isEditing = !!service;

  // For global services, only allow editing the price
  const isGlobalServiceEditing = isEditing && service.is_global;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isGlobalServiceEditing ? (
          // Simplified form for editing global service prices with promotion management
          <>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">{t("details")}</TabsTrigger>
                <TabsTrigger value="promotions">{t("promotions")}</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">{t("globalServiceInfo")}</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("price")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder={t("pricePlaceholder")}
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="promotions" className="mt-4">
                {service && <ServicePromotionManagement serviceId={service.id} />}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("updatePrice")}
              </Button>
            </div>
          </>
        ) : service ? (
          <>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">{t("details")}</TabsTrigger>
                <TabsTrigger value="promotions">{t("promotions")}</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-4">
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h3 className="font-medium">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {isEditing && service.is_global ? t("globalServiceEditInfo") : t("serviceEditInfo")}
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("price")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input
                              type="number"
                              step="0.01"
                              placeholder={t("pricePlaceholder")}
                              {...field}
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Display other service details as read-only */}
                  <div className="space-y-2">
                    <div>
                      <FormLabel>{t("description")}</FormLabel>
                      <p className="text-muted-foreground">{service.description ?? t("noDescription")}</p>
                    </div>
                    <div>
                      <FormLabel>{t("duration")}</FormLabel>
                      <p className="text-muted-foreground">
                        {service.duration_min ?? t("na")} {t("minutes")}
                      </p>
                    </div>
                    {service.todos && service.todos.length > 0 && (
                      <div>
                        <FormLabel>{t("toDos")}</FormLabel>
                        <ul className="text-muted-foreground list-inside list-disc">
                          {service.todos.map((todo: string, index: number) => (
                            <li key={index}>{todo}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {service.include && service.include.length > 0 && (
                      <div>
                        <FormLabel>{t("includes")}</FormLabel>
                        <ul className="text-muted-foreground list-inside list-disc">
                          {service.include.map((item: string, index: number) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="promotions" className="mt-4">
                {service && <ServicePromotionManagement serviceId={service.id} />}
              </TabsContent>
            </Tabs>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("updatePrice")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("serviceName")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Tag className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input placeholder={t("serviceNamePlaceholder")} {...field} className="pl-10" />
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
                    <FormLabel>{t("description")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("serviceDescriptionPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("price")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={t("pricePlaceholder")}
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration_min"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("durationMinutes")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                          type="number"
                          step="5"
                          placeholder={t("durationPlaceholder")}
                          {...field}
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="todos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("toDos")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("todosPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="include"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("includes")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("includePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_global"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center text-base">
                        <Globe className="mr-2 h-4 w-4" />
                        {t("globalService")}
                      </FormLabel>
                      <p className="text-muted-foreground text-sm">
                        {field.value ? t("globalServiceDescription") : t("branchServiceDescription")}
                      </p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {service ? t("updateService") : t("createService")}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
