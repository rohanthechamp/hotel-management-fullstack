// import React, { useState } from "react";
// import Button from "../../ui/Button";
// import Form from "../../ui/Form";
// import FormRow from "../../ui/FormRow";
// import Input from "../../ui/Input";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import { sendInvite } from "../../services/apiUser";
// import { getError } from "../../utils/helpers";

// const InviteStaff = () => {
//     const [isSending, setIsSending] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();

//     const onSubmit = async (data) => {
//         try {
//             setIsSending(true);

//             const resData = await sendInvite(data.email);
//             const msg = resData.message || '"Invite sent successfully"'

//             toast.success(msg);
//             reset();
//         } catch (error) {
//             const errorMsg = getError(error,"Error while creating invite");

//             toast.error(errorMsg);
//         } finally {
//             setIsSending(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
//             <div className="w-full max-w-lg bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">

//                 {/* HEADER */}
//                 <div className="mb-8 text-center">
//                     <div className="flex justify-center mb-4">
//                         <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
//                             Admin Panel
//                         </div>
//                     </div>

//                     <h1 className="text-3xl font-semibold text-white">
//                         Invite Staff Member
//                     </h1>

//                     <p className="text-gray-400 mt-2 text-sm">
//                         Send an invitation to add a new team member
//                     </p>
//                 </div>

//                 {/* FORM */}
//                 <Form onSubmit={handleSubmit(onSubmit)}>

//                     <FormRow label="Staff Email" error={errors?.email?.message}>
//                         <Input
//                             type="email"
//                             id="email"
//                             placeholder="example@hotel.com"
//                             className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
//                             {...register("email", {
//                                 required: "Email is required",
//                                 pattern: {
//                                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//                                     message: "Invalid email address",
//                                 },
//                             })}
//                         />
//                     </FormRow>

//                     {/* BUTTON */}
//                     <div className="mt-6">
//                         <Button disabled={isSending} className="w-full">
//                             {isSending ? "Sending Invite..." : "Send Invite"}
//                         </Button>
//                     </div>

//                 </Form>

//                 {/* FOOTER */}
//                 <div className="mt-6 text-center text-gray-500 text-sm">
//                     The user will receive a secure invite link via email
//                 </div>

//             </div>
//         </div>
//     );
// };

// export default InviteStaff;
import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Mail, UserPlus, Send, Sparkles, Shield } from "lucide-react";
import { sendInvite } from "../../services/apiUser";
import { getError } from "../../utils/helpers";

// --- ANIMATIONS ---
const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.2); }
  50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.4); }
  100% { box-shadow: 0 0 5px rgba(236, 72, 153, 0.2); }
`;

// --- STYLED COMPONENTS ---
const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0f1115; /* Deep Obsidian */
  padding: 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 500px;
  background-color: #1a1c22; /* Card Background */
  border-radius: 32px;
  padding: 40px;
  position: relative;
  border-top: 4px solid #ec4899; /* Vibrant Pink Top Border from image */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
  }
`;

const IconHeader = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #6b21a8 0%, #ec4899 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 10px 20px rgba(107, 33, 168, 0.3);
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ec4899;
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  color: white;
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #8a94a6;
  font-size: 14px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const InputGroup = styled.div`
  background-color: #262930;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #3a404c;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #ec4899;
    background-color: #2b2f38;
  }
`;

const Label = styled.label`
  display: block;
  color: #606d80;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  padding: 12px 12px 12px 40px;
  outline: none;

  &::placeholder {
    color: #4a5568;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  margin-top: 32px;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: linear-gradient(90deg, #6b21a8 0%, #ec4899 100%);
  color: white;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${glow} 3s infinite ease-in-out;

  &:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    animation: none;
  }
`;

const FooterText = styled.p`
  margin-top: 32px;
  color: #4a5568;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

// --- MAIN COMPONENT ---
const InviteStaff = () => {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSending(true);
      const resData = await sendInvite(data.email);
      toast.success(resData.message || "Invite sent successfully");
      reset();
    } catch (error) {
      toast.error(getError(error, "Error while creating invite"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageWrapper>
      <FormCard>
        <div style={{ textAlign: "center" }}>
          <IconHeader>
            <UserPlus size={36} strokeWidth={2} />
          </IconHeader>

          <Badge>
            <Sparkles size={12} />
            Administrator Access
          </Badge>

          <Title>Invite Staff</Title>
          <Subtitle>
            Send a secure invitation link to your team members to grant them dashboard access.
          </Subtitle>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>Recipient Email Address</Label>
            <InputWrapper>
              <Mail
                size={20}
                style={{ position: "absolute", left: "10px", color: "#ec4899" }}
              />
              <StyledInput
                type="email"
                placeholder="sarah.johnson@hotel.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
            </InputWrapper>
            {errors?.email && (
              <span style={{ color: "#e11d48", fontSize: "11px", fontWeight: "700", marginTop: "8px", display: "block" }}>
                {errors.email.message}
              </span>
            )}
          </InputGroup>

          <SubmitButton type="submit" disabled={isSending}>
            {isSending ? (
              "Sending Invitation..."
            ) : (
              <>
                Send Invite <Send size={18} />
              </>
            )}
          </SubmitButton>
        </form>

        <FooterText>
          <Shield size={14} /> Encrypted Invitation Link
        </FooterText>
      </FormCard>
    </PageWrapper>
  );
};

export default InviteStaff;

// class SendInviteEmailView(APIView):     permission_classes = [IsAuthenticated]      def post(self, request):         if request.user.role != "Admin":             return Response({"error": "Only admin allowed"}, status=403)          email = request.data.get("email")          invite = HotelInvite.objects.create(             hotel=request.user.hotel,             email=email,             expires_at=timezone.now() + timedelta(days=2),         )          invite_link = f"http://localhost:5173/invitatoin_link/join?code={invite.code}"          send_invite_email_task.delay(email, invite_link, request.user.hotel.name)          return Response({"message": "Invite sent", "expiry_time": invite.expires_at})                 i think we shudl get back expire timme of that code accordinng to that we show invited sended now pending and it expried before this expriey time after that we will show resend invite and this should happing in parent componet where we will be showing hotel pending invite via getting all the pending invites via our get_pending_invites api where we checking current admin user id   -Hotelinvite.Objects. filter(hotel__admin__id=curr_admin id provided via fronted to get all pending iv ).filter( is_used = false && created_at=< 2 days ).vlues('email")                        and from 