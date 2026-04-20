export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          title_affiliation: string | null;
          bio: string | null;
          avatar_url: string | null;
          x_url: string | null;
          patreon_url: string | null;
          buy_me_a_coffee_url: string | null;
          donation_url: string | null;
          notify_on_reply: boolean;
          role: Database["public"]["Enums"]["app_role"];
          invited_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          title_affiliation?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          x_url?: string | null;
          patreon_url?: string | null;
          buy_me_a_coffee_url?: string | null;
          donation_url?: string | null;
          notify_on_reply?: boolean;
          role?: Database["public"]["Enums"]["app_role"];
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          title_affiliation?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          x_url?: string | null;
          patreon_url?: string | null;
          buy_me_a_coffee_url?: string | null;
          donation_url?: string | null;
          notify_on_reply?: boolean;
          role?: Database["public"]["Enums"]["app_role"];
          invited_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      research_invites: {
        Row: {
          id: string;
          code: string;
          invited_by: string | null;
          used_by: string | null;
          created_at: string;
          used_at: string | null;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          invited_by?: string | null;
          used_by?: string | null;
          created_at?: string;
          used_at?: string | null;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          code?: string;
          invited_by?: string | null;
          used_by?: string | null;
          created_at?: string;
          used_at?: string | null;
          revoked_at?: string | null;
        };
        Relationships: [];
      };
      fail_logs: {
        Row: {
          id: number;
          author_id: string;
          title: string;
          model_name: string;
          task_attempted: string;
          description: string;
          time_wasted: Database["public"]["Enums"]["time_wasted_bucket"];
          image_urls: string[];
          status: Database["public"]["Enums"]["moderation_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          author_id: string;
          title: string;
          model_name: string;
          task_attempted: string;
          description: string;
          time_wasted: Database["public"]["Enums"]["time_wasted_bucket"];
          image_urls?: string[];
          status?: Database["public"]["Enums"]["moderation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          author_id?: string;
          title?: string;
          model_name?: string;
          task_attempted?: string;
          description?: string;
          time_wasted?: Database["public"]["Enums"]["time_wasted_bucket"];
          image_urls?: string[];
          status?: Database["public"]["Enums"]["moderation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      comments: {
        Row: {
          id: number;
          fail_log_id: number;
          author_id: string;
          parent_id: number | null;
          content: string;
          status: Database["public"]["Enums"]["moderation_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          fail_log_id: number;
          author_id: string;
          parent_id?: number | null;
          content: string;
          status?: Database["public"]["Enums"]["moderation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          fail_log_id?: number;
          author_id?: string;
          parent_id?: number | null;
          content?: string;
          status?: Database["public"]["Enums"]["moderation_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      flags: {
        Row: {
          id: number;
          reporter_id: string;
          target_type: "log" | "comment";
          fail_log_id: number | null;
          comment_id: number | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          reporter_id: string;
          target_type: "log" | "comment";
          fail_log_id?: number | null;
          comment_id?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          reporter_id?: string;
          target_type?: "log" | "comment";
          fail_log_id?: number | null;
          comment_id?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      app_role: "admin" | "researcher";
      moderation_status: "visible" | "hidden" | "flagged";
      time_wasted_bucket: "under_15m" | "30_60m" | "1_4h" | "1_day" | "multiple_days";
    };
    CompositeTypes: Record<string, never>;
  };
};
