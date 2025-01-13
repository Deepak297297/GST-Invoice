import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import axios from "axios";

admin.initializeApp();

export const generateGSTInvoice = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();

    if (beforeData.status !== "finished" && afterData.status === "finished") {
      const { name, totalBookingAmount } = afterData;

      const GST_RATE = 18;

      try {
        const apiResponse = await axios.get(
          "https://gst-invoice-taupe.vercel.app/api"
        );
        console.log("GST API Response:", apiResponse.data);
        GST_RATE = apiResponse.data.gstPercentage;
      } catch (error) {
        console.error("Error filing GST:", error.message);
      }

      const gstAmount = (totalBookingAmount * GST_RATE) / 100;
      const cgst = gstAmount / 2;
      const sgst = gstAmount / 2;

      const invoice = {
        name,
        totalBookingAmount,
        gstAmount,
        cgst,
        sgst,
        totalPayable: totalBookingAmount + gstAmount,
      };

      console.log("Generated Invoice:", invoice);
    }
  });