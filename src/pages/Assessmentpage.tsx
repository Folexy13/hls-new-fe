const AssessmentPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-10 rounded-xl shadow-md w-[450px] text-center">

        <h1 className="text-2xl font-semibold mb-4">
          Health Assessment Quiz
        </h1>

        <p className="text-gray-500 mb-6">
          Enter your quiz code to begin your health assessment.
        </p>

        <input
          type="text"
          placeholder="Enter your quiz code"
          className="w-full border rounded-lg px-4 py-3 mb-4"
        />

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Verify & Continue
        </button>

      </div>

    </div>
  );
};

export default AssessmentPage;