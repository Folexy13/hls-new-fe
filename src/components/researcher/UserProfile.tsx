import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { dummyUser } from "@/lib/researcher/dummyData";
import { budgetRangeOptions } from "@/lib/researcher/taxonomy";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { researcherService } from "@/services/researcherService";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UserProfileProps {
  onUserVerified?: (verified: boolean, data: any) => void;
  benfekData?: any;
}

export function UserProfile({ onUserVerified, benfekData }: UserProfileProps) {
  const [benefekCode, setBenefekCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const formatValue = (value: unknown, fallback = "Not specified") => {
    if (value === null || value === undefined) return fallback;
    const text = String(value).trim();
    return text ? text : fallback;
  };

  const parseRangeString = (range?: string | null) => {
    if (!range) return null;
    const matches = range.match(/\d+/g);
    if (!matches || matches.length < 2) return null;
    const [minValue, maxValue] = matches.map(Number);
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return null;
    return { min: minValue, max: maxValue };
  };

  const inferBudgetRangeFromMax = (maxBudget?: number | null) => {
    if (!Number.isFinite(Number(maxBudget)) || Number(maxBudget) <= 0) return null;
    const numericMax = Number(maxBudget);
    return budgetRangeOptions.find((option) => {
      const matches = option.match(/\d+/g);
      if (!matches || matches.length < 2) return false;
      const optionMax = Number(matches[matches.length - 1]);
      return optionMax === numericMax;
    }) || null;
  };

  const userDetails = benfekData ? {
    ...benfekData,
    displayName: benfekData.fullName || benfekData.name || "Unnamed Benefek",
    phone: benfekData.phone || "",
    family: benfekData.principal ? `${benfekData.principal.firstName} ${benfekData.principal.lastName}` : "Not specified",
    health: {
      ...benfekData.health,
      scares: benfekData.health?.scares,
    },
    budget: (() => {
      const rangeString = benfekData.quiz?.preferences?.budgetRange?.trim();
      const chosenRange = rangeString || inferBudgetRangeFromMax(Number(benfekData.quiz?.preferences?.budget));
      return parseRangeString(chosenRange) ||
        (benfekData.quiz?.preferences?.budget
          ? { min: 0, max: Number(benfekData.quiz.preferences.budget) || 0 }
          : dummyUser.budget);
    })(),
    budgetRange: benfekData.quiz?.preferences?.budgetRange?.trim() || inferBudgetRangeFromMax(Number(benfekData.quiz?.preferences?.budget)),
  } : null;

  const { toast } = useToast();

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const data = await researcherService.verifyBenfekCode(benefekCode);

      if (data?.benfek) {
        // Clear previous session data to ensure fresh fetch from backend
        localStorage.removeItem(`researcher.sheet.supplements.${data.benfek.code}`);
        localStorage.removeItem("researcher.gallery.supplements");

        sessionStorage.setItem("researcherVerifiedBenfekCode", data.benfek.code);
        sessionStorage.setItem("researcherVerifiedBenfek", JSON.stringify(data.benfek));
        window.dispatchEvent(new Event("researcher-benfek-verified"));

        // Fetch existing packs for this user from the backend to ensure local state is synced on load/refresh.
        try {
          const packsData = await researcherService.getBenfekPacks(data.benfek.code);
          if (packsData && Array.isArray(packsData)) {
            const mappedPacks: Record<string, any[]> = {};
            packsData.forEach((p: any) => {
              mappedPacks[p.packId] = (p.items || []).map((i: any) => ({
                ...i.supplement,
                id: String(i.supplement.id)
              }));
            });
            localStorage.setItem(
              `researcher.pack.supplements.${data.benfek.code}`,
              JSON.stringify(mappedPacks)
            );
            // Notify other components (like TabsContainer or SupplementsSelector) that packs are updated
            window.dispatchEvent(new Event("researcher-pack-updated"));
          }
        } catch (e) {
          console.error("Failed to sync researcher packs from backend:", e);
        }

        toast({
          title: "Code verified",
          description: "User details retrieved successfully.",
        });

        if (onUserVerified) {
          onUserVerified(true, data.benfek); // Pass the full benfek object
        }
      } else {
        toast({
          title: "Invalid code",
          description: "The benefek code you entered is invalid.",
          variant: "destructive",
        });

        if (onUserVerified) onUserVerified(false, null);
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      toast({
        title: "Error",
        description: "Something went wrong while verifying the code.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-2 sm:p-4">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-researcher-primary">User Profile</h2>
        <p className="text-muted-foreground">Enter your benefek code to view your details</p>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Benefek Code Verification</CardTitle>
            <CardDescription>
              Please enter your benefek code to access your profile information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="benefek-code">Benefek Code</Label>
                <div className="flex space-x-2">
                  <Input
                    id="benefek-code"
                    value={benefekCode}
                    onChange={(e) => setBenefekCode(e.target.value)}
                    placeholder="Enter code (hint: 12345)"
                    disabled={isVerifying}
                  />
                  <Button
                    onClick={handleVerifyCode}
                    disabled={isVerifying || !benefekCode}
                    className="bg-researcher-primary hover:bg-researcher-secondary"
                  >
                    {isVerifying && <LoadingSpinner className="mr-2" />}
                    {isVerifying ? "Verifying..." : "Verify"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isVerifying ? (
          <Card className="mt-6 animate-fade-in">
            <CardHeader>
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div>
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-4 w-[100px] mb-2" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          userDetails && (
            <Card className="mt-6 animate-fade-in">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-researcher-primary flex items-center justify-center">
                    <User className="text-white h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle>{userDetails.displayName}</CardTitle>
                    <CardDescription>{formatValue(userDetails.phone, "Phone not provided")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Gender</Label>
                    <p className="font-medium">{userDetails.gender}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Family</Label>
                    <p className="font-medium">{userDetails.family || "Not specified"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Age</Label>
                    <p className="font-medium">{formatValue(userDetails.age)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Benefek Code</Label>
                    <p className="font-medium">{formatValue(userDetails.code)}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Principal</Label>
                    <p className="font-medium">{formatValue(userDetails.family)}</p>
                  </div>
                  {userDetails.budget && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Budget Range</Label>
                      <p className="font-medium">
                        {userDetails.budgetRange
                          ? userDetails.budgetRange
                          : `₦${userDetails.budget.min.toLocaleString()} - ₦${userDetails.budget.max.toLocaleString()}`}
                      </p>
                    </div>
                  )}
                  {userDetails.health && (
                    <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 pt-4 border-t">
                      <div className="col-span-2 sm:col-span-1">
                        <Label className="text-muted-foreground text-xs">Allergies</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.health.allergies, "None")}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Label className="text-muted-foreground text-xs">Medications</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.health.medications, "None")}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Label className="text-muted-foreground text-xs">Scares / Health Concerns</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.health.scares, "None")}</p>
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Label className="text-muted-foreground text-xs">Family Condition</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.health.familyCondition, "None")}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">Current Condition Declared</Label>
                        <p className="text-sm font-medium">{userDetails.health.hasCurrentCondition ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  )}
                  {userDetails.quiz && (
                    <div className="col-span-2 grid grid-cols-2 gap-4 mt-2 pt-4 border-t">
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">Nickname</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.basics?.nickname)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Weight</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.basics?.weight)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Height</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.basics?.height)}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">Lifestyle Habits</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.lifestyle?.habits)}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">Fun Activities</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.lifestyle?.funActivities)}</p>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-muted-foreground text-xs">Lifestyle Priority</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.lifestyle?.priority)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Preferred Drug Form</Label>
                        <p className="text-sm font-medium">{formatValue(userDetails.quiz.preferences?.drugForm)}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">Quiz Budget</Label>
                        <p className="text-sm font-medium">
                          {userDetails.quiz.preferences?.budget !== null && userDetails.quiz.preferences?.budget !== undefined
                            ? `NGN ${Number(userDetails.quiz.preferences.budget).toLocaleString()}`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
