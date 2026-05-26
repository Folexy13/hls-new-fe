import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Store } from "lucide-react";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import { getApiErrorMessage } from "@/utils/apiError";

const WholesalerSignupPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    mainBranch: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!Object.values(formData).every((value) => value.trim())) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({
        businessName: formData.businessName,
        mainBranch: formData.mainBranch,
        contact: formData.contact,
        email: formData.email,
        password: formData.password,
        role: "wholesaler",
      });

      toast.success("Wholesaler account created successfully. Please sign in.");
      navigate("/auth/signin");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Registration failed. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm p-8 md:p-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
            <Store className="text-purple-600" size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-semibold text-center text-gray-900">
          Wholesaler
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-5">
          Create your seller account to list products
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Name
              </label>
              <input
                type="text"
                placeholder="Business name"
                value={formData.businessName}
                onChange={(event) => updateField("businessName", event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Branch
              </label>
              <input
                type="text"
                placeholder="Enter address"
                value={formData.mainBranch}
                onChange={(event) => updateField("mainBranch", event.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Office Number
            </label>
            <input
              type="tel"
              placeholder="Business contact number"
              value={formData.contact}
              onChange={(event) => updateField("contact", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(event) => updateField("password", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-[46px] text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-4 top-[46px] text-gray-500"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 transition"
          >
            {isSubmitting ? "Creating Account..." : "Create Wholesaler Account"}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-purple-600 hover:underline">
            Sign in
          </Link>
        </div>

        <div className="text-center mt-3 text-sm text-gray-600">
          Want a different account type?{" "}
          <Link to="/auth/signup" className="text-purple-600 hover:underline">
            Choose role
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WholesalerSignupPage;
