"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  LayoutDashboard,
  MessageSquare,
  PieChart,
  TrendingUp,
  Users,
  Wifi,
} from "lucide-react";
import { useState } from "react";

// --- تنظیمات رنگ‌ها برای جلوگیری از مشکل داینامیک کلاس‌های Tailwind ---
const colorConfig: Record<
  string,
  {
    bg: string;
    bgSoft: string;
    text: string;
    textSoft: string;
    border: string;
    from: string;
    to: string;
  }
> = {
  indigo: {
    bg: "bg-indigo-500",
    bgSoft: "bg-indigo-500/10",
    text: "text-indigo-400",
    textSoft: "text-indigo-200",
    border: "border-indigo-500/20",
    from: "from-indigo-500",
    to: "to-purple-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgSoft: "bg-emerald-500/10",
    text: "text-emerald-400",
    textSoft: "text-emerald-200",
    border: "border-emerald-500/20",
    from: "from-emerald-500",
    to: "to-teal-500",
  },
  amber: {
    bg: "bg-amber-500",
    bgSoft: "bg-amber-500/10",
    text: "text-amber-400",
    textSoft: "text-amber-200",
    border: "border-amber-500/20",
    from: "from-amber-500",
    to: "to-orange-500",
  },
  rose: {
    bg: "bg-rose-500",
    bgSoft: "bg-rose-500/10",
    text: "text-rose-400",
    textSoft: "text-rose-200",
    border: "border-rose-500/20",
    from: "from-rose-500",
    to: "to-pink-500",
  },
};

