"use client";
import { CircleX, Search } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  removeFilterHandler?: () => void;
}

const FilterButtons = ({ removeFilterHandler }: Props) => {
  return (
    <div className="flex justify-start items-center gap-2 mr-2">
      <Button
        tooltip="جستجو"
        variant={"link"}
        className="rounded-full bg-blue-500 h-10 w-10 mt-4"
      >
        <Search className="text-white" />
      </Button>

      <Button
        tooltip="حذف فیلتر‌ها"
        type="button"
        variant={"link"}
        className="rounded-full bg-red-500 h-10 w-10 mt-4"
        onClick={removeFilterHandler}
      >
        <CircleX className="text-white" />
      </Button>
    </div>
  );
};

export default FilterButtons;
