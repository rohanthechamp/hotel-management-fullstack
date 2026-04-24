// // import { updateSetting } from "../../services/apiSettings";
// // import { Button } from "@mui/material";
// import Button from "../../ui/Button";
// import Form from "../../ui/Form";
// import FormRow from "../../ui/FormRow";
// import Input from "../../ui/Input";
// import Spinner from "../../ui/Spinner";
// import { useSetting } from "./useSetting";
// import useUpdateSettings from "./useUpdateSettings";

// function UpdateSettingsForm() {
//   const {
//     isLoading,
//     settings: {
//       id,
//       minBookingLength,
//       maxBookingLength,
//       minGuestsPerBooking,
//       breakfastPrice,
//     } = {},
//   } = useSetting();

//   const { isUpdating, updateSettingsMutate } = useUpdateSettings()

//   const handleOnSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     // extra 
//     const payload = { 
//       minBookingLength: Number(formData.get("minBookingLength")),
//       maxBookingLength: Number(formData.get("maxBookingLength")),
//       minGuestsPerBooking: Number(formData.get("minGuestsPerBooking")),
//       breakfastPrice: Number(formData.get("breakfastPrice")),
//     };
//     updateSettingsMutate({id, payload})
//   }

//   if (isLoading  ) return <Spinner />;
//   return (
//     <Form onSubmit={handleOnSubmit}>
//       <FormRow label="Minimum nights/booking">
//         <Input type="number" id="min-nights" name="minBookingLength" defaultValue={minBookingLength} />
//       </FormRow>
//       <FormRow label="Maximum nights/booking">
//         <Input type="number" id="max-nights" name="maxBookingLength" defaultValue={maxBookingLength} />
//       </FormRow>
//       <FormRow label="Maximum guests/booking">
//         <Input
//           type="number"
//           id="min-guests"
//           name="minGuestsPerBooking"
//           defaultValue={minGuestsPerBooking}
//         />
//       </FormRow>
//       <FormRow label="Breakfast price">
//         <Input
//           type="number"
//           id="breakfast-price"
//           name="breakfastPrice"
//           defaultValue={breakfastPrice}
//         />
//       </FormRow>
//       <FormRow>
//         <Button type="reset" variation="secondary" >
//           Cancel
//         </Button>
//         <Button disabled={isUpdating} >Update settings</Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default UpdateSettingsForm;
import styled from "styled-components";
import { Settings, Moon, Sun, Users, Coffee, Save, XCircle } from "lucide-react";

import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSetting } from "./useSetting";
import useUpdateSettings from "./useUpdateSettings";

// --- NEON DASHBOARD UI COMPONENTS ---
const SettingsWrapper = styled.div`
  background-color: #1a1c22;
  border-radius: 32px;
  padding: 40px;
  border-top: 4px solid #6b21a8; /* Deep Purple accent from your image theme */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 900px;
  margin: 0 auto;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid #3a404c;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
`;

const GridFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr; /* Rule: Grid layout for better use of space */
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InputBox = styled.div`
  background-color: #262930;
  border: 1px solid #3a404c;
  border-radius: 16px;
  display: flex;
  align-items: center;
  padding: 4px 16px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #6b21a8;
    box-shadow: 0 0 15px rgba(107, 33, 168, 0.2);
  }
`;

const IconContainer = styled.div`
  color: #6b21a8;
  margin-right: 12px;
  display: flex;
  align-items: center;
`;

const ActionFooter = styled.div`
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #3a404c;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

function UpdateSettingsForm() {
  const {
    isLoading,
    settings: {
      id,
      minBookingLength,
      maxBookingLength,
      minGuestsPerBooking,
      breakfastPrice,
    } = {},
  } = useSetting();

  const { isUpdating, updateSettingsMutate } = useUpdateSettings();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = { 
      minBookingLength: Number(formData.get("minBookingLength")),
      maxBookingLength: Number(formData.get("maxBookingLength")),
      minGuestsPerBooking: Number(formData.get("minGuestsPerBooking")),
      breakfastPrice: Number(formData.get("breakfastPrice")),
    };
    updateSettingsMutate({id, payload});
  }

  if (isLoading) return <Spinner />;

  return (
    <SettingsWrapper>
      <SettingsHeader>
        <Title>
          <Settings size={28} />
          Hotel Operations Settings
        </Title>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#606d80] bg-[#262930] px-3 py-1 rounded-full border border-[#3a404c]">
          Live Updates
        </div>
      </SettingsHeader>

      <Form onSubmit={handleOnSubmit}>
        <GridFields>
          {/* Minimum Nights */}
          <FormRow label={<span className="text-[#8a94a6] text-xs font-bold uppercase tracking-wider">Min nights per booking</span>}>
            <InputBox>
              <IconContainer><Moon size={18} /></IconContainer>
              <Input 
                type="number" 
                name="minBookingLength" 
                defaultValue={minBookingLength} 
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%' }}
              />
            </InputBox>
          </FormRow>

          {/* Maximum Nights */}
          <FormRow label={<span className="text-[#8a94a6] text-xs font-bold uppercase tracking-wider">Max nights per booking</span>}>
            <InputBox>
              <IconContainer><Sun size={18} /></IconContainer>
              <Input 
                type="number" 
                name="maxBookingLength" 
                defaultValue={maxBookingLength} 
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%' }}
              />
            </InputBox>
          </FormRow>

          {/* Max Guests */}
          <FormRow label={<span className="text-[#8a94a6] text-xs font-bold uppercase tracking-wider">Max guests per booking</span>}>
            <InputBox>
              <IconContainer><Users size={18} /></IconContainer>
              <Input
                type="number"
                name="minGuestsPerBooking"
                defaultValue={minGuestsPerBooking}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%' }}
              />
            </InputBox>
          </FormRow>

          {/* Breakfast Price */}
          <FormRow label={<span className="text-[#8a94a6] text-xs font-bold uppercase tracking-wider">Breakfast price ($)</span>}>
            <InputBox>
              <IconContainer><Coffee size={18} /></IconContainer>
              <Input
                type="number"
                name="breakfastPrice"
                defaultValue={breakfastPrice}
                style={{ background: 'transparent', border: 'none', color: 'white', width: '100%' }}
              />
            </InputBox>
          </FormRow>
        </GridFields>

        <ActionFooter>
          <Button type="reset" variation="secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <XCircle size={18} />
            Discard Changes
          </Button>
          <Button 
            disabled={isUpdating} 
            style={{ 
              background: 'linear-gradient(90deg, #6b21a8 0%, #ec4899 100%)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 20px rgba(107, 33, 168, 0.3)'
            }}
          >
            <Save size={18} />
            {isUpdating ? "Saving..." : "Apply Settings"}
          </Button>
        </ActionFooter>
      </Form>
    </SettingsWrapper>
  );
}

export default UpdateSettingsForm;