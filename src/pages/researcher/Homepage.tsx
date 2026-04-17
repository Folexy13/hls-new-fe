import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/researcher/AuthModal";
import { TabsContainer } from "@/components/researcher/TabsContainer";
import { useToast } from "@/components/ui/use-toast";
import { LogIn, LogOut } from "lucide-react";
import logo from "@/images/logo.jpg";
import { useStore } from "../../store/useStore";
import { tokenManager } from "@/utils/tokenManager";

const ResearcherHomepage = () => {
  const { user, isAuthenticated: storeAuthenticated, logout } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(storeAuthenticated);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    // 1. Check for token in URL (callback from General Sign-In)
    const token = searchParams.get("token");
    if (token) {
      tokenManager.setTokens(token, ""); // Assuming simple token handover
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      
      // Clean URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("token");
      setSearchParams(newParams);
      
      toast({
        title: "Authenticated",
        description: "Successfully connected via HLS Central Sign-In.",
      });
      return;
    }

    // 2. Sync with Store or LocalStorage
    const authStatus = storeAuthenticated || localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, [storeAuthenticated, searchParams]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    tokenManager.clearTokens();
    if (typeof logout === 'function') logout();
    
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleLogin = () => {
    // Redirect to General Sign-In Page
    window.location.href = `/auth/signin?callback=${encodeURIComponent(window.location.origin + "/researcher")}`;
  };

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-researcher-background flex flex-col">
      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] bg-white shadow-sm">
        <div className="container h-full flex justify-between items-center px-2 sm:px-4">
          <div className="flex items-center">
            <img src={logo} width={150} alt="HLS" />
          </div>

          <div>
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-researcher-primary text-researcher-primary hover:bg-researcher-muted h-6"
              >
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            ) : (
              <Button
                onClick={handleLogin}
                className="text-researcher-primary bg-white hover:bg-white ring-1 ring-researcher-secondary hover:text-researcher-secondary"
              >
                <LogIn className="h-4 w-4 mr-2" /> Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto pt-[72px] pb-4 px-2 sm:px-4 flex-1">
        <TabsContainer />
      </main>

      <footer className="bg-white border-t py-4 px-2 sm:px-4 mt-auto">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HLS' Researcher App. All rights reserved.</p>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
};

export default ResearcherHomepage;
