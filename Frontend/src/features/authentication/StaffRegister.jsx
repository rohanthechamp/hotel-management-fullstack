import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { createUser } from "../../services/apiUser";
import { useInviteValidation } from "../../hooks/useInviteValidation";
import { getError } from "../../utils/helpers";

function StaffRegister() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    // ✅ FIX: pass params, not string
    const { inviteEmail, hotelName, loading, valid } =
        useInviteValidation(params);




    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        reset,
    } = useForm();

    // ✅ Prefill email safely
    useEffect(() => {
        if (inviteEmail) {
            setValue("email", inviteEmail);
        }
    }, [inviteEmail, setValue]);

    // ✅ Submit
    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);

            const payload = {
                email: data.email,
                name: data.name,
                password: data.password,
                passwordConfirm: data.passwordConfirm,
                invite_code: params.get("code"),
            };

            const res = await createUser(payload);

            toast.success(res?.message || "Account created successfully");

            reset();

            // ✅ instant + clean redirect
            navigate("/login");

        } catch (error) {
              const errorMsg = getError(error,'Registration failed');

      toast.error(errorMsg);
           
        } finally {
            setIsSubmitting(false);
        }
    };

    console.log('inviteEmail, hotelName, loading, valid ',inviteEmail, hotelName, loading, valid )

    // 🔥 LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                    <p className="text-white text-xl font-semibold">
                        Validating your invite
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        Please wait...
                    </p>
                </div>
            </div>
        );
    }

    // 🔥 INVALID INVITE
    if (valid === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <p className="text-red-500 text-2xl font-semibold">
                        Invalid Invite
                    </p>
                    <p className="text-gray-400 mt-3">
                        Contact your admin for a new invite
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
            <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">

                {/* HOTEL INFO */}
                {hotelName && (
                    <div className="mb-6 text-center border-b border-gray-800 pb-4">
                        <p className="text-gray-400 text-sm">You are joining</p>
                        <p className="text-2xl font-bold text-white">{hotelName}</p>
                        <p className="text-green-400 text-sm">✔ Invite Verified</p>
                    </div>
                )}

                {/* HEADER */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-semibold text-white">
                        Create Your Staff Account
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Complete your registration
                    </p>
                </div>

                {/* FORM */}
                <Form onSubmit={handleSubmit(onSubmit)}>

                    <FormRow label="Name" error={errors?.name?.message}>
                        <Input
                            type="text"
                            id="name"
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            {...register("name", { required: "Name is required" })}
                        />
                    </FormRow>

                    <FormRow label="Email" error={errors?.email?.message}>
                        <Input
                            type="email"
                            id="email"
                            disabled={!!inviteEmail}
                            className="bg-gray-800 text-white border-gray-700 focus:border-blue-500"
                            {...register("email", { required: "Email is required" })}
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
                                    value: 6,
                                    message: "Minimum 6 characters",
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
                                    val === getValues("password") ||
                                    "Passwords must match",
                            })}
                        />
                    </FormRow>

                    <div className="flex gap-4 mt-6">
                        <Button variation="secondary" type="reset">
                            Cancel
                        </Button>

                        <Button disabled={isSubmitting}>
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </div>

                    <p className="text-center text-gray-500 text-sm mt-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-400 cursor-pointer hover:underline"
                        >
                            Login here
                        </span>
                    </p>

                </Form>
            </div>
        </div>
    );
}

export default StaffRegister;