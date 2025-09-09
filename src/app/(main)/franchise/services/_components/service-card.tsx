"use client";

import { useState } from "react";

import { Globe, Edit, Tag, Clock, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Branch } from "@/stores/franchise-dashboard/branch-store";
import { Service } from "@/stores/franchise-dashboard/service-store";

import { FranchiseAvailabilityList } from "./availability/availability-list";
import { ServicePromotionManagement } from "./service-promotion-management";

interface ServiceCardProps {
  service: Service;
  branches: Branch[];
}

export function ServiceCard({ service, branches }: ServiceCardProps) {
  const t = useTranslations("franchise.services.card");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Find the branch name for display
  const branchName = branches.find((b) => b.id === service.branchId)?.name ?? t("unknownBranch");

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {service.name}
              {service.is_global && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {t("global")}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {service.is_global ? t("availableAtAllBranches") : t("branchLabel", { name: branchName })}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t("manage")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("manageService")}</DialogTitle>
                <DialogDescription>{t("editDetails", { name: service.name })}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <DollarSign className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{t("price")}</p>
                      <p className="text-lg font-bold">${service.price?.toFixed(2) ?? "0.00"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Clock className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{t("duration")}</p>
                      <p className="text-lg font-bold">
                        {service.duration_min ?? 0} {t("mins")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border p-3">
                    <Tag className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{t("type")}</p>
                      <p className="text-lg font-bold">{service.is_global ? t("global") : t("branchSpecific")}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{t("description")}</h3>
                  <p className="text-muted-foreground">{service.description ?? t("noDescription")}</p>
                </div>

                {service.todos && service.todos.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("toDos")}</h3>
                    <ul className="list-inside list-disc space-y-1">
                      {service.todos.map((todo, index) => (
                        <li key={index} className="text-muted-foreground">
                          {todo}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {service.include && service.include.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t("includes")}</h3>
                    <ul className="list-inside list-disc space-y-1">
                      {service.include.map((item, index) => (
                        <li key={index} className="text-muted-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <FranchiseAvailabilityList serviceId={service.id} />
                <ServicePromotionManagement serviceId={service.id} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">${service.price?.toFixed(2) ?? "0.00"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">
              {service.duration_min ?? 0} {t("mins")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
