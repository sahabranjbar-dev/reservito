import { authOptions } from "@/utils/authOptions";
import prisma from "@/utils/prisma";
import { getServerSession } from "next-auth";

export async function getFavoritesData() {
  const session = await getServerSession(authOptions);

  const userId = session?.user.id;
  const [
    favoriteBusinesses,
    // Note: In your current schema, we only have Business favorites
    // We need to extend the schema for services, staff, and comments favorites
    // For now, I'll provide mock data
    favoriteServices,
    favoriteStaff,
    stats,
  ] = await Promise.all([
    // Favorite Businesses
    prisma.favorite.findMany({
      where: { userId },
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            businessType: true,
            description: true,
            logo: true,
            banner: true,
            address: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),

    // Mock favorite services (you need to add this to your schema)
    Promise.resolve([
      {
        id: "1",
        name: "کوتاهی مو مردانه",
        description: "کوتاهی حرفه‌ای مو با بهترین وسایل",
        price: 50000,
        duration: 30,
        business: {
          id: "1",
          businessName: "آرایشگاه مردانه VIP",
          logo: null,
        },
        rating: 4.8,
        isAvailable: true,
      },
      {
        id: "2",
        name: "ماساژ صورت",
        description: "ماساژ تخصصی صورت با روغن‌های طبیعی",
        price: 120000,
        duration: 60,
        business: {
          id: "2",
          businessName: "سالن زیبایی گلنار",
          logo: null,
        },
        rating: 4.9,
        isAvailable: true,
      },
    ]),

    // Mock favorite staff (you need to add this to your schema)
    Promise.resolve([
      {
        id: "1",
        name: "علی محمدی",
        avatar: null,
        specialty: "آرایشگر حرفه‌ای",
        experience: "8 سال",
        rating: 4.9,
        business: {
          id: "1",
          businessName: "آرایشگاه مردانه VIP",
        },
        isAvailable: true,
        nextAvailableSlot: new Date(Date.now() + 86400000),
      },
      {
        id: "2",
        name: "فاطمه کریمی",
        avatar: null,
        specialty: "متخصص پوست و مو",
        experience: "12 سال",
        rating: 4.7,
        business: {
          id: "2",
          businessName: "سالن زیبایی گلنار",
        },
        isAvailable: false,
      },
    ]),

    // Stats
    prisma.$transaction([
      prisma.favorite.count({
        where: { userId },
      }),
      // Add counts for services, staff, comments when schema is extended
    ]),
  ]);

  return {
    businesses: favoriteBusinesses.map((f) => ({
      ...f.business,
      rating: 4.5, // Mock - add rating to Business model
      reviewCount: 24, // Mock - add review count
      isOpen: true, // Mock - add business hours
    })),
    services: favoriteServices,
    staff: favoriteStaff,
    stats: {
      businesses: stats[0],
      services: 8, // Mock
      staff: 3, // Mock
      comments: 1, // Mock
    },
  };
}
