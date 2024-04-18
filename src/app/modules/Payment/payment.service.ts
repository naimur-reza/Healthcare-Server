import axios from "axios";
import configs from "../../configs";
import prisma from "../../shared/prisma";

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

  const data = {
    store_id: configs.ssl.store_id,
    store_passwd: configs.ssl.store_pass,
    total_amount: payment?.amount,
    currency: "BDT",
    tran_id: payment?.transactionId, // use unique tran_id for each api call
    success_url: configs.ssl.success_url,
    fail_url: configs.ssl.failed_url,
    cancel_url: configs.ssl.cancel_url,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "N/A",
    product_name: "Service.",
    product_category: "Health-Care",
    product_profile: "general",
    cus_name: patient.name,
    cus_email: patient.email,
    cus_add1: patient.address,
    cus_add2: patient.address,
    cus_city: patient.address,
    cus_state: patient.address,
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: patient.contactNumber,
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };

  const res = await axios({
    method: "POST",
    url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  console.log(res.data);
};

export const paymentService = {
  initPayment,
};
