"use server";

import prisma from "@/utils/prisma";

export async function getPaginatedBusinessAction(params: {
  page?: string;
  category?: string;
  query?: string;
}) {
  try {
    // تنظیمات پیش‌فرض
    const currentPage = Number(params.page) || 1;
    const limit = 12; // تعداد آیتم در هر صفحه
    const skip = (currentPage - 1) * limit;

    // ساخت شرط‌های فیلتر
    const where: any = {
      isActive: true,
      deletedAt: null,
    };

    // فیلتر بر اساس دسته‌بندی (Category)
    if (params.category && params.category !== "all") {
      where.businessType = params.category.toUpperCase();
    }

    // فیلتر بر اساس جستجو (Query)
    if (params.query) {
      where.OR = [
        { businessName: { contains: params.query, mode: "insensitive" } },
        { address: { contains: params.query, mode: "insensitive" } },
        { description: { contains: params.query, mode: "insensitive" } },
      ];
    }

    // دریافت تعداد کل برای محاسبه صفحات (Meta data)
    const totalCount = await prisma.business.count({ where });

    // دریافت داده‌های صفحه جاری
    const businesses = await prisma.business.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // محاسبه تعداد کل صفحات
    const totalPages = Math.ceil(totalCount / limit);
    return {
      success: true,
      data: businesses,
      meta: {
        currentPage,
        totalPages,
        totalCount,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    };
  } catch (error) {
    console.error("Fetch Business Error:", error);
    return { success: false, error: "خطا در دریافت اطلاعات" };
  }
}

export async function getBusinessBySlugAction(id: string) {
  try {
    const business = await prisma.business.findUnique({
      where: {
        id,
        isActive: true,
        deletedAt: null,
      },
      include: {
        favorites: true,
        services: {
          where: {
            isActive: true,
            businessId: {
              equals: id,
            },
          },
          orderBy: { price: "asc" },
        },
        // آوردن پرسنل برای نمایش آواتار در بخش زمان‌ها (اختیاری)
        staffMembers: {
          where: { isActive: true },
          select: { id: true, name: true, avatar: true },
          take: 3, // فقط چند نفر اول برای نمونه
        },
      },
    });

    if (!business) {
      return { success: false, error: "کسب‌وکار یافت نشد" };
    }

    return { success: true, data: business };
  } catch (error) {
    console.error("Fetch Business Detail Error:", error);
    return { success: false, error: "خطا در بارگذاری اطلاعات" };
  }
}

export type Slot = {
  time: string;
  status: "available" | "busy";
  staffCount: number;
};

export async function getAvailableSlotsAction(params: {
  businessId: string;
  serviceId: string;
  date: string; // فرمت YYYY-MM-DD
}) {
  const { businessId, serviceId, date } = params;

  try {
    // 1. دریافت اطلاعات سرویس
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { duration: true, staff: true },
    });

    if (!service) throw new Error("Service not found");
    const serviceDuration = service.duration;

    // 2. دریافت پرسنل فعال مرتبط
    const staffList = await prisma.staffMember.findMany({
      where: {
        businessId: businessId,
        isActive: true,
        deletedAt: null,
        services: { some: { serviceId: serviceId } },
      },
      include: {
        schedules: true,
        exceptions: true,
        bookings: {
          where: {
            // فیلتر بر اساس تاریخ دقیق برای جلوگیری از مشکل تایم‌زون
            // مبدیل تاریخ ورودی (String) به رنج دقیق دیتابیس
            startTime: {
              gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
              lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
            },
            status: { in: ["AWAITING_CONFIRMATION", "CONFIRMED"] },
          },
          select: { startTime: true, endTime: true },
        },
      },
    });

    if (staffList.length === 0) {
      return { success: true, slots: [] };
    }

    const globalSlots: { [key: string]: number } = {};

    // ساعت‌های کاری پیش‌فرض سیستم (می‌توانید از تنظیمات بیزنس هم بخوانید)
    const START_HOUR = 8;
    const END_HOUR = 22;
    const SLOT_INTERVAL = 30;

    // تبدیل تاریخ ورودی به شمسی برای نمایش یا منطق داخلی اگر نیاز بود (اینجا از گریگوری استفاده می‌کنیم برای محاسبه)
    const dateObj = new Date(date);

    // --- FIX: تبدیل روز هفته جاوااسکریپت به دیتابیس ---
    // JS: Sun=0, Mon=1, ..., Sat=6
    // DB:  Sat=0, Sun=1, ..., Fri=6
    const jsDayOfWeek = dateObj.getDay();
    const dbDayOfWeek = (jsDayOfWeek + 1) % 7;

    for (const staff of staffList) {
      // الف) بررسی تعطیلی روزانه (StaffException)
      // نرمال‌سازی تاریخ به رشته برای مقایسه ایمن
      const exceptionDateStr = dateObj.toISOString().split("T")[0];

      const isOffToday = staff.exceptions.some((exc) => {
        const excDateStr = new Date(exc.date).toISOString().split("T")[0];
        return exc.isClosed && excDateStr === exceptionDateStr;
      });

      if (isOffToday) continue;

      // ب) پیدا کردن شیفت امروز پرسنل
      const schedule = staff.schedules.find((s) => s.dayOfWeek === dbDayOfWeek);

      if (!schedule || schedule.isClosed) continue;

      // محدوده شیفت
      const [shiftStartH, shiftStartM] = schedule.startTime
        .split(":")
        .map(Number);
      const [shiftEndH, shiftEndM] = schedule.endTime.split(":").map(Number);

      const shiftStartMin = shiftStartH * 60 + shiftStartM;
      const shiftEndMin = shiftEndH * 60 + shiftEndM;

      // ج) تولید اسلات‌ها
      for (
        let timeMin = shiftStartMin;
        timeMin + serviceDuration <= shiftEndMin;
        timeMin += SLOT_INTERVAL
      ) {
        const slotTimeString = `${String(Math.floor(timeMin / 60)).padStart(
          2,
          "0",
        )}:${String(timeMin % 60).padStart(2, "0")}`;

        const potentialStart = new Date(`${date}T${slotTimeString}:00`);
        const potentialEnd = new Date(
          potentialStart.getTime() + serviceDuration * 60000,
        );

        const isBooked = staff.bookings.some((booking) => {
          const existingStart = new Date(booking.startTime);
          const existingEnd = new Date(booking.endTime);
          return potentialStart < existingEnd && potentialEnd > existingStart;
        });

        if (!isBooked) {
          globalSlots[slotTimeString] = (globalSlots[slotTimeString] || 0) + 1;
        }
      }
    }

    const sortedSlots = Object.entries(globalSlots)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([time, count]) => ({
        time,
        status: "available" as const,
        staffCount: count,
      }));

    return { success: true, slots: sortedSlots };
  } catch (error) {
    console.error("Get Slots Error:", error);
    return { success: false, error: "خطا در محاسبه زمان‌ها" };
  }
}
