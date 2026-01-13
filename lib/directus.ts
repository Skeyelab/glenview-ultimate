export interface Website {
  id: number;
  site_name: string;
  hero_title: string;
  hero_block?: string | null;
  hero_cta_label?: string | null;
  hero_cta_url?: string | null;
  hero_pre_registration_text?: string | null;
  season_summary?: string | null;
}
