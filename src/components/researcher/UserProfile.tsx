import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { dummyUser } from "@/lib/researcher/dummyData";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { researcherService } from "@/services/researcherService";

interface UserProfileProps {
  onUserVerified?: (verified: boolean, budget: { min: number; max: number } | null) => void;
}

export function UserProfile({ onUserVerified }: UserProfileProps) {
  const [benefekCode, setBenefekCode] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const { toast } = useToast();

  const handleVerifyCode = async () => {
    setIsVerifying(true);
    try {
      const data = await researcherService.verifyBenfekCode(benefekCode);

      if (data?.benfek) {
        sessionStorage.setItem("researcherVerifiedBenfekCode", data.benfek.code);
        setUserDetails({
          ...dummyUser,
          name: data.benfek.name || dummyUser.name,
          gender: data.benfek.gender || dummyUser.gender,
          benefekCode: data.benfek.code,
          budget: data.benfek.quiz?.preferences?.budget
            ? { min: 0, max: Number(data.benfek.quiz.preferences.budget) }
            : dummyUser.budget,
        });
        toast({
          title: "Code verified",
          description: "User details retrieved successfully.",
        });

        if (onUserVerified) {
          onUserVerified(
            true,
            data.benfek.quiz?.preferences?.budget
              ? { min: 0, max: Number(data.benfek.quiz.preferences.budget) }
              : dummyUser.budget || null
          );
        }
      } else {
        setUserDetails(null);
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
                    <CardTitle>{userDetails.name}</CardTitle>
                    <CardDescription>{userDetails.email}</CardDescription>
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
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Benefek Code</Label>
                    <p className="font-medium">{userDetails.benefekCode}</p>
                  </div>
                  {userDetails.budget && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Budget Range</Label>
                      <p className="font-medium">
                        ₦{userDetails.budget.min.toLocaleString()} - ₦{userDetails.budget.max.toLocaleString()}
                      </p>
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
