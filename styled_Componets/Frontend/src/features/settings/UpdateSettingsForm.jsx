// import { updateSetting } from "../../services/apiSettings";
// import { Button } from "@mui/material";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useSetting } from "./useSetting";
import useUpdateSettings from "./useUpdateSettings";

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

  const { isUpdating, updateSettingsMutate } = useUpdateSettings()

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    // extra 
    const payload = { 
      minBookingLength: Number(formData.get("minBookingLength")),
      maxBookingLength: Number(formData.get("maxBookingLength")),
      minGuestsPerBooking: Number(formData.get("minGuestsPerBooking")),
      breakfastPrice: Number(formData.get("breakfastPrice")),
    };
    updateSettingsMutate({id, payload})
  }

  if (isLoading  ) return <Spinner />;
  return (
    <Form onSubmit={handleOnSubmit}>
      <FormRow label="Minimum nights/booking">
        <Input type="number" id="min-nights" name="minBookingLength" defaultValue={minBookingLength} />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input type="number" id="max-nights" name="maxBookingLength" defaultValue={maxBookingLength} />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="min-guests"
          name="minGuestsPerBooking"
          defaultValue={minGuestsPerBooking}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          name="breakfastPrice"
          defaultValue={breakfastPrice}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" variation="secondary" >
          Cancel
        </Button>
        <Button disabled={isUpdating} >Update settings</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
