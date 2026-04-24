// import { useForm } from "react-hook-form";
// import Button from "../../ui/Button";
// import Form from "../../ui/Form";
// import FormRow from "../../ui/FormRow";
// import Input from "../../ui/Input";
// import { useUpdatePassword } from "./useUpdatePassword";

// // import { useUpdateUser } from "./useUpdateUser";

// function UpdatePasswordForm() {
//   const { register, handleSubmit, formState, getValues, reset } = useForm();
//   const { errors } = formState;

//   const { updateUserMutate, isUpdating } = useUpdatePassword();

//   function onSubmit({ password }) {
//     if (password) console.log('Password is present ********')
//     updateUserMutate(password , { onSuccess: reset() });
//   }

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)}>
//       <FormRow
//         label="Password (min 8 characters)"
//         error={errors?.password?.message}
//       >
//         <Input
//           type="password"
//           id="password"
//           autoComplete="current-password"
//           // disabled={}
//           {...register("password", {
//             required: "This field is required",
//             minLength: {
//               value: 8,
//               message: "Password needs a minimum of 8 characters",
//             },
//           })}
//         />
//       </FormRow>

//       <FormRow
//         label="Confirm password"
//         error={errors?.passwordConfirm?.message}
//       >
//         <Input
//           type="password"
//           autoComplete="new-password"
//           id="passwordConfirm"
//           // disabled={}
//           {...register("passwordConfirm", {
//             required: "This field is required",
//             validate: (value) =>
//               getValues().password === value || "Passwords need to match",
//           })}
//         />
//       </FormRow>
//       <FormRow>
//         <Button onClick={reset} type="reset" variation="secondary">
//           Cancel
//         </Button>
//         <Button
//           disabled={isUpdating}

//         >Update password</Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default UpdatePasswordForm;
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { Lock, ShieldCheck, KeyRound, XCircle, Save } from "lucide-react";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdatePassword } from "./useUpdatePassword";

// --- NEON DARK UI COMPONENTS ---
const FormWrapper = styled.div`
  background-color: #1a1c22;
  border-radius: 32px;
  padding: 40px;
  border-left: 4px solid #ec4899; /* The signature pink accent from your dashboard */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 850px;
  margin: 0 auto;
`;

const StyledHeader = styled.div`
  margin-bottom: 32px;
  border-bottom: 1px solid #3a404c;
  padding-bottom: 20px;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background-color: #262930;
  border: 1px solid #3a404c;
  border-radius: 16px;
  width: 100%;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #ec4899;
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.2);
  }
`;

const IconBox = styled.div`
  padding: 0 16px;
  color: #ec4899;
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #3a404c;
`;

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, getValues, reset } = useForm();
  const { errors } = formState;

  const { updateUserMutate, isUpdating } = useUpdatePassword();

  function onSubmit({ password }) {
    if (password) console.log('Password is present ********')
    updateUserMutate(password , { onSuccess: () => reset() });
  }

  return (
    <FormWrapper>
      <StyledHeader>
        <Title>
          <KeyRound size={28} style={{ color: '#ec4899' }} />
          Security & Password
        </Title>
      </StyledHeader>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label="New Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <InputContainer>
            <IconBox>
              <Lock size={18} />
            </IconBox>
            <Input
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: 'white',
                width: '100%' 
              }}
              {...register("password", {
                required: "This field is required",
                minLength: {
                  value: 8,
                  message: "Password needs a minimum of 8 characters",
                },
              })}
            />
          </InputContainer>
        </FormRow>

        <FormRow
          label="Confirm New Password"
          error={errors?.passwordConfirm?.message}
        >
          <InputContainer>
            <IconBox>
              <ShieldCheck size={18} />
            </IconBox>
            <Input
              type="password"
              autoComplete="new-password"
              id="passwordConfirm"
              placeholder="••••••••"
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: 'white',
                width: '100%' 
              }}
              {...register("passwordConfirm", {
                required: "This field is required",
                validate: (value) =>
                  getValues().password === value || "Passwords need to match",
              })}
            />
          </InputContainer>
        </FormRow>

        <ActionArea>
          <Button 
            onClick={reset} 
            type="reset" 
            variation="secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <XCircle size={18} />
            Cancel
          </Button>
          
          <Button
            disabled={isUpdating}
            style={{ 
              background: 'linear-gradient(90deg, #6b21a8 0%, #ec4899 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 20px rgba(236, 72, 153, 0.2)'
            }}
          >
            <Save size={18} />
            {isUpdating ? "Saving Changes..." : "Update password"}
          </Button>
        </ActionArea>
      </Form>
    </FormWrapper>
  );
}

export default UpdatePasswordForm;