import { Button } from "@/components/ui/button";
import { InputOTP } from "@/components/ui/input-otp";
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Otp from "./otp";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateEmail = () => {
    if (!email.length > 0) {
      toast({
        type: "error",
        title: "Email is required",
        duration: 5000,
      });
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      setLoading(true);
      e.preventDefault();
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/sendEmail",
          { email },
          {
            withCredentials: true,
          }
        );
        if (res.data.code === 1) {
          toast({
            type: "success",
            title: "otp sent successfully",
            duration: 5000,
          });
          navigate("/verify-otp",{ state: { email }});
        }
      } catch (error) {
        console.log(error);
        toast({
          type: "error",
          title: error.response.data?.messsage,
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-screen ">
      <fieldset className="border border-opacity-80 p-12 rounded-xl shadow-lg w-full sm:w-[400px]">
        <legend className=" font-semibold text-gray-400 text-2xl mb-6">
          Login
        </legend>
        <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-2xl font-medium text-white"
            >
              Enter Email:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={handleChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md outline-none"
            />
          </div>
          <div className="mt-6">
            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow-md}`}
            >
              {loading ? "loading...." : "Login"}
            </Button>
          </div>
        </form>
      </fieldset>
    </div>
  );
};

export default Auth;
