import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-6 shadow-lg rounded-lg max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to PayTM</h1>
        <p className="text-xl text-gray-600 mb-6">
          Send and receive money securely and easily. Start by logging in to your account or create a new one!
        </p>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/signin")}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-2 border border-blue-500 text-blue-500 font-semibold rounded-md hover:bg-blue-100"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
