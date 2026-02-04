import prisma from "@/utils/prisma";
import TicketList from "./_components/TicketList.";

const SupportTicketPage = async () => {
  // دریافت تیکت‌ها از سرور
  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return <TicketList data={tickets} />;
};

export default SupportTicketPage;
