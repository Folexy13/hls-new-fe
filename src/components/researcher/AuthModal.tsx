import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/hooks/researcher/useApi";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthenticated }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setName] = useState<string>("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { username: email, password };

    try {
      const res = await api.post("api/auth/login", payload);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", String((res.data as any)?.access || ""));
      localStorage.setItem("user", JSON.stringify({ email, name: "Test User" }));

      toast({
        title: "Logged in successfully",
        description: "Welcome back to the Researcher App!",
      });
      onAuthenticated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error?.response?.data?.error || error?.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !username) {
      toast({
        title: "Registration failed",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        email,
        password,
        username,
        name: username,
        phone: Math.random(),
        account_name: "",
        bank_name: "",
        account_number: "",
        address: "",
      };

      await api.post("api/auth/register", payload);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify({ email, username }));
      toast({
        title: "Registration successful",
        description: "Welcome to the Researcher App!",
      });
      onAuthenticated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description:
          error?.response?.data?.error ||
          error?.message ||
          "An error occurred during registration",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center text-researcher-primary">
            Researcher App
          </DialogTitle>
          <DialogDescription className="text-center">
            Sign in to your account or create a new one
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="researcher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-researcher-primary hover:bg-researcher-secondary"
              >
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Username</Label>
                <Input
                  id="register-name"
                  placeholder="Your Name"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="researcher@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-researcher-primary hover:bg-researcher-secondary"
              >
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

