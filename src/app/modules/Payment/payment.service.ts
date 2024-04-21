import axios from "axios";
import configs from "../../configs";
import prisma from "../../shared/prisma";
import { sslService } from "../SSL/ssl.service";
import { IPaymentData } from "../SSL/ssl.interface";
import { app } from "../../../app";

const initPayment = async (appointmentId: string) => {
  const appointmentData = await prisma.appointment.findFirstOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      patient: true,
      payment: true,
    },
  });

  const { patient, payment } = appointmentData;

  const SSLPaymentData = {
    name: patient.name,
    amount: appointmentData.payment?.amount,
    address: patient.address,
    contactNumber: patient.contactNumber,
    email: patient.email,
    transactionId: payment?.transactionId,
  };

  const result = await sslService.initSSLPayment(SSLPaymentData);

  return result.data.redirectGatewayURL;
};

export const paymentService = {
  initPayment,
};
