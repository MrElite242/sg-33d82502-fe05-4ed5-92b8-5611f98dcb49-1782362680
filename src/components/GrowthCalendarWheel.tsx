import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar,
  Sprout, 
  Sun, 
  Cloud,
  Droplets,
  Wind,
  Snowflake,
  Flower as FlowerIcon,
  Flower2,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Clock,
  Thermometer,
  Home,
  TreePine,
  Moon,
  CheckCircle2
} from "lucide-react";

interface StrainData {
  name: string;
  type: "Indica" | "Sativa" | "Hybrid";
  floweringTime: number; // weeks
  harvestMonth: string;
  idealTemp: { min: number; max: number };
  indoorRecommended: boolean;
  outdoorRecommended: boolean;
  difficulty: "Easy" | "Moderate" | "Advanced";
  yieldPotential: "Low" | "Medium" | "High";
}

const STRAIN_DATABASE: StrainData[] = [
  {
    name: "Northern Lights",
    type: "Indica",
    floweringTime: 8,
    harvestMonth: "October",
    idealTemp: { min: 65, max: 80 },
    indoorRecommended: true,
    outdoorRecommended: true,
    difficulty: "Easy",
    yieldPotential: "High"
  },
  {
    name: "Sour Diesel",
    type: "Sativa",
    floweringTime: 10,
    harvestMonth: "November",
    idealTemp: { min: 70, max: 85 },
    indoorRecommended: true,
    outdoorRecommended: false,
    difficulty: "Moderate",
    yieldPotential: "Medium"
  },
  {
    name: "Blue Dream",
    type: "Hybrid",
    floweringTime: 9,
    harvestMonth: "October",
    idealTemp: { min: 68, max: 82 },
    indoorRecommended: true,
    outdoorRecommended: true,
    difficulty: "Easy",
    yieldPotential: "High"
  },
  {
    name: "Girl Scout Cookies",
    type: "Hybrid",
    floweringTime: 9,
    harvestMonth: "October",
    idealTemp: { min: 68, max: 78 },
    indoorRecommended: true,
    outdoorRecommended: true,
    difficulty: "Moderate",
    yieldPotential: "Medium"
  },
  {
    name: "OG Kush",
    type: "Hybrid",
    floweringTime: 8,
    harvestMonth: "September",
    idealTemp: { min: 65, max: 80 },
    indoorRecommended: true,
    outdoorRecommended: true,
    difficulty: "Advanced",
    yieldPotential: "High"
  }
];

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SEASONAL_DATA = {
  indoor: {
    "Winter": { plantable: ["Northern Lights", "OG Kush", "Blue Dream"], conditions: "Controlled environment optimal" },
    "Spring": { plantable: ["All Strains"], conditions: "Perfect for starting new cycles" },
    "Summer": { plantable: ["Sativa strains recommended"], conditions: "High light intensity beneficial" },
    "Fall": { plantable: ["All Strains"], conditions: "Consistent year-round production" }
  },
  outdoor: {
    "Winter": { plantable: [], conditions: "Not recommended in most climates" },
    "Spring": { plantable: ["Blue Dream", "Girl Scout Cookies"], conditions: "Start seeds in late April/early May" },
    "Summer": { plantable: ["Northern Lights", "OG Kush"], conditions: "Vegetative growth peak" },
    "Fall": { plantable: ["Harvest Season"], conditions: "September-November harvest window" }
  }
};

