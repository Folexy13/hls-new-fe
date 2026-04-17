import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Layout from "./components/Layout";
import AuthWrapper from "./components/AuthWrapper";
import RBACProvider from "./context/RBACProvider";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { UserRole } from "./context/roles";

// Pages
import Homepage from "./pages/Homepage";
import BenfekHomepage from "./pages/benfek/Homepage";
import AboutPage from "./pages/AboutPage";
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
import QuizFormPage from "./pages/benfek/QuizFormPage";
import BenfekMyProfilePage from "./pages/benfek/MyProfilePage";
import BenfekBonusPage from "./pages/benfek/BonusPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PrincipalHomepage from "./pages/principal/Homepage";
import WholesalerHomepage from "./pages/wholesaler/Homepage";
import AssessmentPage from "./pages/Assessmentpage";

// Import Principal pages
import AccountPage from "./pages/principal/account";
import AddBenfekPage from "./pages/principal/add-benfek";
import BenfeksPage from "./pages/principal/benfeks";
import EarningsPage from "./pages/principal/earnings";
import PodcastsPage from "./pages/principal/podcasts";
import MedicationsPage from "./pages/principal/medications";
import PurchasesPage from "./pages/principal/purchases";
import ArticlesPage from "./pages/principal/articles";
import WithdrawPage from "./pages/principal/withdraw";
import MyProfilePage from "./pages/principal/my-profile";

