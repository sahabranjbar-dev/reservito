import QuickActions from "./_components/QuickActions";
import StatsOverview from "./_components/StatsOverview";
import UpcomingBookings from "./_components/UpcomingBookings";
import { getDashboardData } from "./_meta/actions";

export default async function CustomerDashboard() {
  const [dashboardData] = await Promise.all([getDashboardData()]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview stats={dashboardData.stats} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <QuickActions />

            <UpcomingBookings
              bookings={dashboardData.upcomingBookings as any}
            />

            {/* <RecentBookings bookings={dashboardData.recentBookings} /> */}
          </div>

          <div className="space-y-8">
            {/* <FavoriteBusinesses favorites={dashboardData.favorites} /> */}

            {/* Recent Activity (Optional) */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                فعالیت اخیر
              </h2>
              <div className="space-y-4">
                {/* Activity items would go here */}
                <p className="text-sm text-gray-500 text-center py-4">
                  هیچ فعالیتی یافت نشد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
