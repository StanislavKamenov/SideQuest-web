import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, AlertCircle, Zap, Shield, Infinity } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const PLANS = [
  { 
    id: "free", 
    name: "Free", 
    price: "€0", 
    quota: "1 event / month",
    features: ["1 Active Event", "Basic Analytics", "Standard Support"],
    icon: Shield,
    color: "text-muted-foreground"
  },
  { 
    id: "starter", 
    name: "Starter", 
    price: "€9.99", 
    quota: "5 events / month",
    features: ["5 Active Events", "Advanced Analytics", "Priority Support", "Basic Customization"],
    icon: Zap,
    color: "text-[#6B9FD4]"
  },
  { 
    id: "business", 
    name: "Business", 
    price: "€19.99", 
    quota: "15 events / month",
    features: ["15 Active Events", "Custom Branding", "Dedicated Account Manager", "API Access"],
    icon: CreditCard,
    color: "text-[#E8C36A]"
  },
  { 
    id: "unlimited", 
    name: "Unlimited", 
    price: "€29.99", 
    quota: "Unlimited events",
    features: ["Unlimited Events", "White-label Solution", "24/7 Phone Support", "Custom Integrations"],
    icon: Infinity,
    color: "text-[#A663E0]"
  },
];

const TIER_ORDER = { "free": 0, "starter": 1, "business": 2, "unlimited": 3 };

export default function AdminBilling() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [business, setBusiness] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchBillingData = async () => {
    try {
      setIsLoading(true);
      // 1. Fetch business where user is owner
      const { data: bData, error: bError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (bError) throw bError;
      if (!bData) {
        setIsLoading(false);
        return; // No business found
      }
      setBusiness(bData);

      // 2. Fetch subscription using business_id
      const { data: subData, error: subError } = await supabase
        .from('business_subscriptions')
        .select('*')
        .eq('business_id', bData.id)
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(subData);
    } catch (error) {
      console.error("Error fetching billing data:", error);
      toast({
        title: "Error Loading Billing",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBillingData();
    }
  }, [user]);

  // Handle successful redirect from Stripe
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Checkout Successful!",
        description: "Your subscription is being updated. It may take a few moments to reflect.",
      });
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
      // Re-fetch to see if webhook processed it already
      fetchBillingData();
    }
    if (query.get("canceled")) {
      toast({
        title: "Checkout Canceled",
        description: "You have not been charged.",
        variant: "destructive",
      });
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);

  const handleUpgrade = async (tierId) => {
    if (!business?.id) return;
    
    try {
      setIsCheckoutLoading(true);
      setSelectedPlan(tierId);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          business_id: business.id,
          product_type: 'subscription',
          tier: tierId
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Stripe Error:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Failed to initialize secure checkout.",
        variant: "destructive",
      });
      setIsCheckoutLoading(false);
      setSelectedPlan(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#E85D4A]/30 border-t-[#E85D4A] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-20 bg-card border border-border">
        <h2 className="font-pixel text-[12px] text-muted-foreground tracking-widest">NO BUSINESS PROFILE FOUND</h2>
        <p className="font-body text-sm text-muted-foreground/60 mt-2">You need an active business profile to access billing.</p>
      </div>
    );
  }

  const currentTier = subscription?.tier || "free";
  const quotaUsed = subscription?.events_used || 0;
  const quotaTotal = subscription?.events_quota || 1;
  const isUnlimited = currentTier === 'unlimited';
  const progress = isUnlimited ? 0 : Math.min(100, Math.round((quotaUsed / quotaTotal) * 100));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-pixel text-[clamp(0.7rem,2vw,1rem)] text-foreground glow-red mb-2 leading-relaxed">
          BILLING & SUBSCRIPTION
        </h1>
        <p className="font-body text-sm text-muted-foreground">
          Manage your plan, limits, and billing details
        </p>
      </div>

      {/* Current Status Overview */}
      <div className="bg-card border border-border p-6 flex flex-col md:flex-row gap-8 items-start md:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-pixel text-[10px] text-foreground tracking-widest">CURRENT PLAN: <span className="text-[#E85D4A]">{currentTier.toUpperCase()}</span></h2>
            {subscription?.status !== 'active' && (
              <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-500 font-pixel text-[6px] tracking-wider">
                {subscription?.status?.toUpperCase()}
              </span>
            )}
            {subscription?.cancel_at_period_end && (
              <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-pixel text-[6px] tracking-wider">
                CANCELS SOON
              </span>
            )}
          </div>
          
          <div className="space-y-3 mt-6">
            <div className="flex justify-between font-pixel text-[8px] tracking-wider">
              <span className="text-muted-foreground">EVENT QUOTA USAGE</span>
              <span className="text-foreground">{quotaUsed} / {isUnlimited ? '∞' : quotaTotal}</span>
            </div>
            {!isUnlimited && (
              <div className="h-2 bg-secondary overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress >= 90 ? '#ef4444' : '#C8E650',
                  }}
                />
              </div>
            )}
          </div>

          {subscription?.current_period_end && (
            <p className="font-body text-xs text-muted-foreground mt-4">
              Current billing period ends: {new Date(subscription.current_period_end).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <h3 className="font-pixel text-[10px] text-foreground tracking-widest mt-8 mb-4">AVAILABLE PLANS</h3>
      
      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {PLANS.map((plan) => {
          const PlanIcon = plan.icon;
          const isCurrent = currentTier === plan.id;
          const canUpgrade = TIER_ORDER[plan.id] > TIER_ORDER[currentTier];

          return (
            <div 
              key={plan.id} 
              className={`flex flex-col bg-card border p-5 transition-all ${
                isCurrent 
                  ? 'border-[#E85D4A] shadow-[0_0_15px_rgba(232,93,74,0.1)]' 
                  : 'border-border hover:border-border/80'
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <PlanIcon className={`w-5 h-5 ${plan.color}`} />
                <h4 className="font-pixel text-[9px] text-foreground tracking-widest">{plan.name.toUpperCase()}</h4>
              </div>
              
              <div className="mb-6">
                <span className="font-pixel text-xl text-foreground">{plan.price}</span>
                <span className="font-body text-xs text-muted-foreground ml-1">/ mo</span>
              </div>

              <div className="flex-1">
                <p className="font-pixel text-[7px] text-muted-foreground tracking-wider mb-3">INCLUDES:</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 font-body text-xs text-muted-foreground">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 ${plan.color}`} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {isCurrent ? (
                <div className="w-full py-3 border border-[#E85D4A]/50 bg-[#E85D4A]/10 text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E85D4A]" />
                  <span className="font-pixel text-[8px] text-[#E85D4A] tracking-wider">CURRENT PLAN</span>
                </div>
              ) : canUpgrade ? (
                <button 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCheckoutLoading}
                  className="w-full py-3 bg-foreground text-background font-pixel text-[8px] tracking-wider hover:bg-foreground/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isCheckoutLoading && selectedPlan === plan.id ? (
                    <>
                      <span className="w-3 h-3 border-2 border-background/20 border-t-background rounded-full animate-spin"></span>
                      PROCESSING
                    </>
                  ) : (
                    'UPGRADE'
                  )}
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 bg-secondary text-muted-foreground font-pixel text-[8px] tracking-wider opacity-50 cursor-not-allowed"
                >
                  UNAVAILABLE
                </button>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/20 rounded flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 shrink-0" />
        <p className="font-body text-xs text-blue-400/90 leading-relaxed">
          Payments are processed securely via Stripe. Upgrading to a new tier will instantly increase your event quota. If you have questions about your billing or need a custom enterprise solution, please contact support.
        </p>
      </div>
    </div>
  );
}
