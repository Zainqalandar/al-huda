import { Loader2 } from "lucide-react";

interface LoadingProps {
  style?: string;
  isText?: boolean;
}

export default function Loading({ style = "min-h-screen", isText = true }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-green-900 via-green-700 to-green-950 ${style}`}>
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-12 h-12 text-green-300 animate-spin" />
        {isText && <p className="text-lg font-semibold text-green-100">Loading, please wait...</p>}
      </div>
    </div>
  );
}
