import { AlertTriangle } from "lucide-react";

export default function Error({ message }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-950">
      <div className="bg-white/10 border border-green-300 rounded-xl shadow-lg p-6 max-w-md text-center">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-red-200 mb-2">Something went wrong</h2>
        <p className="text-green-100">{message || "An unexpected error occurred."}</p>
      </div>
    </div>
  );
}
