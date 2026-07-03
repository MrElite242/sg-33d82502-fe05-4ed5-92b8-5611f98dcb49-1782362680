import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PaymentSuccess() {
  const router = useRouter();
  const { session_id } = router.query;

  useEffect(() => {
    // Clear session storage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selectedPlan");
      sessionStorage.removeItem("billingCycle");
    }
  }, []);

  return (
    <>
      <SEO 
        title="Payment Successful - Canna Blaze 360"
        description="Your subscription has been activated successfully"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-3">Payment Successful!</h1>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Your subscription has been activated successfully
            </p>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-emerald-900 dark:text-emerald-100">
                <strong>14-day free trial started!</strong><br />
                You won't be charged until your trial ends. Cancel anytime before then.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/dashboard">
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-lg h-12">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/account">
                <Button variant="outline" className="w-full">
                  View Subscription Details
                </Button>
              </Link>
            </div>

            {session_id && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                Session ID: {session_id}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}