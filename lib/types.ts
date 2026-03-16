export type PublishStatus = "draft" | "published";

export interface Fatality {
  id: number;
  created_at?: string;
  title: string;
  brand: string;
  sector: string;
  product_type: string;
  total_loss: string;
  start_year: number;
  end_year: number;
  intro_text: string;
  failure_analysis: string;
  market_analysis: string;
  startup_learnings: string;
  market_potential: string;
  difficulty: string;
  scalability: string;
  pivot_concept: string;
  execution_plan: Array<{ step: string; detail: string }>;
  monetization_strategy: string;
  suggested_tech: string[];
  author_name: string;
  author_role: string;
  is_ai_victim: boolean;
  status: PublishStatus;
}

export interface CommentInput {
  fatality_id: number;
  name: string;
  email: string;
  comment: string;
}
