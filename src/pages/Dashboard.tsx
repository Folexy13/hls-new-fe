
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import { ShoppingCart, Eye, EyeOff } from 'lucide-react';

const Dashboard = () => {
  const { addToCart } = useStore();
  const [revealedSupplements, setRevealedSupplements] = useState<{[key: string]: boolean}>({});

  const nutrientTypes = [
    {
      id: 'vitamins',
      name: 'Vitamins',
      progress: 75,
      supplements: [
        { id: '1', name: 'Vitamin D3', price: 25.99, description: 'Supports bone health and immune function', image: '', category: 'vitamin' as const },
        { id: '2', name: 'Vitamin B12', price: 19.99, description: 'Essential for energy metabolism', image: '', category: 'vitamin' as const },
        { id: '3', name: 'Vitamin C', price: 15.99, description: 'Powerful antioxidant support', image: '', category: 'vitamin' as const }
      ]
    },
    {
      id: 'minerals',
      name: 'Minerals',
      progress: 60,
      supplements: [
        { id: '4', name: 'Magnesium', price: 22.99, description: 'Supports muscle and nerve function', image: '', category: 'mineral' as const },
        { id: '5', name: 'Zinc', price: 18.99, description: 'Immune system support', image: '', category: 'mineral' as const },
        { id: '6', name: 'Iron', price: 24.99, description: 'Essential for blood health', image: '', category: 'mineral' as const }
      ]
    },
    {
      id: 'proteins',
      name: 'Proteins',
      progress: 85,
      supplements: [
        { id: '7', name: 'Whey Protein', price: 45.99, description: 'High-quality complete protein', image: '', category: 'protein' as const },
        { id: '8', name: 'Plant Protein', price: 39.99, description: 'Vegan-friendly protein blend', image: '', category: 'protein' as const },
        { id: '9', name: 'Collagen', price: 35.99, description: 'Supports skin and joint health', image: '', category: 'protein' as const }
      ]
    },
    {
      id: 'omega',
      name: 'Omega Fatty Acids',
      progress: 40,
      supplements: [
        { id: '10', name: 'Omega-3 Fish Oil', price: 28.99, description: 'Heart and brain health support', image: '', category: 'supplement' as const },
        { id: '11', name: 'Algae Omega-3', price: 32.99, description: 'Vegan omega-3 alternative', image: '', category: 'supplement' as const },
        { id: '12', name: 'Krill Oil', price: 42.99, description: 'Premium omega-3 source', image: '', category: 'supplement' as const }
      ]
    }
  ];

  const toggleReveal = (nutrientTypeId: string) => {
    setRevealedSupplements(prev => ({
      ...prev,
      [nutrientTypeId]: !prev[nutrientTypeId]
    }));
  };

  const handleAddToCart = (supplement: any) => {
    addToCart(supplement);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Dashboard</h1>
          <p className="text-gray-600">Track your personalized nutrition and supplement recommendations</p>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overall Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">68%</div>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Supplements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <p className="text-sm text-gray-600 mt-1">Currently taking</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Health Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">B+</div>
              <p className="text-sm text-gray-600 mt-1">Good progress</p>
            </CardContent>
          </Card>
        </div>

        {/* Nutrient Type Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Personalized Supplement Recommendations</CardTitle>
            <CardDescription>Based on your health assessment and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="vitamins" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {nutrientTypes.map((type) => (
                  <TabsTrigger key={type.id} value={type.id} className="text-xs sm:text-sm">
                    {type.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {nutrientTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="mt-6">
                  <div className="space-y-6">
                    {/* Progress Section */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{type.name} Intake Progress</h3>
                        <Badge variant={type.progress > 70 ? "default" : "secondary"}>
                          {type.progress}%
                        </Badge>
                      </div>
                      <Progress value={type.progress} className="mb-2" />
                      <p className="text-sm text-gray-600">
                        You're meeting {type.progress}% of your recommended {type.name.toLowerCase()} intake
                      </p>
                    </div>

                    {/* Supplements Section */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">Recommended Supplements</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleReveal(type.id)}
                          className="flex items-center gap-2"
                        >
                          {revealedSupplements[type.id] ? (
                            <>
                              <EyeOff className="h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4" />
                              Reveal
                            </>
                          )}
                        </Button>
                      </div>

                      {revealedSupplements[type.id] ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {type.supplements.map((supplement) => (
                            <Card key={supplement.id} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{supplement.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {supplement.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between">
                                  <span className="text-xl font-bold text-emerald-600">
                                    ${supplement.price}
                                  </span>
                                  <Button
                                    size="sm"
                                    onClick={() => handleAddToCart(supplement)}
                                    className="flex items-center gap-2"
                                  >
                                    <ShoppingCart className="h-4 w-4" />
                                    Add to Cart
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-emerald-100 to-blue-100 p-8 rounded-lg text-center">
                          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                              Your Personalized {type.name} Recommendations
                            </h4>
                            <p className="text-gray-600 mb-4">
                              Click "Reveal" to see supplements tailored specifically for your health goals
                            </p>
                            <Button onClick={() => toggleReveal(type.id)}>
                              Show My Recommendations
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
