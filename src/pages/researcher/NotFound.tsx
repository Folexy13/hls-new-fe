import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const ResearcherNotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-researcher-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-researcher-primary">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to="/researcher" className="text-researcher-primary hover:underline">
          Return to Researcher Home
        </Link>
      </div>
    </div>
  );
};

export default ResearcherNotFound;

