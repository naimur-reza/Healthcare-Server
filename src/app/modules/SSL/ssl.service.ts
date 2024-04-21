import axios from "axios";
import configs from "../../configs";
// import { IPaymentData } from "./ssl.interface";

const initSSLPayment = async (paymentData: any) => {
  const data = {
    store_id: configs.ssl.store_id,
    store_passwd: configs.ssl.store_pass,
    total_amount: paymentData?.amount,
    currency: "BDT",
    tran_id: paymentData?.transactionId, // use unique tran_id for each api call
    success_url: configs.ssl.success_url,
    fail_url: configs.ssl.failed_url,
    cancel_url: configs.ssl.cancel_url,
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "N/A",
    product_name: "Service.",
    product_category: "Health-Care",
    product_profile: "general",
    cus_name: paymentData.name,
    cus_email: paymentData.email,
    cus_add1: paymentData.address,
    cus_add2: paymentData.address,
    cus_city: paymentData.address,
    cus_state: paymentData.address,
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: paymentData.contactNumber,
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
    url: configs.ssl.ssl_payment_api,
    data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return res;
};

export const sslService = {
  initSSLPayment,
};
