import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import { formDataHandel } from "../../utils/helpers";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useAuth } from "../../services/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { createUser } from "../../services/apiUser";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(null);

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm(); // initialized form useform library
  if (formData !== null) console.log("state value", Object.fromEntries(formData))


  useEffect(() => {  // we can change this to simple 
    if (!isSubmitted) return;
    (async () => {
      try {
        const response = await createUser(formData);
        console.log(response)

        toast.success(String(response.message));
        navigate('/login')

      } catch (error) {
        toast.error(`Failed to create user!${error} `);
      } finally {
        setIsSubmitted(false);
        setFormData(null);
      }
    })();
  }, [isSubmitted]);

  const onSubmit = async (data) => {
    console.log('in on submit data', data)
    const value = formDataHandel(data);


    // console.log('in on submit value',value)
    console.log("in on submit value", Object.fromEntries(value))
    setFormData(value);

    setIsSubmitted(true);
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          {...register("name", { required: "name is required" })}
          disabled={""}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
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

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          {...register("passwordConfirm", {
            required: "Password is required to verify",
            validate: (val) => {
              const password = getValues("password");
              return val === password || "Passwords should match!";
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
          {isSubmitted ? <p>Creating New User ...</p> : <p> Create new user</p>}
        </Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
