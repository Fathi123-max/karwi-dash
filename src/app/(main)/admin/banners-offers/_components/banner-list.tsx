"use client";

import { useEffect } from "react";
import { MoreHorizontal, Edit, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Banner } from "@/types/banners-offers";
import { useBannersOffersStore } from "@/stores/admin-dashboard/banners-offers-store";

export function BannerList({ onEdit }: { onEdit: (banner: Banner) => void }) {
  const { banners, loading, fetchBanners, deleteBanner } = useBannersOffersStore();

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    try {
      await deleteBanner(id);
      toast.success(`Banner "${title}" deleted successfully`);
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading banners...</div>;
  }

  return (
    <div className="space-y-4">
      {banners.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No banners found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {banners.map((banner) => (
            <div key={banner.id} className="overflow-hidden rounded-lg border">
              {banner.image_url ? (
                <div className="bg-muted relative aspect-video">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpath d='M21 15l-5-5L5 21'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ) : (
                <div className="bg-muted flex aspect-video items-center justify-center">
                  <span className="text-muted-foreground">No image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="line-clamp-1 font-semibold">{banner.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(banner)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {banner.description && (
                  <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{banner.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <Badge variant={banner.is_active ? "default" : "secondary"}>
                    {banner.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <span className="text-muted-foreground text-sm">Priority: {banner.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
