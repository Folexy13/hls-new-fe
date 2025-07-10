
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from "./components/Layout";
import AuthWrapper from "./components/AuthWrapper";
import Homepage from "./pages/Homepage";
import BenfekHomepage from "./pages/benfek/Homepage";
import AboutPage from "./pages/benfek/AboutPage";
import QuizPage from "./pages/benfek/QuizPage";
import AuthPage from "./pages/AuthPage";
import SupportPage from "./pages/benfek/SupportPage";
import Dashboard from "./pages/benfek/Dashboard";
import CartPage from "./pages/benfek/CartPage";
import PodcastPage from "./pages/benfek/PodcastPage";
import BlogPage from "./pages/benfek/BlogPage";
import NotFound from "./pages/benfek/NotFound";
import MarketplacePage from "./pages/benfek/MarketplacePage";
import ProductPage from "./pages/benfek/ProductPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrincipalHomepage from "./pages/principal/Homepage";
import AccountPage from "./pages/principal/AccountPage";
import EarningsPage from "./pages/principal/EarningsPage";
import WithdrawPage from "./pages/principal/WithdrawPage";
import BenfeksPage from "./pages/principal/BenfeksPage";
import PurchasesPage from "./pages/principal/PurchasesPage";
import AddBenfekPage from "./pages/principal/AddBenfekPage";
import SupplementsPage from "./pages/principal/SupplementsPage";
import ArticlesPage from "./pages/principal/ArticlesPage";
import PodcastsPage from "./pages/principal/PodcastsPage";
import WholesalerHomepage from "./pages/wholesaler/Homepage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <Layout>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/benfek" element={<BenfekHomepage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/blog/:id" element={<BlogPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              
              {/* Benfek Routes */}
              <Route path="/benfek" element={
                <ProtectedRoute requiredRole="benfek">
                  <BenfekHomepage />
                </ProtectedRoute>
              } />
              <Route path="/benfek/dashboard" element={
                <ProtectedRoute requiredRole="benfek">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/cart" element={
                <ProtectedRoute requiredRole="benfek">
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/podcast" element={
                <ProtectedRoute requiredRole="benfek">
                  <PodcastPage />
                </ProtectedRoute>
              } />
              
              {/* Principal Routes */}
              <Route path="/principal" element={
                <ProtectedRoute requiredRole="principal">
                  <PrincipalHomepage />
                </ProtectedRoute>
              } />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/earnings" element={<EarningsPage />} />
              <Route path="/withdraw" element={<WithdrawPage />} />
              <Route path="/benfeks" element={<BenfeksPage />} />
              <Route path="/purchases" element={<PurchasesPage />} />
              <Route path="/add-benfek" element={<AddBenfekPage />} />
              <Route path="/supplements" element={<SupplementsPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/podcasts" element={<PodcastsPage />} />
              
              {/* Wholesaler Routes */}
              <Route path="/wholesaler" element={
                <ProtectedRoute requiredRole="wholesaler">
                  <WholesalerHomepage />
                </ProtectedRoute>
              } />
              
              {/* Legacy route redirect */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="principal">
                  <PrincipalHomepage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </AuthWrapper>
      </BrowserRouter>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
