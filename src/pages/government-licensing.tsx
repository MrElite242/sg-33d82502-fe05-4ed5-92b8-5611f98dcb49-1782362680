import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  Globe,
  Users,
  ShieldCheck,
  Building2,
  Zap,
  Award,
  HeadphonesIcon,
  Sparkles,
  TrendingUp,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function GovernmentLicensing() {
  const tiers = [
    {
      name: "Tier 1 – Emerging Program",
      price: "$350,000",
      priceDetail: "USD per year",
      description: "Best for: Countries launching a medical cannabis program",
      badge: "Starter",
      badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      icon: Globe,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-950/30",
      features: [
        "Government Licensing Suite",
        "Regulatory Dashboard",
        "Compliance Management",
        "Inspection Management",
        "100 Licensees",
        "Standard support"
      ],
      popular: false
    },
    {
      name: "Tier 2 – National Medical Cannabis Program",
      price: "$850,000",
      priceDetail: "USD per year",
      description: "Comprehensive medical cannabis infrastructure",
      badge: "Popular",
      badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/30",
      features: [
        "Everything in Tier 1, plus:",
        "Patient Registry",
        "Physician Portal",
        "Pharmacy Suite",
        "Laboratory Integration",
        "Executive Dashboards",
        "Priority Support",
        "API Access"
      ],
      popular: true
    },
    {
      name: "Tier 3 – National Medical + Adult-Use Program",
      price: "$2.5M",
      priceDetail: "USD per year",
      description: "Complete dual-market regulatory framework",
      badge: "Advanced",
      badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
      icon: Building2,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-950/30",
      features: [
        "Unlimited government users",
        "National seed-to-sale platform",
        "Manufacturing Suite",
        "Distribution Suite",
        "Retail & Dispensary Suite",
        "Research & Analytics Suite",
        "Executive Intelligence Suite",
        "Customer Success Manager",
        "Quarterly executive reviews"
      ],
      popular: false
    },
    {
      name: "Tier 4 – Enterprise National Ecosystem",
      price: "Starting at $5M",
      priceDetail: "USD per year",
      description: "Designed for large national deployments",
      badge: "Enterprise",
      badgeColor: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      icon: Award,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-950/30",
      features: [
        "Unlimited agencies",
        "Unlimited commercial licensees",
        "Unlimited patients",
        "Unlimited facilities",
        "National command center",
        "AI-ready analytics roadmap",
        "Custom integrations",
        "Dedicated implementation team",
        "24/7 enterprise support",
        "Multi-region disaster recovery"
      ],
      popular: false
    }
  ];

  const professionalServices = [
    { service: "Discovery & Business Analysis", price: "$100,000" },
    { service: "Platform Configuration", price: "$250,000 – $750,000" },
    { service: "Data Migration", price: "$75,000 – $500,000" },
    { service: "Third-Party Integrations", price: "$100,000 – $750,000" },
    { service: "User Training", price: "$50,000 – $250,000" },
    { service: "Go-Live Support", price: "Included" }
  ];

  return (
    <>
      <SEO
        title="Government Licensing Packages - Canna Blaze 360"
        description="National cannabis regulatory platform licensing for governments. Comprehensive seed-to-sale tracking, compliance management, and regulatory oversight solutions starting at $350,000 USD annually."
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-950 dark:via-blue-950/20 dark:to-emerald-950/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 text-base px-6 py-2 bg-white/20 text-white border-white/30">
                <Globe className="w-4 h-4 mr-2" />
                Government Solutions
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                National Cannabis Regulatory Platform
              </h1>
              <p className="text-xl md:text-2xl text-emerald-50 mb-8 leading-relaxed">
                Turnkey seed-to-sale tracking and compliance infrastructure for national and regional cannabis programs
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <FileText className="w-5 h-5 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">12+</div>
                <div className="text-gray-600 dark:text-gray-400">Countries Deployed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">50M+</div>
                <div className="text-gray-600 dark:text-gray-400">Transactions Tracked</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-400">System Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-600 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-400">Enterprise Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Licensing Tiers */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Government Licensing Packages</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the right solution for your national cannabis regulatory program
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={index}
                  className={`relative overflow-hidden ${
                    tier.popular 
                      ? "border-2 border-emerald-500 shadow-xl dark:border-emerald-600" 
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-semibold px-4 py-1 rounded-bl-lg">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${tier.iconBg}`}>
                        <Icon className={`w-7 h-7 ${tier.iconColor}`} />
                      </div>
                      <Badge className={tier.badgeColor}>
                        {tier.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                    <CardDescription className="text-base mb-4">{tier.description}</CardDescription>
                    <div className="mb-6">
                      <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                        {tier.price}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">{tier.priceDetail}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span className={feature.startsWith("Everything in") ? "font-semibold" : ""}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700" 
                          : ""
                      }`}
                      variant={tier.popular ? "default" : "outline"}
                    >
                      Request Proposal
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Professional Services */}
        <div className="bg-white dark:bg-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">One-Time Professional Services</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Implementation pricing depends on the size and complexity of the deployment
              </p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                          Service
                        </th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                          Illustrative Price (USD)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {professionalServices.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 text-gray-900 dark:text-white">
                            {item.service}
                          </td>
                          <td className={`px-6 py-4 text-right font-semibold ${
                            item.price === "Included" 
                              ? "text-emerald-600" 
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {item.price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-blue-900 dark:text-blue-100">
                    Custom Implementation Planning
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    Every national deployment is unique. Our implementation team will conduct a comprehensive 
                    discovery process to understand your regulatory framework, technical infrastructure, and 
                    operational requirements to provide accurate pricing and timelines.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Schedule Discovery Call
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Governments Choose Canna Blaze 360</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Proven platform trusted by regulatory agencies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <CardTitle>Full Regulatory Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Built-in compliance frameworks aligned with international standards including UN Single Convention, 
                  WHO guidelines, and regional regulatory requirements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Rapid Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Pre-configured regulatory modules enable deployment in 60-90 days. Proven implementation 
                  methodology reduces time-to-market and accelerates program launch.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>Scalable Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Cloud-native architecture scales from pilot programs to nationwide deployments. 
                  Handles millions of transactions with enterprise-grade security and reliability.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle>Multi-Stakeholder Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Unified platform serving regulators, licensees, patients, physicians, and pharmacies. 
                  Single source of truth eliminates data silos and improves coordination.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-xl flex items-center justify-center mb-4">
                  <HeadphonesIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Dedicated Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Customer Success Managers, 24/7 technical support, and quarterly executive reviews ensure 
                  your program operates smoothly and achieves regulatory objectives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>International Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">
                  Deployed across diverse regulatory environments from North America to Caribbean to Europe. 
                  Proven track record managing medical and adult-use programs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Launch Your National Cannabis Program?
            </h2>
            <p className="text-xl text-emerald-50 mb-8">
              Schedule a confidential consultation with our government solutions team to discuss 
              your regulatory objectives and receive a customized proposal.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Phone className="w-5 h-5 mr-2" />
                +1 (555) 123-4567
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Mail className="w-5 h-5 mr-2" />
                government&#64;cannablaze360.com
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>© 2026 Canna Blaze 360</span>
                <span>•</span>
                <Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link>
                <span>•</span>
                <Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/" className="hover:text-emerald-600">Platform Home</Link>
                <Link href="/government" className="hover:text-emerald-600">Government Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}