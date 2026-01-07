import { CircularProgress, LinearProgress } from "@mui/material";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useCurrentUser } from "./useCurrentUser";
import { useUpdateUser } from "./useUpdateUser";
import { useRef, useState } from "react";
// import toast from "react-hot-toast";
import { showWarning } from "../../ui/ToastWarning";

function UpdateUserDataForm() {
  const { UserData } = useCurrentUser();
  const { isUpdating, updateUserMutate } = useUpdateUser();
  const inputRef = useRef(null);
  const [flag, setFlag] = useState(false); // For one-time toast

  if (!UserData) {
    return (
      <LinearProgress
        sx={{ color: "#26bc0f", zIndex: 1300 }}
      >
        <CircularProgress color="inherit" />
      </LinearProgress>
    );
  }

  const handleDisabledHover = (fieldName) => {
    if (!flag) {
      setFlag(true);
      console.log(`You are not allowed to edit ${fieldName}`);
      showWarning(`You are not allowed to edit ${fieldName}`);
      
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    updateUserMutate(form);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Email (disabled) */}
      <FormRow label="Email address">
        <div
          onMouseEnter={() => handleDisabledHover("email")}
          style={{ display: "inline-block", width: "100%" }}
        >
          <Input
            defaultValue={UserData?.email}
            ref={inputRef}
            disabled
            style={{ cursor: "not-allowed" }}
          />
        </div>
      </FormRow>

      {/* Full name */}
      <FormRow label="Full name">
        <Input type="text" name="name" defaultValue={UserData?.name} />
      </FormRow>

      {/* Avatar */}
      <FormRow label="Avatar image">
        <FileInput id="photo" name="photo" accept="image/*" />
      </FormRow>

      {/* Buttons */}
      <FormRow>
        <Button type="reset" variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
