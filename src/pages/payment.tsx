import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Wallet, Building2, Bitcoin, Smartphone, CheckCircle2, Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { GENERAL_PLANS, calculateTotal, TAX_RATE } from "@/config/pricing";

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "ach" | "wallet">("card");
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [selectedPlan] = useState(() => {
    const professional = GENERAL_PLANS.find(p => p.id === "professional");
    return professional || GENERAL_PLANS[0];
  });

  const subtotal = selectedPlan.price;
  const tax = subtotal * TAX_RATE;
  const total = calculateTotal(subtotal);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <>
        <SEO 
          title="Payment Successful - Blaze 360"
          description="Your payment has been processed successfully"
        />
        
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your subscription to {selectedPlan.name} plan has been activated.
              </p>
              <div className="space-y-3">
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/account">
                  <Button variant="outline" className="w-full">
                    View Subscription Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO 
        title="Secure Payment - Blaze 360"
        description="Complete your subscription payment securely with multiple payment options"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-6">
            <Link href="/plans">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Plans
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose your preferred payment method</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Secure Payment
                  </CardTitle>
                  <CardDescription>
                    All transactions are encrypted and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="card">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="crypto">
                        <Bitcoin className="w-4 h-4 mr-2" />
                        Crypto
                      </TabsTrigger>
                      <TabsTrigger value="ach">
                        <Building2 className="w-4 h-4 mr-2" />
                        ACH
                      </TabsTrigger>
                      <TabsTrigger value="wallet">
                        <Wallet className="w-4 h-4 mr-2" />
                        Wallet
                      </TabsTrigger>
                    </TabsList>

                    {/* Credit/Debit Card */}
                    <TabsContent value="card">
                      <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input 
                            id="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input 
                              id="cvc" 
                              placeholder="123" 
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cardName">Cardholder Name</Label>
                          <Input 
                            id="cardName" 
                            placeholder="John Doe" 
                            required
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                          Powered by Stripe - PCI DSS Compliant
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
                          disabled={processing}
                        >
                          {processing ? "Processing..." : `Pay $${selectedPlan.price}/${selectedPlan.interval}`}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Cryptocurrency */}
                    <TabsContent value="crypto">
                      <div className="space-y-4">
                        <div className="text-center py-6">
                          <Bitcoin className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                          <h3 className="text-lg font-semibold mb-2">Pay with Cryptocurrency</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            We accept Bitcoin, Ethereum, and USDC
                          </p>
                        </div>
                        
                        <div className="grid gap-3">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <Bitcoin className="w-8 h-8 text-orange-500" />
                              <div className="text-left">
                                <div className="font-semibold">Bitcoin (BTC)</div>
                                <div className="text-xs text-gray-500">Pay with Bitcoin</div>
                              </div>
                            </div>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                Ξ
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">Ethereum (ETH)</div>
                                <div className="text-xs text-gray-500">Pay with Ethereum</div>
                              </div>
                            </div>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                $
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">USD Coin (USDC)</div>
                                <div className="text-xs text-gray-500">Pay with stablecoin</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                        
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                          Cryptocurrency payments are processed through Coinbase Commerce
                        </div>
                      </div>
                    </TabsContent>

                    {/* ACH Bank Transfer */}
                    <TabsContent value="ach">
                      <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                          <Label htmlFor="accountName">Account Holder Name</Label>
                          <Input 
                            id="accountName" 
                            placeholder="John Doe" 
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input 
                            id="routingNumber" 
                            placeholder="123456789" 
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input 
                            id="accountNumber" 
                            placeholder="0000000000" 
                            type="password"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="accountType">Account Type</Label>
                          <select 
                            id="accountType" 
                            className="w-full px-3 py-2 border rounded-md"
                            required
                          >
                            <option value="checking">Checking</option>
                            <option value="savings">Savings</option>
                          </select>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                          <p className="text-blue-900 dark:text-blue-100">
                            <strong>Note:</strong> ACH transfers may take 3-5 business days to process. 
                            Your subscription will be activated once payment is confirmed.
                          </p>
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
                          disabled={processing}
                        >
                          {processing ? "Processing..." : "Authorize ACH Payment"}
                        </Button>
                      </form>
                    </TabsContent>

                    {/* Digital Wallets */}
                    <TabsContent value="wallet">
                      <div className="space-y-4">
                        <div className="text-center py-4">
                          <Wallet className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                          <h3 className="text-lg font-semibold mb-2">Pay with Digital Wallet</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Quick and secure one-tap payment
                          </p>
                        </div>
                        
                        <div className="grid gap-3">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4 bg-black hover:bg-gray-900 text-white"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <Smartphone className="w-8 h-8" />
                              <div className="text-left">
                                <div className="font-semibold">Apple Pay</div>
                                <div className="text-xs text-gray-300">Pay with Apple Wallet</div>
                              </div>
                            </div>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 to-red-500"></div>
                              <div className="text-left">
                                <div className="font-semibold">Google Pay</div>
                                <div className="text-xs text-gray-500">Pay with Google Wallet</div>
                              </div>
                            </div>
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            className="w-full justify-start h-auto py-4"
                            onClick={handlePayment}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                P
                              </div>
                              <div className="text-left">
                                <div className="font-semibold">PayPal</div>
                                <div className="text-xs text-gray-500">Pay with PayPal account</div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Security Info */}
              <div className="mt-6 grid sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-gray-600 dark:text-gray-400">Verified by Stripe</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{selectedPlan.name} Plan</span>
                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                        Popular
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Billed {selectedPlan.interval}ly
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (Cannabis excise)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>

                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-sm">What's Included:</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Full seed-to-sale tracking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Unlimited plant batches</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Advanced analytics</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>QuickBooks integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>Priority support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    By completing this purchase, you agree to our Terms of Service and Privacy Policy. 
                    Your subscription will automatically renew unless cancelled.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}