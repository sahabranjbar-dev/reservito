import ListContainer from "@/container/ListContainer/ListContainer";
import React from "react";
import ServicesHeader from "./_components/ServicesHeader";
import ServicesList from "./_components/ServicesList";

const ServicesPage = () => {
  return (
    <ListContainer queryKey={["services"]} url="/admin/services">
      <ServicesHeader />
      <ServicesList />
    </ListContainer>
  );
};

export default ServicesPage;
