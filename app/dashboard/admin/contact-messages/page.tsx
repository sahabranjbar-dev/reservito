import prisma from "@/utils/prisma";
import ContactMessageList from "./_components/ContactMessageList";

const ContactMessagesPage = async () => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return <ContactMessageList data={messages} />;
};

export default ContactMessagesPage;
