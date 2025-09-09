"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFranchiseBranchStore } from "@/stores/franchise-dashboard/branch-store";
import { useFranchiseServiceStore, Service } from "@/stores/franchise-dashboard/service-store";

import { ServiceCard } from "./service-card";

export function ServiceManagementPage() {
  const t = useTranslations("franchise.services");
  const { branches, fetchBranches } = useFranchiseBranchStore();
  const { services, fetchServices } = useFranchiseServiceStore();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("all");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchBranches();
    fetchServices();
  }, [fetchBranches, fetchServices]);

  useEffect(() => {
    if (selectedBranchId === "all") {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter((service) => service.branchId === selectedBranchId || service.is_global));
    }
  }, [selectedBranchId, services]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>{t("services")}</CardTitle>
              <CardDescription>{t("viewAndManage")}</CardDescription>
            </div>
            <div className="w-full md:w-64">
              <Select value={selectedBranchId} onValueChange={setSelectedBranchId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("selectBranch")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("allBranches")}</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => <ServiceCard key={service.id} service={service} branches={branches} />)
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  {selectedBranchId === "all" ? t("noServicesFound") : t("noServicesForBranch")}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
