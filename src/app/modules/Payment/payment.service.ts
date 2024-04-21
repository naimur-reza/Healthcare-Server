import prisma from "../../shared/prisma";
import { sslService } from "../SSL/ssl.service";
import { PaymentStatus } from "@prisma/client";

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


const validatePayment = async (payload: any) => {
  // if (!payload || !payload.status || !(payload.status === 'VALID')) {
  //     return {
  //         message: "Invalid Payment!"
  //     }
  // }

  // const response = await SSLService.validatePayment(payload);

  // if (response?.status !== 'VALID') {
  //     return {
  //         message: "Payment Failed!"
  //     }
  // }

  const response = payload;

  await prisma.$transaction(async (tx) => {
      const updatedPaymentData = await tx.payment.update({
          where: {
              transactionId: response.tran_id
          },
          data: {
              status: PaymentStatus.PAID,
              paymentGatewayData: response
          }
      });

      await tx.appointment.update({
          where: {
              id: updatedPaymentData.appointmentId
          },
          data: {
              paymentStatus: PaymentStatus.PAID
          }
      })
  });

  return {
      message: "Payment success!"
  }

}


export const paymentService = {
  initPayment,
  validatePayment
};
