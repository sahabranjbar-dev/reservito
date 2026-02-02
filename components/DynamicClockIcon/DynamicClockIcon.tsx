"use client";
import * as Icons from "lucide-react";

interface Props {
  currentTime: Date;
  [key: string]: any;
}

const DynamicClockIcon = ({ currentTime, ...res }: Props) => {
  const hours = currentTime.getHours();

  const hourIcons: Record<number, keyof typeof Icons> = {
    0: "Clock12",
    1: "Clock1",
    2: "Clock2",
    3: "Clock3",
    4: "Clock4",
    5: "Clock5",
    6: "Clock6",
    7: "Clock7",
    8: "Clock8",
    9: "Clock9",
    10: "Clock10",
    11: "Clock11",
    12: "Clock12",
    13: "Clock1",
    14: "Clock2",
    15: "Clock3",
    16: "Clock4",
    17: "Clock5",
    18: "Clock6",
    19: "Clock7",
    20: "Clock8",
    21: "Clock9",
    22: "Clock10",
    23: "Clock11",
  };

  const IconComponent: any = Icons[hourIcons[hours]];

  return (
    <div className="flex items-center gap-2">
      {IconComponent && <IconComponent {...res} />}
    </div>
  );
};

export default DynamicClockIcon;
