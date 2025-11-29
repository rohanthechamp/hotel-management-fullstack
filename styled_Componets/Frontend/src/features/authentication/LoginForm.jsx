import {  useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {  useAuth } from "../../services/AuthContext";
function LoginForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { loginUser } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { email: "demo@example.com", password: "demo12345" },
  }); // initialized form useform <library></library>

  const onSubmit = async (data) => {
    if (!data) return;
    setIsSubmitted(true);
    try {
      const response = await loginUser(data);


      const responseMsg = response?.data?.message;
      toast.success(responseMsg);
    } catch (error) {
      let responseError =
        error?.response?.data?.message || "Authentication Fuked ";
      console.log("Error details:", error);
      toast.error(String(responseError));
    } finally {
      reset();
      setIsSubmitted(false);
    }
  };
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
      </FormRow>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long!",
            },
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset">
          Cancel
        </Button>
        <Button disabled={isSubmitted}>
          {isSubmitted ? <p>Login in ...</p> : <p> Create new user</p>}
        </Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;
