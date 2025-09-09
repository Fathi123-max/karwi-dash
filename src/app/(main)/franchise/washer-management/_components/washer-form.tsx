"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { User, Building, Star, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseUserStore, WasherWithBranch } from "@/stores/franchise-dashboard/user-store";

const formSchema = z.object({
  name: z.string().min(2, "Washer name must be at least 2 characters."),
  branch_id: z.string().uuid({ message: "Please select a branch." }),
  status: z.enum(["active", "inactive"]),
  rating: z.coerce.number().min(0).max(5),
});

type WasherFormValues = z.infer<typeof formSchema>;

interface WasherFormProps {
  washer?: WasherWithBranch;
  onSuccess: () => void;
}

// Helper function to handle the submission logic for both add and edit operations
async function handleSubmission(
  data: WasherFormValues,
  washer: WasherWithBranch | undefined,
  addWasher: (data: any) => Promise<void>,
  updateWasher: (data: any) => Promise<void>,
  onSuccess: () => void,
  t: (key: string) => string,
) {
  try {
    if (washer) {
      // EDIT FEATURE: Update existing washer with new data
      await updateWasher({ ...washer, ...data });
      toast.success(t("washerUpdated"));
    } else {
      // ADD FEATURE: Create new washer with provided data
      await addWasher(data);
      toast.success(t("washerCreated"));
    }
    onSuccess();
  } catch (error) {
    toast.error(t("errorOccurred"));
    console.error(error);
  }
}

export function WasherForm({ washer, onSuccess }: WasherFormProps) {
  const t = useTranslations("franchise.washers.form");
  const { addWasher, updateWasher } = useFranchiseUserStore();
  const { branches, fetchBranches } = useFranchiseBranchStore();

  useEffect(() => {
    if (branches.length === 0) {
      fetchBranches();
    }
  }, [fetchBranches, branches.length]);

  const form = useForm<WasherFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: washer?.name ?? "",
      branch_id: washer?.branch_id ?? undefined,
      status: washer?.status ?? "active",
      rating: washer?.rating ?? 0,
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // Simplified onSubmit handler that delegates to handleSubmission
  const onSubmit = (data: WasherFormValues) => handleSubmission(data, washer, addWasher, updateWasher, onSuccess, t);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("washerName")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input placeholder={t("washerNamePlaceholder")} {...field} className="pl-10" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="branch_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("branch")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <div className="relative">
                      <Building className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder={t("selectBranch")} />
                      </SelectTrigger>
                    </div>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("status")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectStatus")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("rating")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Star className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input type="number" step="0.1" {...field} className="pl-10" min="0" max="5" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {washer ? t("updateWasher") : t("createWasher")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
