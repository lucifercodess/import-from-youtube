import { useUser } from "@/context/authContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OTPInput = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState("false");
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email;
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setOtp(value);
    }
  };
  const onVerifyOTP = async (email, otp) => {
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/verifyEmail",
        { email, otp },
        {
          withCredentials: true,
        }
      );

      console.log(res.data.user);
      console.log(res.data.token);
      if (res.status === 200) {
        setUser(res.data.user);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast({
          type: "success",
          title: "Login Successful",
          duration: 5000,
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast({
        type: "error",
        title: error.response.data?.message,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = () => {
    if (otp.length === 6) {
      onVerifyOTP(email, otp);
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-lg w-[300px] text-black">
        <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
        <p className="mb-2">sent on email</p>

        <input
          type="text"
          value={otp}
          onChange={handleChange}
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          className="w-full p-3 mb-4 border border-gray-300 rounded-md outline-none"
        />

        <button
          onClick={handleVerify}
          className="w-full py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default OTPInput;
