import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { validateInviteCode } from "../services/apiUser";

export const useInviteValidation = (params) => {
  const invite_code = params.get("code")
  console.log('invite_code',invite_code)
  const [inviteEmail, setInviteEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(null);
  const [hotelName, setHotelName] = useState(null);


  useEffect(() => {
    if (!invite_code) return;
    async function validateInvite() {
      try {
        setLoading(true);
        const data = await validateInviteCode(invite_code);


        if (data.valid) {
          console.log('in useEffect of useInviteValidation ',data,data.valid)
          setInviteEmail(data.email);
          setHotelName(data.hotel_name);

          setLoading(false);
          setValid(true);
        } else {
          setValid(false);
          return toast.error("Invalid or expired invite");
        }
      } catch (error) {
        console.log('in try catch of useInviteValidation ',error?.response?.data)
        setValid(null);
        return toast.error("Invite validation failed");
      } finally {
        setLoading(false);
      }
    }
    validateInvite();
  }, [invite_code]);

  return { inviteEmail, loading, valid, hotelName };
};
