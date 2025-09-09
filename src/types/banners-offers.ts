export type Banner = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  link_url: string | null;
  start_date: string | null;
  end_date: string | null;
  priority: number;
  target_audience: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  link_url: string | null;
  start_date: string | null;
  end_date: string | null;
  code: string | null;
  discount_type: "percentage" | "fixed" | null;
  discount_value: number | null;
  terms: string | null;
  target_audience: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
};
