import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Shield,
  Package,
  Sprout,
  Settings,
  DollarSign,
  Users,
  Database,
  Sparkles,
  Download,
  Calendar,
  Target,
  Zap
} from "lucide-react";

interface ScoreCategory {
  name: string;
  score: number;
  weight: number;
  trend: "up" | "down" | "stable";
  status: "excellent" | "good" | "warning" | "critical";
  icon: any;
  color: string;
}

interface EcosystemHealthIndexProps {
  planTier: "professional" | "enterprise";
}

export function EcosystemHealthIndex({ planTier = "professional" }: EcosystemHealthIndexProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">("30d");

  // Calculate weighted scores
  const categories: ScoreCategory[] = [
    {
      name: "Compliance",
      score: 96,
      weight: 25,
      trend: "up",
      status: "excellent",
      icon: Shield,
      color: "emerald",
    },
    {
      name: "Inventory Accuracy",
      score: 92,
      weight: 20,
      trend: "stable",
      status: "excellent",
      icon: Package,
      color: "blue",
    },
    {
      name: "Cultivation Efficiency",
      score: 84,
      weight: 20,
      trend: "down",
      status: "good",
      icon: Sprout,
      color: "amber",
    },
    {
      name: "Operational Performance",
      score: 94,
      weight: 15,
      trend: "up",
      status: "excellent",
      icon: Settings,
      color: "purple",
    },
    {
      name: "Financial Performance",
      score: 89,
      weight: 10,
      trend: "up",
      status: "good",
      icon: DollarSign,
      color: "green",
    },
    {
      name: "Training & User Adoption",
      score: 87,
      weight: 5,
      trend: "stable",
      status: "good",
      icon: Users,
      color: "indigo",
    },
    {
      name: "Data Quality",
      score: 91,
      weight: 5,
      trend: "up",
      status: "excellent",
      icon: Database,
      color: "cyan",
    },
  ];

  const overallScore = Math.round(
    categories.reduce((acc, cat) => acc + (cat.score * cat.weight) / 100, 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 70) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
      good: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
      warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
      critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    };
    return variants[status as keyof typeof variants];
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <span className="text-gray-400">—</span>;
  };

  const actionRecommendations = [
    {
      priority: "high",
      category: "Cultivation Efficiency",
      action: "Optimize lighting schedule to reduce energy costs by 12%",
      impact: "$2,400/month savings",
    },
    {
      priority: "medium",
      category: "Training & User Adoption",
      action: "Schedule quarterly compliance training for 3 new staff members",
      impact: "Reduce compliance risk",
    },
    {
      priority: "low",
      category: "Data Quality",
      action: "Review and update 12 product SKUs with missing cultivation data",
      impact: "Improve reporting accuracy",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold">Ecosystem Health Index™</h2>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <Sparkles className="w-3 h-3 mr-1" />
              {planTier === "enterprise" ? "Pro" : "Standard"}
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive business health monitoring across 7 key performance areas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Last 30 Days
          </Button>
          {planTier === "enterprise" && (
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          )}
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/30 dark:via-gray-900 dark:to-blue-950/30 border-2 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600">{overallScore}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">/ 100</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2">
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Overall Business Health</h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
                  Your business is performing exceptionally well
                </p>
                <div className="flex gap-2">
                  <Badge className={getStatusBadge("excellent")}>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Excellent Health
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +3 pts this month
                  </Badge>
                </div>
              </div>
            </div>
            {planTier === "enterprise" && (
              <div className="text-right space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">Industry Benchmark</div>
                <div className="text-3xl font-bold text-blue-600">Top 10%</div>
                <p className="text-xs text-gray-500">Nationwide ranking</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Category Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance Breakdown</CardTitle>
          <CardDescription>
            Weighted scoring across 7 operational dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-${category.color}-100 dark:bg-${category.color}-950/30 rounded-lg flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${category.color}-600`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{category.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {category.weight}% weight
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className={getScoreColor(category.score)}>
                            Score: {category.score}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            Trend: {getTrendIcon(category.trend)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusBadge(category.status)}>
                      {category.status}
                    </Badge>
                  </div>
                  <Progress value={category.score} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Features */}
      {planTier === "enterprise" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Predictive Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Predictive Risk Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                      <span className="font-semibold text-sm">Compliance Risk</span>
                    </div>
                    <Badge variant="outline" className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                      Medium Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    3 cultivation licenses expire in 45 days across Denver locations
                  </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-semibold text-sm">Inventory Forecast</span>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300">
                      Low Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Inventory levels optimal for next 90 days based on demand patterns
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-purple-600" />
                    <span className="font-semibold text-sm">Revenue Opportunity</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Increasing Blue Dream inventory by 15% could generate +$12K monthly revenue based on demand trends
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    View Analysis
                  </Button>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-sm">Efficiency Gain</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Adjusting harvest schedules could reduce labor costs by 8% ($3.2K/month)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            Action Recommendations
          </CardTitle>
          <CardDescription>
            Prioritized actions to improve your Ecosystem Health Index™
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionRecommendations.map((rec, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={
                        rec.priority === "high"
                          ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          : rec.priority === "medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      }
                    >
                      {rec.priority} priority
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.category}
                    </span>
                  </div>
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                </div>
                <p className="font-medium mb-1">{rec.action}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Impact: {rec.impact}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Score Weighting Explanation */}
      <Card>
        <CardHeader>
          <CardTitle>How Your Score Is Calculated</CardTitle>
          <CardDescription>
            Transparent weighted scoring methodology
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Category Weights</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                    <span className="font-semibold">{cat.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Scoring Benchmarks</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 bg-emerald-500 rounded"></div>
                  <span className="text-sm">90-100: Excellent</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 bg-green-500 rounded"></div>
                  <span className="text-sm">80-89: Good</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 bg-amber-500 rounded"></div>
                  <span className="text-sm">70-79: Needs Attention</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-4 bg-red-500 rounded"></div>
                  <span className="text-sm">Below 70: Critical</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA for Professional Users */}
      {planTier === "professional" && (
        <Card className="bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="pt-8 pb-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6" />
                  <h3 className="text-2xl font-bold">Upgrade to Ecosystem Health Index™ Pro</h3>
                </div>
                <p className="text-white/90 mb-4 max-w-2xl">
                  Get executive scorecards, multi-location benchmarking, predictive risk alerts, 
                  AI-powered insights, and board-ready reports with Enterprise.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Executive KPI Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Predictive Risk Alerts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">Multi-Location Benchmarking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm">AI-Powered Operational Insights</span>
                  </li>
                </ul>
              </div>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                Upgrade to Enterprise
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}