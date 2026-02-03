import { CircleAlert } from "lucide-react";
import React from "react";

const DisabledSection = () => {
  return (
    <div className="absolute backdrop-blur-[2px] w-full h-full top-0 left-0 right-0 bottom-0 z-20 flex justify-center items-center">
      <div className="border p-2 rounded-2xl bg-yellow-100 flex justify-center items-center gap-2 text-gray-600">
        این قابلیت به‌زودی فعال می‌شود.
        <CircleAlert />
      </div>
    </div>
  );
};

export default DisabledSection;