export function GrowthCalendarWheel() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [growMode, setGrowMode] = useState<"indoor" | "outdoor">("indoor");
  const [selectedRegion, setSelectedRegion] = useState<"north-america" | "europe" | "asia-pacific" | "south-america" | "africa-middle-east" | "caribbean-tropics">("north-america");
  const [selectedStrain, setSelectedStrain] = useState<StrainData>(STRAIN_DATABASE[0]);

  // Wheel rotation state
  const [rotation, setRotation] = useState(0);

  const regions = [
    { value: "north-america", label: "North America", timezone: "EST/PST" },
    { value: "europe", label: "Europe", timezone: "CET/GMT" },
    { value: "asia-pacific", label: "Asia-Pacific", timezone: "JST/AEST" },
    { value: "south-america", label: "South America", timezone: "BRT/ART" },
    { value: "africa-middle-east", label: "Africa & Middle East", timezone: "EAT/GST" },
    { value: "caribbean-tropics", label: "Caribbean / Tropics", timezone: "AST/EST" }
  ];

  // Regional climate considerations
  const regionalClimate = {
    "north-america": {
      spring: { temp: "50-70°F", humidity: "40-60%", light: "12-14hrs" },
      summer: { temp: "70-85°F", humidity: "50-70%", light: "14-16hrs" },
      fall: { temp: "55-70°F", humidity: "45-65%", light: "10-12hrs" },
      winter: { temp: "40-60°F", humidity: "35-55%", light: "8-10hrs" }
    },
    "europe": {
      spring: { temp: "45-65°F", humidity: "50-70%", light: "12-14hrs" },
      summer: { temp: "65-80°F", humidity: "55-75%", light: "14-16hrs" },
      fall: { temp: "50-65°F", humidity: "60-80%", light: "10-12hrs" },
      winter: { temp: "35-50°F", humidity: "70-85%", light: "8-10hrs" }
    },
    "asia-pacific": {
      spring: { temp: "60-75°F", humidity: "60-80%", light: "11-13hrs" },
      summer: { temp: "75-90°F", humidity: "70-90%", light: "13-15hrs" },
      fall: { temp: "65-80°F", humidity: "65-85%", light: "11-13hrs" },
      winter: { temp: "50-70°F", humidity: "55-75%", light: "10-12hrs" }
    },
    "south-america": {
      spring: { temp: "65-80°F", humidity: "60-80%", light: "11-13hrs" },
      summer: { temp: "75-90°F", humidity: "70-90%", light: "13-15hrs" },
      fall: { temp: "60-75°F", humidity: "65-85%", light: "11-13hrs" },
      winter: { temp: "55-70°F", humidity: "50-70%", light: "10-12hrs" }
    },
    "africa-middle-east": {
      spring: { temp: "70-85°F", humidity: "30-50%", light: "12-14hrs" },
      summer: { temp: "80-100°F", humidity: "20-40%", light: "13-15hrs" },
      fall: { temp: "65-80°F", humidity: "35-55%", light: "11-13hrs" },
      winter: { temp: "55-75°F", humidity: "40-60%", light: "10-12hrs" }
    },
    "caribbean-tropics": {
      spring: { temp: "75-85°F", humidity: "70-85%", light: "12-13hrs" },
      summer: { temp: "80-90°F", humidity: "75-90%", light: "12-14hrs" },
      fall: { temp: "75-85°F", humidity: "75-90%", light: "12-13hrs" },
      winter: { temp: "70-80°F", humidity: "65-80%", light: "11-12hrs" }
    }
  };

  const getCurrentSeason = (monthIndex: number) => {
    // Adjust seasons for Southern Hemisphere
    const isNorthernHemisphere = ["north-america", "europe", "asia-pacific", "africa-middle-east"].includes(selectedRegion);
    
    if (isNorthernHemisphere) {
      if (monthIndex >= 2 && monthIndex <= 4) return "spring";
      if (monthIndex >= 5 && monthIndex <= 7) return "summer";
      if (monthIndex >= 8 && monthIndex <= 10) return "fall";
      return "winter";
    } else {
      // Southern Hemisphere seasons are reversed
      if (monthIndex >= 2 && monthIndex <= 4) return "fall";
      if (monthIndex >= 5 && monthIndex <= 7) return "winter";
      if (monthIndex >= 8 && monthIndex <= 10) return "spring";
      return "summer";
    }
  };

  const getSeasonalInfo = (monthIndex: number) => {
    const season = getCurrentSeason(monthIndex);
    const seasonKey = season.charAt(0).toUpperCase() + season.slice(1);
    return SEASONAL_DATA[growMode][seasonKey] || { plantable: [], conditions: "N/A" };
  };

  const season = getCurrentSeason(selectedMonth);
  const climate = regionalClimate[selectedRegion][season];
  const seasonalInfo = getSeasonalInfo(selectedMonth);

  const getRecommendedStrains = () => {
    return STRAIN_DATABASE.filter(strain => 
      growMode === "indoor" ? strain.indoorRecommended : strain.outdoorRecommended
    );
  };

  const calculatePlantingDate = (harvestMonth: string, floweringWeeks: number) => {
    const harvestMonthIndex = MONTHS.indexOf(harvestMonth);
    const plantingMonthIndex = (harvestMonthIndex - Math.ceil(floweringWeeks / 4) + 12) % 12;
    return MONTHS[plantingMonthIndex];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Smart Growth Calendar Wheel
              </CardTitle>
              <CardDescription>
                AI-powered planting schedule optimization based on strain characteristics and growing conditions
              </CardDescription>
            </div>
            
            {/* Indoor/Outdoor Toggle */}
            <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Moon className={`w-4 h-4 ${growMode === "indoor" ? "text-purple-600" : "text-gray-400"}`} />
                <Label htmlFor="growing-mode" className="text-sm font-medium">
                  {growMode === "indoor" ? "Indoor" : "Outdoor"}
                </Label>
              </div>
              <Switch
                id="growing-mode"
                checked={growMode === "outdoor"}
                onCheckedChange={(checked) => setGrowMode(checked ? "outdoor" : "indoor")}
              />
              <Sun className={`w-4 h-4 ${growMode === "outdoor" ? "text-orange-500" : "text-gray-400"}`} />
            </div>
          </div>

          {/* Region Selector */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Growing Region</Label>
            <Select value={selectedRegion} onValueChange={(value: any) => setSelectedRegion(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label} ({region.timezone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              Climate recommendations will adjust based on your region
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
            <TabsList className="grid grid-cols-6 lg:grid-cols-12 gap-2 h-auto bg-transparent">
              {MONTHS.map((month, index) => (
                <TabsTrigger
                  key={month}
                  value={index.toString()}
                  className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                >
                  {month.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {MONTHS.map((month, index) => (
              <TabsContent key={month} value={index.toString()} className="mt-6 space-y-6">
                {/* Season Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-lg py-2 px-4">
                    {getCurrentSeason(MONTHS.indexOf(month))} - {growMode === "indoor" ? "🏠 Indoor" : "🌞 Outdoor"} Growing
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Thermometer className="w-4 h-4" />
                    {selectedStrain.idealTemp.min}°F - {selectedStrain.idealTemp.max}°F
                  </div>
                </div>

                {/* Seasonal Conditions */}
                <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {season === "spring" && <Flower2 className="w-6 h-6 text-pink-600 flex-shrink-0" />}
                      {season === "summer" && <Sun className="w-6 h-6 text-orange-500 flex-shrink-0" />}
                      {season === "fall" && <Wind className="w-6 h-6 text-amber-600 flex-shrink-0" />}
                      {season === "winter" && <Snowflake className="w-6 h-6 text-blue-500 flex-shrink-0" />}
                      <div>
                        <h3 className="font-semibold mb-1">{season} Conditions ({growMode})</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{getSeasonalInfo(index).conditions}</p>
                        {getSeasonalInfo(index).plantable.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {getSeasonalInfo(index).plantable.map((strain, idx) => (
                              <Badge key={idx} variant="outline" className="bg-white dark:bg-gray-800">
                                {strain}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Strains */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-600" />
                    Recommended Strains for {growMode} in {month}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getRecommendedStrains().map((strain) => (
                      <Card
                        key={strain.name}
                        className={`cursor-pointer transition-all ${
                          selectedStrain.name === strain.name
                            ? "ring-2 ring-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setSelectedStrain(strain)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{strain.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{strain.type}</p>
                            </div>
                            {selectedStrain.name === strain.name && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Flowering:</span>
                              <p className="font-medium">{strain.floweringTime} weeks</p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Harvest:</span>
                              <p className="font-medium">{strain.harvestMonth}</p>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                              <Badge
                                variant="outline"
                                className={
                                  strain.difficulty === "Easy"
                                    ? "bg-green-100 text-green-800"
                                    : strain.difficulty === "Moderate"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {strain.difficulty}
                              </Badge>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Yield:</span>
                              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                                {strain.yieldPotential}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Planting Timeline */}
                <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Planting Timeline for {selectedStrain.name}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                          <Sprout className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Best Planting Month</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {calculatePlantingDate(selectedStrain.harvestMonth, selectedStrain.floweringTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                          <Flower2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Flowering Duration</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedStrain.floweringTime} weeks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium">Expected Harvest</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedStrain.harvestMonth}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Environmental Alerts */}
                {growMode === "outdoor" && (season === "winter" || season === "fall") && (
                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-semibold mb-1">Weather Advisory</h3>
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            {season === "winter"
                              ? "Outdoor growing not recommended during winter months. Consider indoor cultivation for year-round production."
                              : "Monitor frost dates closely. Most strains should be harvested before first frost in your region."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}