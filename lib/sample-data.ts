import { Fatality } from "@/lib/types";

export const sampleFatalities: Fatality[] = [
  {
    id: 1,
    title: "The Personalized AI Shopping Assistant That Burned Too Fast",
    brand: "CartPilot",
    sector: "Retail Tech",
    product_type: "AI Concierge",
    total_loss: "$48M",
    start_year: 2019,
    end_year: 2024,
    intro_text:
      "CartPilot promised one-click hyper-personalized shopping but underestimated CAC and over-invested in model costs.",
    failure_analysis:
      "The team built for enterprise complexity before proving retention in a narrow niche. Unit economics broke as inference costs grew faster than revenue.",
    market_analysis:
      "The market wanted lightweight assistive recommendations, not full autonomous shopping orchestration. Buyers preferred integrated tooling from existing suites.",
    startup_learnings:
      "Win with a narrow wedge first, keep model spend predictable, and tie every infrastructure upgrade to revenue milestones.",
    market_potential:
      "High in B2B commerce enablement where recommendation quality can be tied directly to GMV uplift.",
    difficulty: "Medium-High",
    scalability:
      "Scales with API-first integrations and tenant-level model controls, but requires strict cost governance.",
    pivot_concept:
      "Pivot into an AI merchandising copilot for mid-market Shopify brands focused on campaign optimization.",
    execution_plan: [
      {
        step: "Niche Down",
        detail: "Target DTC brands doing $2M-$20M GMV with repeat catalog updates.",
      },
      {
        step: "Cost Guardrails",
        detail: "Introduce model routing and per-tenant spend caps from day one.",
      },
      {
        step: "Integrate Fast",
        detail: "Ship Shopify and Klaviyo connectors before building custom dashboards.",
      },
    ],
    monetization_strategy:
      "Tiered SaaS + performance bonus on attributable conversion lift.",
    suggested_tech: ["Next.js", "Supabase", "OpenAI", "Vercel", "PostHog"],
    author_name: "Ari Gomez",
    author_role: "Growth PM",
    is_ai_victim: true,
    status: "published",
  },
  {
    id: 2,
    title: "Smart Fleet Forecasting With No Buyer Champion",
    brand: "RoutePulse",
    sector: "Logistics",
    product_type: "Forecasting Platform",
    total_loss: "$27M",
    start_year: 2020,
    end_year: 2025,
    intro_text:
      "RoutePulse built accurate forecasts but sold to operations teams without a clear budget owner.",
    failure_analysis:
      "The product solved a real pain but lacked internal champions. Sales cycles stretched and churn stayed high due to weak onboarding.",
    market_analysis:
      "SMB fleets valued reliability and onboarding support over advanced prediction features.",
    startup_learnings:
      "A technical edge does not replace buyer alignment. Pricing and onboarding are core product choices.",
    market_potential:
      "Strong upside in verticalized route optimization with embedded workflows.",
    difficulty: "Medium",
    scalability:
      "High if onboarding becomes self-serve and partner channels drive distribution.",
    pivot_concept:
      "Reposition as a white-label route optimization engine for fleet management software vendors.",
    execution_plan: [
      {
        step: "Partner Channel",
        detail: "Offer SDK + APIs to existing TMS vendors.",
      },
      {
        step: "Launch Template Kits",
        detail: "Prebuilt dashboards for food delivery and service fleets.",
      },
      {
        step: "Outcome Pricing",
        detail: "Price by reduced idle time and route efficiency gains.",
      },
    ],
    monetization_strategy: "Usage-based API + annual enterprise support retainers.",
    suggested_tech: ["Next.js", "Supabase", "Mapbox", "Node.js", "Redis"],
    author_name: "Noah Hart",
    author_role: "Student Researcher",
    is_ai_victim: false,
    status: "published",
  },
];
