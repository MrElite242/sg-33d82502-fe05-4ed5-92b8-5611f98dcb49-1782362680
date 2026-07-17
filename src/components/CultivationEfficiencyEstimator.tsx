import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp,
  DollarSign,
  Sprout,
  Droplets,
  Zap,
  Scale,
  Clock,
  Target,
  AlertCircle,
  CheckCircle2,
  BarChart3
} from "lucide-react";

interface EfficiencyMetrics {
  expectedYield: number; // grams
  costPerGram: number;
  energyCost: number;
  waterUsage: number; // gallons
  laborHours: number;
  profitMargin: number;
  breakEvenPrice: number;
  roi: number; // percentage
}

export function CultivationEfficiencyEstimator() {
  const [formData, setFormData] = useState({
    growSpace: "100", // sq ft
    plantCount: "20",
    strainType: "hybrid",
    lightType: "led",
    lightWattage: "1000",
    electricityRate: "0.12", // per kWh
    growCycle: "12", // weeks
    nutrientCost: "500",
    laborCostPerHour: "25",
    expectedPrice: "8", // per gram
  });

  const [showResults, setShowResults] = useState(false);

  const calculateEfficiency = (): EfficiencyMetrics => {
    const space = parseFloat(formData.growSpace);
    const plants = parseInt(formData.plantCount);
    const wattage = parseInt(formData.lightWattage);
    const rate = parseFloat(formData.electricityRate);
    const weeks = parseInt(formData.growCycle);
    const nutrients = parseFloat(formData.nutrientCost);
    const laborRate = parseFloat(formData.laborCostPerHour);
    const pricePerGram = parseFloat(formData.expectedPrice);

    // Yield calculations based on strain type and growing conditions
    const yieldPerPlant = formData.strainType === "indica" ? 85 : formData.strainType === "sativa" ? 75 : 80; // grams
    const lightEfficiency = formData.lightType === "led" ? 1.2 : formData.lightType === "hps" ? 1.0 : 0.8;
    const expectedYield = plants * yieldPerPlant * lightEfficiency;

    // Cost calculations
    const hoursPerDay = 18; // vegetative + flowering average
    const daysPerWeek = 7;
    const totalHours = weeks * daysPerWeek * hoursPerDay;
    const energyCost = (wattage / 1000) * totalHours * rate;

    // Water usage (estimated 1 gallon per plant per week)
    const waterUsage = plants * weeks * 1;

    // Labor hours (estimated 2 hours per week for 20 plants)
    const laborHours = weeks * 2;
    const laborCost = laborHours * laborRate;

    // Total costs
    const totalCost = energyCost + nutrients + laborCost;
    const costPerGram = totalCost / expectedYield;

    // Revenue and profit
    const totalRevenue = expectedYield * pricePerGram;
    const profit = totalRevenue - totalCost;
    const profitMargin = (profit / totalRevenue) * 100;
    const breakEvenPrice = totalCost / expectedYield;
    const roi = (profit / totalCost) * 100;

    return {
      expectedYield,
      costPerGram,
      energyCost,
      waterUsage,
      laborHours,
      profitMargin,
      breakEvenPrice,
      roi,
    };
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const metrics = showResults ? calculateEfficiency() : null;

  const getEfficiencyRating = (roi: number): { label: string; color: string } => {
    if (roi >= 150) return { label: "Excellent", color: "text-green-600" };
    if (roi >= 100) return { label: "Good", color: "text-emerald-600" };
    if (roi >= 50) return { label: "Fair", color: "text-yellow-600" };
    return { label: "Needs Improvement", color: "text-orange-600" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Cultivation Efficiency Estimator
        </CardTitle>
        <CardDescription>
          Calculate expected yields, costs, and profitability for your cultivation operation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Growing Space */}
          <div className="space-y-2">
            <Label htmlFor="growSpace">Growing Space (sq ft)</Label>
            <Input
              id="growSpace"
              type="number"
              value={formData.growSpace}
              onChange={(e) => setFormData({ ...formData, growSpace: e.target.value })}
              placeholder="100"
            />
          </div>

          {/* Plant Count */}
          <div className="space-y-2">
            <Label htmlFor="plantCount">Number of Plants</Label>
            <Input
              id="plantCount"
              type="number"
              value={formData.plantCount}
              onChange={(e) => setFormData({ ...formData, plantCount: e.target.value })}
              placeholder="20"
            />
          </div>

          {/* Strain Type */}
          <div className="space-y-2">
            <Label htmlFor="strainType">Strain Type</Label>
            <Select value={formData.strainType} onValueChange={(value) => setFormData({ ...formData, strainType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="indica">Indica (Higher yield)</SelectItem>
                <SelectItem value="hybrid">Hybrid (Balanced)</SelectItem>
                <SelectItem value="sativa">Sativa (Lower yield, higher quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Light Type */}
          <div className="space-y-2">
            <Label htmlFor="lightType">Lighting System</Label>
            <Select value={formData.lightType} onValueChange={(value) => setFormData({ ...formData, lightType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED (Most efficient)</SelectItem>
                <SelectItem value="hps">HPS (High pressure sodium)</SelectItem>
                <SelectItem value="mh">MH (Metal halide)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Light Wattage */}
          <div className="space-y-2">
            <Label htmlFor="lightWattage">Total Light Wattage (W)</Label>
            <Input
              id="lightWattage"
              type="number"
              value={formData.lightWattage}
              onChange={(e) => setFormData({ ...formData, lightWattage: e.target.value })}
              placeholder="1000"
            />
          </div>

          {/* Electricity Rate */}
          <div className="space-y-2">
            <Label htmlFor="electricityRate">Electricity Rate ($/kWh)</Label>
            <Input
              id="electricityRate"
              type="number"
              step="0.01"
              value={formData.electricityRate}
              onChange={(e) => setFormData({ ...formData, electricityRate: e.target.value })}
              placeholder="0.12"
            />
          </div>

          {/* Grow Cycle */}
          <div className="space-y-2">
            <Label htmlFor="growCycle">Grow Cycle Duration (weeks)</Label>
            <Input
              id="growCycle"
              type="number"
              value={formData.growCycle}
              onChange={(e) => setFormData({ ...formData, growCycle: e.target.value })}
              placeholder="12"
            />
          </div>

          {/* Nutrient Cost */}
          <div className="space-y-2">
            <Label htmlFor="nutrientCost">Total Nutrient Cost ($)</Label>
            <Input
              id="nutrientCost"
              type="number"
              value={formData.nutrientCost}
              onChange={(e) => setFormData({ ...formData, nutrientCost: e.target.value })}
              placeholder="500"
            />
          </div>

          {/* Labor Cost */}
          <div className="space-y-2">
            <Label htmlFor="laborCostPerHour">Labor Cost ($/hour)</Label>
            <Input
              id="laborCostPerHour"
              type="number"
              value={formData.laborCostPerHour}
              onChange={(e) => setFormData({ ...formData, laborCostPerHour: e.target.value })}
              placeholder="25"
            />
          </div>

          {/* Expected Price */}
          <div className="space-y-2">
            <Label htmlFor="expectedPrice">Expected Sale Price ($/gram)</Label>
            <Input
              id="expectedPrice"
              type="number"
              step="0.01"
              value={formData.expectedPrice}
              onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
              placeholder="8.00"
            />
          </div>
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-emerald-600 to-green-600"
        >
          <Target className="w-4 h-4 mr-2" />
          Calculate Efficiency Metrics
        </Button>

        {/* Results Section */}
        {showResults && metrics && (
          <div className="space-y-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Efficiency Analysis</h3>
              <Badge className={`${getEfficiencyRating(metrics.roi).color} text-lg py-2 px-4`}>
                {getEfficiencyRating(metrics.roi).label}
              </Badge>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-emerald-200 dark:border-emerald-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center">
                      <Scale className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expected Yield</p>
                      <p className="text-2xl font-bold">{metrics.expectedYield.toFixed(0)}g</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    ~{(metrics.expectedYield / 28.35).toFixed(1)} oz
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Cost per Gram</p>
                      <p className="text-2xl font-bold">${metrics.costPerGram.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Break-even: ${metrics.breakEvenPrice.toFixed(2)}/g
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Profit Margin</p>
                      <p className="text-2xl font-bold">{metrics.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    ROI: {metrics.roi.toFixed(0)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-orange-200 dark:border-orange-800">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center">
                      <Zap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Energy Cost</p>
                      <p className="text-2xl font-bold">${metrics.energyCost.toFixed(0)}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Per cycle
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card className="bg-gray-50 dark:bg-gray-900">
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-semibold mb-4">Detailed Resource Analysis</h4>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Energy Usage</p>
                      <p className="font-semibold">${metrics.energyCost.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Water Usage</p>
                      <p className="font-semibold">{metrics.waterUsage.toFixed(0)} gallons</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Labor Hours</p>
                      <p className="font-semibold">{metrics.laborHours} hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimization Tips */}
            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-2">Optimization Recommendations</h4>
                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      {metrics.roi < 100 && (
                        <li>• Consider switching to LED lighting to reduce energy costs by up to 40%</li>
                      )}
                      {metrics.profitMargin < 50 && (
                        <li>• Explore bulk nutrient purchasing to reduce per-cycle costs</li>
                      )}
                      <li>• Automate irrigation and climate control to reduce labor hours</li>
                      <li>• Implement perpetual harvest cycle for continuous revenue stream</li>
                      {formData.lightType !== "led" && (
                        <li>• LED upgrade ROI: ~6-12 months through energy savings</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}