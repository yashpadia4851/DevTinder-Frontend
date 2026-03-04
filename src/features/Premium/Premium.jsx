import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { APP_URL } from "../../config/constants";
import { useSelector } from "react-redux";

const MembershipCard = ({ type }) => {
  const isGold = type === "gold";
  const user = useSelector((state) => state.user);
  const handlePaymentPurchase = async (type) => {
    const response = await axios.post(
      `${APP_URL}/payment/create`,
      {
        membershipType: type,
        notes: {
          firstName: user?.firstName,
          lastName: user?.lastName,
        },
      },
      { withCredentials: true },
    );

    const { KeyId, amount, currency, orderId, notes } = response.data;
    var options = {
      key: KeyId,
      amount,
      currency,
      name: "DevTinder",
      description: "Connect to the world of developers",
      image: "https://www.codetinder.com/assets/logo-BUcTqIdL.png",
      order_id: orderId,
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: "gaurav.kumar@example.com",
        contact: "+919876543210",
      },
      notes: notes,
      theme: {
        color: "#1F0F33",
      },
    };
    const rzp = window.Razorpay(options);
    rzp.open();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.04 }}
      className="flex flex-col items-center"
    >
      {/* CARD */}
      <div
        className={`relative w-[320px] sm:w-[420px] h-[200px] sm:h-[250px] rounded-3xl shadow-2xl overflow-hidden p-6 text-black ${
          isGold
            ? "bg-linear-to-br from-yellow-300 via-yellow-500 to-yellow-700"
            : "bg-linear-to-br from-slate-200 via-gray-300 to-gray-500"
        }`}
      >
        {/* ✨ Premium Shine Animation (Left Corner → Right) */}
        <motion.div
          initial={{ x: "-150%", y: "-150%" }}
          animate={{ x: "150%", y: "150%" }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          className="absolute w-40 h-96 bg-white/40 rotate-45 blur-xl"
        />

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest">
          {isGold ? "GOLD MEMBERSHIP" : "SILVER MEMBERSHIP"}
        </h2>

        {/* Card Number */}
        <p className="mt-8 text-lg sm:text-xl tracking-widest font-semibold">
          4515 9654 1451 6166
        </p>

        {/* Bottom Info */}
        <div className="flex justify-between mt-8 text-sm font-semibold">
          <div>
            <p>Valid</p>
            <p>30/06</p>
          </div>
          <div>
            <p>Expires</p>
            <p>01/09</p>
          </div>
        </div>
      </div>

      {/* BUY BUTTON */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        className={`mt-6 px-8 py-3 rounded-full text-white font-bold shadow-lg ${
          isGold
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-gray-700 hover:bg-gray-800"
        }`}
        onClick={() => handlePaymentPurchase(isGold ? "gold" : "silver")}
      >
        Buy {isGold ? "Gold" : "Silver"}
      </motion.button>
    </motion.div>
  );
};

const PremiumCards = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      {/* Responsive Layout */}
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <MembershipCard type="silver" />
        <MembershipCard type="gold" />
      </div>
    </div>
  );
};

export default PremiumCards;
