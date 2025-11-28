import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import { formDataHandel } from "../../utils/helpers";
// Email regex: /\S+@\S+\.\S+/

function SignupForm() {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues

  } = useForm();  // initialized form useform library

  const onSubmit = (data) => {
    // console.log(data)
// 
    const formdata = formDataHandel(data)
    console.log('register form values - ')
    for (const [k, v] of formdata.entries()) console.log(k, v);

reset()
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} >
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input type="text" id="fullName"    {...register("fullName", { required: "fullName is required" })} disabled={''} />

      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input type="email" id="email"   {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })} />

      </FormRow>
      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
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
        <Button>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
