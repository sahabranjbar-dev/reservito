export const getFarsiLabel = (pathname: string) => {
  let label = "";
  switch (true) {
    case pathname.startsWith("/dashboard/customer"):
      label = "کاربر";
      break;
    case pathname.startsWith("/dashboard/business"):
      label = "کسب‌وکار";
      break;
    case pathname.startsWith("/dashboard/admin"):
      label = "ادمین";
      break;
    case pathname.startsWith("/dashboard/staff"):
      label = "همکار";
      break;

    default:
      break;
  }

  return label;
};

export const getEnglishLabel = (pathname: string) => {
  let label = "";
  switch (true) {
    case pathname.startsWith("/dashboard/customer"):
      label = "customer";
      break;
    case pathname.startsWith("/dashboard/business"):
      label = "business";
      break;
    case pathname.startsWith("/dashboard/admin"):
      label = "admin";
      break;
    case pathname.startsWith("/dashboard/staff"):
      label = "staff";
      break;

    default:
      break;
  }

  return label;
};
