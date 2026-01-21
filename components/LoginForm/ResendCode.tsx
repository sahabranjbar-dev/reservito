import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FilePenLine, MessageSquareText } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/axios";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";
import { LoginFormType } from "./LoginForm";
import { UseFormReset } from "react-hook-form";

interface IResendCode {
  setLoginFormType: Dispatch<SetStateAction<LoginFormType | null>>;
  mobile: string;
  resetOtpInputs: UseFormReset<{ otp: string }>;
}

const ResendCode = ({
  setLoginFormType,
  mobile,
  resetOtpInputs,
}: IResendCode) => {
  const { isFinished, minutes, seconds, reset: resetTimer } = useTimer();
  const { mutateAsync } = useMutation({
    mutationFn: async (phone: string) => {
      const response = await authApi.post("/send-otp", { phone });
      return response.data;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data.message);
    },
  });
  const resendCodeHandler = () => {
    if (!isFinished) return;
    mutateAsync(mobile);
    resetOtpInputs({
      otp: "",
    });
    resetTimer();
  };

  const changeNumberHandler = () => {
    if (!isFinished) return;
    setLoginFormType("sendCode");
  };
  return (
    <div className="mt-3">
      <div className="flex flex-col justify-start items-start gap-2">
        <div className="flex justify-start items-center gap-2">
          <Button
            type="button"
            variant={"link"}
            disabled={!isFinished}
            className={clsx(
              isFinished ? "text-blue-500" : "text-gray-500 cursor-not-allowed "
            )}
            onClick={resendCodeHandler}
            rightIcon={<MessageSquareText />}
          >
            ارسال مجدد کد
          </Button>

          {!isFinished && (
            <span className="text-neutral-700">
              ({minutes}:{seconds})
            </span>
          )}
        </div>

        <Button
          type="button"
          variant={"link"}
          disabled={!isFinished}
          className={clsx(
            isFinished ? "text-blue-500" : "text-gray-500 cursor-not-allowed "
          )}
          onClick={changeNumberHandler}
          rightIcon={<FilePenLine />}
        >
          ویرایش شماره موبایل
        </Button>
      </div>
    </div>
  );
};

export default ResendCode;