// تنظیمات انیمیشن‌ها
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const floatVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function BookingManagementSection() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedStatCard, setSelectedStatCard] = useState("today");

  // داده‌های دکمه‌های سایدبار
  const sidebarButtons = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "داشبورد",
      color: "indigo",
    },
    { id: "calendar", icon: Calendar, label: "تقویم", color: "blue" },
    { id: "customers", icon: Users, label: "مشتریان", color: "emerald" },
    { id: "services", icon: Briefcase, label: "خدمات", color: "amber" },
  ];

  // داده‌های کارت‌های آماری (بدون درآمد)
  const statCards = [
    {
      id: "today",
      title: "رزروهای امروز",
      value: "۱۴",
      subText: "۳ در انتظار تایید",
      icon: Calendar,
      colorKey: "indigo",
      change: "+12%",
      trend: "up",
    },
    {
      id: "customers",
      title: "مشتریان جدید",
      value: "+۲۴",
      subText: "در هفته گذشته",
      icon: Users,
      colorKey: "emerald",
      change: "+8%",
      trend: "up",
    },
    {
      id: "services_done",
      title: "خدمات انجام شده",
      value: "۴۸",
      subText: "نفر در امروز",
      icon: CheckCircle,
      colorKey: "amber",
      change: "+5%",
      trend: "up",
    },
    {
      id: "pending",
      title: "در انتظار تأیید",
      value: "۷",
      subText: "رزرو",
      icon: Clock,
      colorKey: "rose",
      change: "۰%",
      trend: "neutral",
    },
  ];

  // محتوای مختلف برای تب‌ها
  const tabContents: Record<string, any> = {
    dashboard: {
      title: "داشبورد مدیریتی",
      chartData: [40, 65, 35, 85, 55, 75, 60],
      chartLabels: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
      chartTitle: "ترافیک رزرو هفتگی",
      chartType: "bar",
    },
    calendar: {
      title: "تقویم هفتگی",
      chartData: [12, 18, 25, 15, 30, 22, 10], // نوبت‌ها در هر روز
      chartLabels: [
        "شنبه",
        "یکشنبه",
        "دوشنبه",
        "سه‌شنبه",
        "چهارشنبه",
        "پنجشنبه",
        "جمعه",
      ],
      chartTitle: "ظرفیت رزرو روزانه",
      chartType: "horizontal", // نمودار افقی برای نشان دادن پر بودن روزها
    },
    customers: {
      title: "تحلیل مشتریان",
      chartData: [60, 25, 15], // درصد
      chartLabels: ["مشتریان وفادار", "مشتریان جدید", "مشتریان غیرفعال"],
      chartTitle: "سهم هر دسته",
      chartType: "pie",
    },
    services: {
      title: "خدمات پرطرفدار",
      chartData: [90, 75, 60, 45, 30],
      chartLabels: [
        "کوتاهی مو",
        "رنگ و مش",
        "اصلاح صورت",
        "مانیکور",
        "اپیلاسیون",
      ],
      chartTitle: "محبوبیت خدمات",
      chartType: "horizontal",
    },
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === "dashboard") setSelectedStatCard("today");
    if (tabId === "calendar") setSelectedStatCard("today");
    if (tabId === "customers") setSelectedStatCard("customers");
    if (tabId === "services") setSelectedStatCard("services_done");
  };

  const handleStatCardClick = (cardId: string) => {
    setSelectedStatCard(cardId);
  };

  // رندر نمودار بر اساس نوع
  const renderChart = () => {
    const content = tabContents[activeTab];
    const styles = colorConfig.indigo; // رنگ پیش‌فرض

    // نمودار دایره‌ای (Pie Chart)
    if (content.chartType === "pie") {
      return (
        <div className="flex flex-col items-center justify-center h-40 gap-4">
          <div
            className="relative w-32 h-32 rounded-full shadow-lg shadow-indigo-500/20"
            style={{
              background: `conic-gradient(
                    #6366f1 0% ${content.chartData[0]}%, 
                    #10b981 ${content.chartData[0]}% ${content.chartData[0] + content.chartData[1]}%, 
                    #f59e0b ${content.chartData[0] + content.chartData[1]}% 100%
                  )`,
            }}
          >
            {/* دایره وسط برای ایجاد افکت Donut */}
            <div className="absolute inset-4 bg-[#1e293b] rounded-full flex items-center justify-center">
              <span className="text-xs text-slate-400">کل</span>
            </div>
          </div>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              {content.chartLabels[0]}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {content.chartLabels[1]}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              {content.chartLabels[2]}
            </span>
          </div>
        </div>
      );
    }

    // نمودار افقی (Horizontal Bar)
    if (content.chartType === "horizontal") {
      return (
        <div className="space-y-3 h-40 overflow-y-auto pr-1 custom-scrollbar">
          {content.chartData.map((value: number, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <span
                className="text-xs text-slate-400 w-24 text-right truncate"
                title={content.chartLabels[index]}
              >
                {content.chartLabels[index]}
              </span>
              <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    index === 0
                      ? "bg-indigo-500"
                      : index === 1
                        ? "bg-emerald-500"
                        : index === 2
                          ? "bg-amber-500"
                          : index === 3
                            ? "bg-rose-500"
                            : "bg-purple-500"
                  }`}
                />
              </div>
              <span className="text-xs text-slate-300 w-8 text-left">
                {value}%
              </span>
            </div>
          ))}
        </div>
      );
    }

    // نمودار میله‌ای (Bar Chart) - پیش‌فرض
    return (
      <div className="flex items-end justify-between h-40 gap-2">
        {content.chartData.map((h: number, i: number) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{
              duration: 0.8,
              delay: 0.4 + i * 0.1,
              ease: "easeOut",
            }}
            className={`w-full rounded-t-md relative group hover:opacity-80 transition-colors bg-linear-to-t ${styles.from} ${styles.to}`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {h} {activeTab === "calendar" ? "نفر" : "نوبت"}
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden bg-slate-50">
      {/* پس‌زمینه‌های متحرک */}
      <div className="absolute top-0 right-0 -translate-y-24 translate-x-24 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div
        className="absolute top-0 left-0 -translate-y-24 -translate-x-24 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* ستون تصویر (داشبورد تعاملی) */}
          <div className="w-full lg:w-1/2">
            <motion.div animate="float" className="relative group">
              {/* هاله نورانی */}
              <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative bg-slate-900 rounded-[2rem] p-2 shadow-2xl text-white overflow-hidden ring-1 ring-white/10">
                {/* نوار ابزار مرورگر */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-slate-950/50 rounded-full h-6 flex items-center justify-center px-3 text-xs text-slate-400 font-mono border border-white/5">
                      reservemarket.com/dashboard
                    </div>
                  </div>
                  <Wifi className="w-4 h-4 text-slate-400" />
                </div>

                <div className="p-6 grid grid-cols-12 gap-6 h-120 overflow-scroll">
                  {/* سایدبار */}
                  <div className="hidden md:flex col-span-2 flex-col gap-4 border-l border-white/10 pl-4">
                    {sidebarButtons.map((button) => {
                      const isActive = activeTab === button.id;
                      // برای دکمه‌های غیر فعال رنگ پیش‌فرض را استفاده می‌کنیم
                      const btnStyle = isActive
                        ? colorConfig[button.color] || colorConfig.indigo
                        : {
                            bg: "bg-transparent",
                            text: "text-slate-500",
                            bgSoft: "hover:bg-white/5",
                          };

                      return (
                        <button
                          key={button.id}
                          onClick={() => handleTabClick(button.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer group relative ${isActive ? btnStyle.bgSoft + " " + btnStyle.text + " shadow-inner" : btnStyle.bgSoft + " " + btnStyle.text + " hover:text-white"}`}
                          title={button.label}
                        >
                          <button.icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>

                  {/* محتوای اصلی */}
                  <div className="col-span-12 md:col-span-10 flex flex-col gap-5">
                    {/* هدر */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-white">
                        {tabContents[activeTab].title}
                      </h3>
                    </div>

                    {/* کارت‌های آماری */}
                    <div className="grid grid-cols-2 gap-4">
                      {statCards.map((card) => {
                        const isSelected = selectedStatCard === card.id;
                        const c = colorConfig[card.colorKey];

                        return (
                          <button
                            key={card.id}
                            onClick={() => handleStatCardClick(card.id)}
                            className={`bg-linear-to-br ${c.bgSoft} to-transparent border ${isSelected ? "border-white/40" : "border-white/5"} p-4 rounded-2xl relative overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 group text-right`}
                          >
                            <div
                              className={`absolute -right-6 -top-6 w-20 h-20 ${c.bg} rounded-full blur-2xl opacity-20`}
                            ></div>
                            <div
                              className={`flex items-center gap-2 mb-2 ${c.textSoft} justify-end`}
                            >
                              <span className="text-xs font-medium">
                                {card.title}
                              </span>
                              <card.icon className="w-4 h-4" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-1 text-left">
                              {card.value}
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`text-xs ${card.trend === "up" ? "text-emerald-400" : "text-slate-400"} flex items-center gap-1 bg-slate-900/50 px-2 py-0.5 rounded`}
                              >
                                {card.trend === "up" && (
                                  <TrendingUp className="w-3 h-3" />
                                )}
                                <span>{card.change}</span>
                              </div>
                              <span className="text-[10px] text-slate-400">
                                {card.subText}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* بخش نمودار */}
                    <div className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium text-slate-200">
                          {tabContents[activeTab].chartTitle}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-slate-900/40 px-2 py-1 rounded">
                          {activeTab === "customers" ? (
                            <PieChart className="w-3 h-3" />
                          ) : (
                            <BarChart3 className="w-3 h-3" />
                          )}
                          <span>نمودار زنده</span>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="w-full h-full flex flex-col justify-end"
                        >
                          {renderChart()}
                        </motion.div>
                      </AnimatePresence>

                      {/* لیبل‌ها */}
                      {tabContents[activeTab].chartType !== "horizontal" && (
                        <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-mono pt-2 border-t border-white/5">
                          {tabContents[activeTab].chartLabels.map(
                            (label: string, i: number) => (
                              <span key={i}>{label}</span>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ستون متن (ثابت) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="w-full lg:w-1/2 text-center lg:text-right"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              سیستم جامع مدیریت نوبت‌دهی
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6"
            >
              نظم و انضباط کامل در <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600 relative inline-block">
                مدیریت رزروها
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 leading-8 mb-10 max-w-lg mx-auto lg:mx-0"
            >
              با فراموش کردن دفترچه‌های کاغذی و پیام‌های متفرقه، کنترل کامل کل
              کسب‌وکار خود را در دست بگیرید. از زمان‌بندی پرسنل تا آرشیو
              مشتریان، همه چیز یکجا مدیریت می‌شود.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="space-y-4 max-w-md mx-auto lg:mx-0 mb-10"
            >
              {[
                { icon: Calendar, text: "مدیریت تقویم و زمان‌بندی پرسنل" },
                { icon: Users, text: "پرونده کامل و تاریخچه مشتریان" },
                {
                  icon: MessageSquare,
                  text: "ارسال خودکار پیامک یادآوری نوبت",
                },
                { icon: Clock, text: "صرفه‌جویی قابل توجه در زمان مدیریت" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 group p-3 rounded-xl hover:bg-white transition-all duration-300 cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-sm"
                >
                  <div className="shrink-0 w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-slate-700 font-medium text-lg group-hover:text-slate-900 transition-colors">
                    {item.text}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
            >
              <button className="relative inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 w-full sm:w-auto">
                <div className="absolute inset-0 w-full h-full bg-linear-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  شروع رایگان ۱۴ روزه
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                </span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
