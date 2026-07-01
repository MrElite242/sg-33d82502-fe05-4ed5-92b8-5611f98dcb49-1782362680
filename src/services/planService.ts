import { supabase } from "@/integrations/supabase/client";
import { GENERAL_PLANS, DOCTOR_PLANS, calculateAnnualPrice } from "@/config/pricing";
import type { Database } from "@/integrations/supabase/database.types";

type SubscriptionPlan = Database["public"]["Tables"]["subscription_plans"]["Row"];
type SubscriptionPlanInsert = Database["public"]["Tables"]["subscription_plans"]["Insert"];

/**
 * Sync plans from pricing config to Supabase
 * This ensures the database always has the latest pricing
 */
export async function syncPlansToSupabase(): Promise<{ success: boolean; error?: string }> {
  try {
    // Prepare general plans
    const generalPlansData: Omit<SubscriptionPlanInsert, "id" | "created_at" | "updated_at">[] = GENERAL_PLANS.map((plan) => ({
      plan_id: plan.id,
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price,
      price_annual: calculateAnnualPrice(plan.price),
      plan_type: "general",
      popular: plan.popular || false,
      features: plan.features.map(f => f.name),
      max_users: plan.id === "starter" ? 3 : plan.id === "professional" ? 10 : null,
      max_locations: plan.id === "starter" ? 1 : plan.id === "professional" ? 5 : null,
      storage_gb: plan.id === "starter" ? 10 : plan.id === "professional" ? 100 : null,
      active: true,
    }));

    // Prepare doctor plans
    const doctorPlansData: Omit<SubscriptionPlanInsert, "id" | "created_at" | "updated_at">[] = DOCTOR_PLANS.map((plan) => ({
      plan_id: `doctor-${plan.id}`,
      name: plan.name,
      description: plan.description,
      price_monthly: plan.price,
      price_annual: calculateAnnualPrice(plan.price),
      plan_type: "doctor",
      popular: plan.popular || false,
      features: plan.features,
      max_users: plan.id === "starter" ? 1 : plan.id === "professional" ? 5 : null,
      max_locations: plan.id === "starter" ? 1 : plan.id === "professional" ? 3 : null,
      storage_gb: plan.id === "starter" ? 5 : plan.id === "professional" ? 25 : null,
      active: true,
    }));

    const allPlans = [...generalPlansData, ...doctorPlansData];

    // Upsert plans (insert or update if exists)
    const { error } = await supabase
      .from("subscription_plans")
      .upsert(allPlans, {
        onConflict: "plan_id",
        ignoreDuplicates: false,
      });

    if (error) {
      console.error("Error syncing plans:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error syncing plans:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch all active plans from Supabase
 */
export async function fetchPlans(
  planType?: "general" | "doctor"
): Promise<{ data: SubscriptionPlan[] | null; error: string | null }> {
  try {
    let query = supabase
      .from("subscription_plans")
      .select("*")
      .eq("active", true)
      .order("price_monthly", { ascending: true });

    if (planType) {
      query = query.eq("plan_type", planType);
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get a specific plan by plan_id
 */
export async function getPlanById(
  planId: string
): Promise<{ data: SubscriptionPlan | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("plan_id", planId)
      .eq("active", true)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create a user subscription
 */
export async function createUserSubscription(params: {
  userId: string;
  planId: string;
  billingCycle: "monthly" | "annual";
  trialDays?: number;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId, planId, billingCycle, trialDays = 14 } = params;

    // Get the plan details
    const { data: plan } = await getPlanById(planId);
    if (!plan) {
      return { success: false, error: "Plan not found" };
    }

    // Calculate period end date
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);
    const periodEnd = new Date(
      now.getTime() + (billingCycle === "annual" ? 365 : 30) * 24 * 60 * 60 * 1000
    );

    const { error } = await supabase.from("user_subscriptions").insert({
      user_id: userId,
      plan_id: plan.id,
      billing_cycle: billingCycle,
      status: "trial",
      trial_ends_at: trialEndsAt.toISOString(),
      current_period_start: now.toISOString(),
      current_period_end: periodEnd.toISOString(),
      cancel_at_period_end: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get user's active subscription
 */
export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*, plan:subscription_plans(*)")
      .eq("user_id", userId)
      .in("status", ["active", "trial"])
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" which is fine
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}