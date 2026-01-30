import { Loader2 } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default loading;
