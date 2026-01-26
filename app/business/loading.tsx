import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex justify-center py-20 min-h-screen">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
    </div>
  );
}
