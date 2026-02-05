import { IBusinessValues } from "./types";

export const outParser = (values: IBusinessValues) => {
  return {
    ownerFullname: values?.ownerFullname,
    phone: values?.phone,
    password: values?.password,
    businessName: values?.businessName,
    businessType: values?.businessType,
    address: values?.address,
    username: values?.username,
  };
};
