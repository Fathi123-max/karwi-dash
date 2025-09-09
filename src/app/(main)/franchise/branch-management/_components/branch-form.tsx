"use client";
import { useMemo } from "react";

import dynamic from "next/dynamic";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2, PlusCircle, Trash2, Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFranchiseBranchStore, Branch } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore } from "@/stores/franchise-dashboard/service-store";

import { BranchBookingManagement } from "./branch-booking-management";
import { ServiceDialog } from "./service-dialog";

// Define a unified form schema
const formSchema = z.object({
  name: z.string().min(2, "Branch name must be at least 2 characters.").optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .refine((data) => data.lat && data.lng, {
      message: "Please select a location on the map.",
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Remove the old schema definitions
// const addFormSchema = z.object({ ... });
// const editFormSchema = z.object({ ... });
// type AddFormValues = z.infer<typeof addFormSchema>;
// type EditFormValues = z.infer<typeof editFormSchema>;

interface BranchFormProps {
  branch?: Branch;
  onSuccess: () => void;
}

// Helper to parse location string
const parseLocation = (locationStr: string | null | undefined): { lat: number; lng: number } | undefined => {
  if (!locationStr) return undefined;
  // Check for WKT format
  const match = locationStr.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { lng: parseFloat(match[1]), lat: parseFloat(match[2]) };
  }
  // Check for GeoJSON format (from location picker)
  try {
    const parsed = JSON.parse(locationStr);
    if (parsed && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return parsed;
    }
  } catch (e) {
    // Not a JSON string, ignore
  }
  return undefined;
};

export function BranchForm({ branch, onSuccess }: BranchFormProps) {
  const t = useTranslations("franchise.branches.form");
  const { addBranch, updateBranch, fetchBranches } = useFranchiseBranchStore();
  const { deleteService } = useFranchiseServiceStore();

  const LocationPicker = useMemo(
    () =>
      dynamic(() => import("./location-picker").then((mod) => mod.LocationPicker), {
        ssr: false,
        loading: () => <p className="text-muted-foreground text-sm">{t("loadingMap")}</p>,
      }),
    [],
  );

  // Determine if we're in edit mode (true) or add mode (false)
  const isEditMode = !!branch;

  // Use unified form schema
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: branch?.name ?? "",
      location: parseLocation((branch as any)?.location_text),
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Handle form submission for both add and edit operations
  const onSubmit = async (data: FormValues) => {
    try {
      if (isEditMode && branch) {
        // EDIT FEATURE: In edit mode, we don't update name or location
        // Just show success message since there's nothing to update
        toast.success(t("branchUpdated"));
        onSuccess();
      } else {
        // ADD FEATURE: Create new branch with provided data
        // Type guard to ensure we have the required data
        if (!data.name || !data.location) {
          toast.error(t("provideRequiredInfo"));
          return;
        }

        const locationString = `POINT(${data.location.lng} ${data.location.lat})`;
        await addBranch({
          name: data.name,
          location: locationString,
        });
        toast.success(t("branchCreated"));
        onSuccess();
      }
    } catch (error) {
      toast.error(t("failedToActionBranch", { action: isEditMode ? t("update") : t("create") }));
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      await fetchBranches(); // Refetch to update the service list
      toast.success(t("serviceDeleted"));
    } catch (error) {
      toast.error(t("failedToDeleteService"));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="border-0 shadow-none md:border md:shadow-sm">
            <CardHeader className="px-0 md:px-6">
              <CardTitle className="text-xl md:text-2xl">
                {isEditMode ? t("manageBranchServices") : t("addNewBranch")}
              </CardTitle>
              <CardDescription>
                {isEditMode ? t("manageServicesDescription") : t("addBranchDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0 md:px-6">
              {isEditMode ? null : (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("branchName")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                          <Input placeholder={t("branchNamePlaceholder")} {...field} className="h-12 pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isEditMode ? null : (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("location")}</FormLabel>
                      <FormControl>
                        <LocationPicker
                          onLocationSelect={field.onChange}
                          initialPosition={field.value}
                          className="h-[300px] overflow-hidden rounded-lg md:h-[400px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {branch && (
            <Card className="border-0 shadow-none md:border md:shadow-sm">
              <CardContent className="px-0 md:px-6">
                <Tabs defaultValue="services" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="services">{t("services")}</TabsTrigger>
                    <TabsTrigger value="bookings">{t("bookings")}</TabsTrigger>
                    <TabsTrigger value="details">{t("branchDetails")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="services" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="space-y-1.5">
                          <h3 className="text-lg font-medium">{t("manageServices")}</h3>
                          <p className="text-muted-foreground text-sm">{t("editRemoveServices")}</p>
                        </div>
                        {/* Add Service button hidden as per requirements */}
                      </div>
                      <ScrollArea className="h-96 w-full rounded-lg border lg:h-[450px]">
                        <div className="space-y-4 p-4">
                          {branch.services && branch.services.length > 0 ? (
                            branch.services.map((service: any) => (
                              <div
                                key={service.id}
                                className="flex flex-col justify-between gap-4 rounded-lg border p-4 transition-all hover:shadow-sm sm:flex-row sm:items-center"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-muted-foreground text-sm">
                                    ${service.price?.toFixed(2) ?? t("na")} &middot; {service.duration_min ?? t("na")}{" "}
                                    {t("mins")}
                                  </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-2">
                                  <ServiceDialog branchId={branch.id} service={service}>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4" />
                                      <span className="sr-only">{t("edit")}</span>
                                    </Button>
                                  </ServiceDialog>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">{t("delete")}</span>
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          {t("deleteServiceConfirmation", { name: service.name })}
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                                          {t("continue")}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground flex h-[200px] flex-col items-center justify-center p-4 text-center">
                              <div className="mb-2 text-lg font-medium">{t("noServicesAdded")}</div>
                              <p className="mb-4 max-w-xs">{t("noServicesAvailable")}</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  <TabsContent value="bookings" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-medium">{t("bookingManagement")}</h3>
                        <p className="text-muted-foreground text-sm">{t("manageBookings")}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <BranchBookingManagement branchId={branch.id} />
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="details" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-medium">{t("branchDetails")}</h3>
                        <p className="text-muted-foreground text-sm">{t("additionalInfo")}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="font-medium">{t("branchId")}</h4>
                            <p className="text-muted-foreground text-sm">{branch.id}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">{t("createdAt")}</h4>
                            <p className="text-muted-foreground text-sm">
                              {branch.created_at ? new Date(branch.created_at).toLocaleString() : t("na")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? t("done") : t("addBranch")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
