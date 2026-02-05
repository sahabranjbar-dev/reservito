interface Props {
  step: number;
}

export const StepProgress = ({ step }: Props) => (
  <div className="mb-10">
    <div className="flex justify-between mb-4 text-sm font-semibold text-slate-400">
      {["حساب کاربری", "مشخصات فروشگاه", "تکمیل ثبت‌نام"].map((t, i) => (
        <span key={i} className={step >= i + 1 ? "text-indigo-600" : ""}>
          {i + 1}. {t}
        </span>
      ))}
    </div>

    <div className="w-full bg-slate-100 rounded-full h-2">
      <div
        className="bg-indigo-600 h-2 transition-all"
        style={{ width: `${(step / 3) * 100}%` }}
      />
    </div>
  </div>
);
