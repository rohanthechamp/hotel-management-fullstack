// import { CircularProgress, LinearProgress } from "@mui/material";
// import Button from "../../ui/Button";
// import FileInput from "../../ui/FileInput";
// import Form from "../../ui/Form";
// import FormRow from "../../ui/FormRow";
// import Input from "../../ui/Input";
// import { useUpdateUser } from "./useUpdateUser";
// import { useRef, useState } from "react";
// // import toast from "react-hot-toast";
// import { showWarning } from "../../ui/ToastWarning";
// import LoadingSkeleton from "../../ui/LoadingSkeleton";
// import { getError } from "../../utils/helpers";

// function UpdateUserDataForm({ UserData, isLoading1, error1 }) {

//   const { isUpdating, updateUserMutate } = useUpdateUser();
//   const inputRef = useRef(null);
//   const [flag, setFlag] = useState(false); // For one-time toast
//   const newError = getError(error1, 'Error ')

//   if (isLoading1) {
//     return (
//       <LoadingSkeleton />
//     );
//   }
//   if (error1)

//     return (
//       <Alert severity="error">
//         Failed to load data: {newError}
//       </Alert>
//     );


//   const handleDisabledHover = (fieldName) => {
//     if (!flag) {
//       setFlag(true);
//       showWarning(`You are not allowed to edit ${fieldName}`);

//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const form = new FormData(e.target);
//     updateUserMutate(form);
//   };

//   return (
//     <Form onSubmit={handleSubmit}>
//       {/* Email (disabled) */}
//       <FormRow label="Email address">
//         <div
//           onMouseEnter={() => handleDisabledHover("email")}
//           style={{ display: "inline-block", width: "100%" }}
//         >
//           <Input
//             defaultValue={UserData?.email}
//             ref={inputRef}
//             disabled
//             style={{ cursor: "not-allowed" }}
//           />
//         </div>
//       </FormRow>

//       {/* Full name */}
//       <FormRow label="Full name">
//         <Input type="text" name="name" defaultValue={UserData?.name} />
//       </FormRow>

//       {/* Avatar */}
//       <FormRow label="Avatar image">
//         <FileInput id="photo" name="photo" accept="image/*" />
//       </FormRow>

//       {/* Buttons */}
//       <FormRow>
//         <Button type="reset" variation="secondary">
//           Cancel
//         </Button>
//         <Button disabled={isUpdating}>Update account</Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default UpdateUserDataForm;
import { useRef, useState } from "react";
import { Alert } from "@mui/material";
import { User, Mail, Image as ImageIcon, Save, XCircle, ShieldAlert } from "lucide-react";
import styled from "styled-components";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUpdateUser } from "./useUpdateUser";
import { showWarning } from "../../ui/ToastWarning";
import LoadingSkeleton from "../../ui/LoadingSkeleton";
import { getError } from "../../utils/helpers";

// --- NEON DARK UI COMPONENTS ---
const FormWrapper = styled.div`
  background-color: #1a1c22;
  border-radius: 32px;
  padding: 40px;
  border-left: 4px solid #ec4899; /* Neon Pink accent from your image */
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
  background-color: ${(props) => (props.disabled ? "#14161a" : "#262930")};
  border: 1px solid ${(props) => (props.disabled ? "#2b2f38" : "#3a404c")};
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
  color: ${(props) => (props.disabled ? "#4a5568" : "#ec4899")};
`;

const ActionArea = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #3a404c;
`;

function UpdateUserDataForm({ UserData, isLoading1, error1 }) {
  const { isUpdating, updateUserMutate } = useUpdateUser();
  const inputRef = useRef(null);
  const [flag, setFlag] = useState(false); 
  const newError = getError(error1, 'Error ');

  if (isLoading1) return <LoadingSkeleton />;
  
  if (error1)
    return (
      <Alert severity="error" sx={{ borderRadius: '16px', mt: 2 }}>
        Failed to load data: {newError}
      </Alert>
    );

  const handleDisabledHover = (fieldName) => {
    if (!flag) {
      setFlag(true);
      showWarning(`You are not allowed to edit ${fieldName}`);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    updateUserMutate(form);
  };

  return (
    <FormWrapper>
      <StyledHeader>
        <Title>
          <User size={28} style={{ color: '#ec4899' }} />
          Account Settings
        </Title>
      </StyledHeader>

      <Form onSubmit={handleSubmit}>
        {/* Email (disabled) */}
        <FormRow label="Email address">
          <div
            onMouseEnter={() => handleDisabledHover("email")}
            style={{ display: "inline-block", width: "100%" }}
          >
            <InputContainer disabled>
              <IconBox disabled>
                <Mail size={18} />
              </IconBox>
              <Input
                defaultValue={UserData?.email}
                ref={inputRef}
                disabled
                style={{ 
                    cursor: "not-allowed", 
                    backgroundColor: 'transparent', 
                    border: 'none',
                    color: '#606d80'
                }}
              />
              <ShieldAlert size={18} style={{ marginRight: '16px', color: '#3a404c' }} />
            </InputContainer>
          </div>
        </FormRow>

        {/* Full name */}
        <FormRow label="Full name">
          <InputContainer>
            <IconBox>
              <User size={18} />
            </IconBox>
            <Input 
                type="text" 
                name="name" 
                defaultValue={UserData?.name} 
                style={{ backgroundColor: 'transparent', border: 'none', color: 'white' }}
            />
          </InputContainer>
        </FormRow>

        {/* Avatar */}
        <FormRow label="Avatar image">
           <InputContainer style={{ padding: '8px' }}>
                <IconBox>
                    <ImageIcon size={18} />
                </IconBox>
                <FileInput 
                    id="photo" 
                    name="photo" 
                    accept="image/*" 
                    style={{ border: 'none', background: 'transparent', color: '#8a94a6' }}
                />
           </InputContainer>
        </FormRow>

        {/* Buttons */}
        <ActionArea>
          <Button 
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
            {isUpdating ? "Updating..." : "Update account"}
          </Button>
        </ActionArea>
      </Form>
    </FormWrapper>
  );
}

export default UpdateUserDataForm;