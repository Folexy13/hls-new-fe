import { useNavigate } from "react-router-dom";

const ResearcherAuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Researcher Portal</h2>
          <p className="mt-2 text-sm text-gray-600">
            Researcher authentication coming soon
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={() => navigate("/")}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResearcherAuthPage;
