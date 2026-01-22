"use client";
import { useMutation } from "@tanstack/react-query";
import ServiceForm from "../_components/ServiceForm";
import api from "@/lib/axios";
import { toast } from "sonner";
import { outParser } from "../meta/utils";

const ServiceCreatePage = () => {
  return <ServiceForm />;
};

export default ServiceCreatePage;
