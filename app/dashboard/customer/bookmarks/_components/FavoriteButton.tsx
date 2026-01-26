"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition, useOptimistic } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "../_meta/actions";

interface Props {
  businessId: string;
  initialIsFavorite: boolean;
}

const FavoriteButton = ({ businessId, initialIsFavorite }: Props) => {
  const [isPending, startTransition] = useTransition();

  // optimistic state
  const [optimisticFavorite, setOptimisticFavorite] =
    useOptimistic(initialIsFavorite);

  const handleToggle = () => {
    // فقط برای UI فوری
    setOptimisticFavorite((prev) => !prev);

    startTransition(async () => {
      const res = await toggleFavoriteAction(businessId);

      if (!res.success) {
        toast.error(res.error || "خطا در تغییر علاقه‌مندی");
        return;
      }

      // فقط نتیجه واقعی سرور معتبر است
      setOptimisticFavorite(res.isFavorite!);

      toast.success(
        res.isFavorite ? "به علاقه‌مندی‌ها اضافه شد" : "از علاقه‌مندی‌ها حذف شد"
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "transition-all hover:scale-110",
        optimisticFavorite
          ? "text-rose-500 fill-rose-500 hover:bg-rose-50"
          : "text-slate-300 hover:bg-slate-100 hover:text-rose-400"
      )}
    >
      <Heart
        className={cn(
          "w-6 h-6 transition-all duration-300 text-rose-500",
          optimisticFavorite ? "scale-125 fill-rose-500" : "scale-100"
        )}
      />
    </Button>
  );
};

export default FavoriteButton;
