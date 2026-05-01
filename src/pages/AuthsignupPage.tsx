import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const AuthSignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Create an Account
        </h1>

        <p className="text-center text-gray-500 mb-10">
          Choose your account type to get started
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/?startQuiz=1">
            <div className="border rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-green-500 hover:shadow-lg hover:bg-green-50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>

              <h2 className="text-lg font-semibold text-green-600 mb-2">
                Benfek
              </h2>

              <p className="text-sm text-gray-600">
                Start the same quiz and signup flow used when a benfek clicks the quiz button.
              </p>
            </div>
          </Link>

          <Link to="/auth/signup/principal">
            <div className="border rounded-xl p-6 text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:bg-blue-50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-2xl">👔</span>
              </div>

              <h2 className="text-lg font-semibold text-blue-600 mb-2">
                Principal
              </h2>

              <p className="text-sm text-gray-600">
                Admin account to manage the platform, users, and products
              </p>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/auth/signin" className="text-emerald-600 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthSignupPage;
