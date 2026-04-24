import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createUserAdmin } from "../../services/apiUser";
import { getError } from "../../utils/helpers";

function AdminSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await createUserAdmin(data);

      toast.success(response?.message || "Account created successfully");
      reset();
      navigate("/login");
    } catch (error) {
      const errorMsg = getError(error);

      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Admin Account
          </h1>
          <p className="text-gray-400 mt-2">Start managing your hotel system</p>
        </div>

        {/* Form */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormRow label="Name" error={errors?.name?.message}>
            <Input
              type="text"
              id="name"
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
              {...register("name", { required: "Name is required" })}
            />
          </FormRow>

          <FormRow label="Email address" error={errors?.email?.message}>
            <Input
              type="email"
              id="email"
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
            />
          </FormRow>

          <FormRow label="Password" error={errors?.password?.message}>
            <Input
              type="password"
              id="password"
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters",
                },
              })}
            />
          </FormRow>

          <FormRow
            label="Confirm Password"
            error={errors?.passwordConfirm?.message}
          >
            <Input
              type="password"
              id="passwordConfirm"
              className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
              {...register("passwordConfirm", {
                required: "Confirm your password",
                validate: (val) =>
                  val === getValues("password") || "Passwords must match",
              })}
            />
          </FormRow>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <Button variation="secondary" type="reset">
              Cancel
            </Button>

            <Button disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default AdminSignupForm;