// Import Wholesaler pages
import WholesalerEarningsPage from "./pages/wholesaler/earnings";
import WholesalerAddProductPage from "./pages/wholesaler/add-product";
import WholesalerProductsPage from "./pages/wholesaler/products";
import WholesalerOrdersPage from "./pages/wholesaler/orders";
import AddProductPage from "./pages/wholesaler/add-product";
import OrdersPage from "./pages/wholesaler/orders";
import ProductsPage from "./pages/wholesaler/products";
import ResearcherAuthPage from "./pages/researcher/ResearcherAuthpage";
import ResearcherHomepage from "./pages/researcher/Homepage";
import ResearcherNotFound from "./pages/researcher/NotFound";
import ResearcherSelectedSupplementsPage from "./pages/researcher/SelectedSupplements";
import AuthSignupPage from "./pages/AuthsignupPage";
import PrincipalSignupPage from "./pages/principal/principalSignupPage";
import WholesalerSignupPage from "./pages/wholesaler/WholesalerSignupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthWrapper>
          <RBACProvider>
            <Layout>
              <Routes>
                {/* Public routes */}

                <Route path="/" element={<Homepage />} />
                <Route path="/auth/*" element={<AuthPage />} />
                <Route path="/researcher/auth/*" element={<ResearcherAuthPage />} />
                <Route path="/researcher" element={<ResearcherHomepage />} />
                <Route
                  path="/researcher/gallery/selected"
                  element={<ResearcherSelectedSupplementsPage />}
                />
                <Route path="/researcher/*" element={<ResearcherNotFound />} />
                <Route path="/auth/signup" element={<AuthSignupPage />} />
                <Route path="/auth/signup/principal" element={<PrincipalSignupPage />} />
                <Route path="/auth/signup/wholesaler" element={<WholesalerSignupPage />} />
                <Route path="/principal" element={<PrincipalHomepage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/auth/signup/researcher" element={<ResearcherAuthPage />} />
                <Route path="/principal/add-benfek" element={<AddBenfekPage />} />
                <Route path="/principal/users" element={<Navigate to="/principal/my-profile" replace />} />
                <Route path="/principal/my-profile" element={<MyProfilePage />} />
                 <Route path="/assessment" element={<AssessmentPage/>} />
                 <Route path="/principal/benfeks" element={<BenfeksPage />} />
                 <Route path="/quiz" element={<QuizPage />} />
                 <Route path="/benfek/quiz-form" element={<QuizFormPage />} />


                {/* Role-based protected routes */}
                {/* Benfek Routes */}
                <Route
                  path="/benfek"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <BenfekHomepage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/benfek/dashboard"
                  element={
                    // <RoleBasedRoute
                    //   allowedRoles={[UserRole.BENFEK]}
                    //   fallbackPath="/"
                    // >
                      <Dashboard />
                    // </RoleBasedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <AboutPage />
                  }
                />
                
                <Route
                  path="/support"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <SupportPage />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/benfek/my-profile"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <BenfekMyProfilePage />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/benfek/bonus"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <BenfekBonusPage />
                    </RoleBasedRoute>
                  }
                />
                <Route
                  path="/blog/:id"
                  element={
                    // <RoleBasedRoute
                    //   allowedRoles={[UserRole.BENFEK]}
                    //   fallbackPath="/"
                    // >
                      <BlogPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* <Route
                  path="/marketplace"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <MarketplacePage />
                    </RoleBasedRoute>
                  }
                /> */}
                <Route
                  path="/product/:id"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.BENFEK]}
                      fallbackPath="/"
                    >
                      <ProductPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Principal Routes */}
                <Route
                  path="/principal"
                  element={
                    // <RoleBasedRoute
                    //   allowedRoles={[UserRole.PRINCIPAL]}
                    //   fallbackPath="/"
                    // >
                      <PrincipalHomepage />
                    // </RoleBasedRoute>
                  }
                />
                <Route
                  path="/principal/Homepage"
                  element={<PrincipalHomepage />}
                />

                {/* Principal Account Route */}
                <Route
                  path="/principal/account"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <AccountPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Add Benfek Route */}
                {/* <Route
                  path="/principal/add-benfek"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <AddBenfekPage />
                    </RoleBasedRoute>
                  }
                /> */}
                {/* Principal Benfeks Route */}
                {/* <Route
                  path="/principal/benfeks"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <BenfeksPage />
                    </RoleBasedRoute>
                  }
                /> */}
                {/* Principal Earnings Route */}
                <Route
                  path="/principal/earnings"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <EarningsPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Podcasts Route */}
                <Route
                  path="/principal/podcasts"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <PodcastsPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Medications Route */}
                {/* <Route
                  path="/principal/medications"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <MedicationsPage />
                    </RoleBasedRoute>
                  }
                /> */}
                <Route
                  path="/principal/medications"
                  element={<MedicationsPage />}
                />

                {/* Principal Settings Route */}
                <Route
                  path="/principal/settings"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <MyProfilePage defaultTab="settings" />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Purchases Route */}
                <Route
                  path="/principal/purchases"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <PurchasesPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Articles Route */}
                <Route
                  path="/principal/articles"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <ArticlesPage />
                    // </RoleBasedRoute>
                  }
                />
                {/* Principal Withdraw Route */}
                <Route
                  path="/principal/withdraw"
                  element={
                    // <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <WithdrawPage />
                    // </RoleBasedRoute>
                  }
                />

                {/* Wholesaler Routes */}
                <Route
                  path="/wholesaler"
                  element={
                    <RoleBasedRoute
                      allowedRoles={[UserRole.WHOLESALER]}
                      fallbackPath="/"
                    >
                      <WholesalerHomepage />
                    </RoleBasedRoute>
                  }
                />

                {/* Wholesaler Earnings Route */}
                <Route
                  path="/wholesaler/earnings"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.WHOLESALER]}>
                      <WholesalerEarningsPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Wholesaler Add Product Route */}
                <Route
                  path="/wholesaler/add-product"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.WHOLESALER]}>
                      <WholesalerAddProductPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Wholesaler Products Route */}
                <Route
                  path="/wholesaler/products"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.WHOLESALER]}>
                      <WholesalerProductsPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Wholesaler Orders Route */}
                <Route
                  path="/wholesaler/orders"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.WHOLESALER]}>
                      <WholesalerOrdersPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Benfek-specific shared routes */}
                <Route
                  path="/podcast"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.BENFEK]}>
                      <PodcastPage />
                    </RoleBasedRoute>
                  }
                />

                <Route
                  path="/cart"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.BENFEK]}>
                      <CartPage />
                    </RoleBasedRoute>
                  }
                />

                {/* Dashboard only for Principal */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]}>
                      <Dashboard />
                    </RoleBasedRoute>
                  }
                />
                

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </RBACProvider>
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
