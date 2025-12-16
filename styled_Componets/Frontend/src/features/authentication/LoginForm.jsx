import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRow from "../../ui/FormRow";

import toast from "react-hot-toast";
import useLogin from "./useLogin";

function LoginForm() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      email: "demo@example.com",
      password: "demo12345",
    },
  });

  const { isLoading, doLogin } = useLogin();
  const navigate = useNavigate();

  const onSubmit = (formData) => {
    if (localStorage.getItem("refreshToken")) {
      return toast.success("You are already logged in");
    }

    doLogin(formData, {
      onSuccess: () => {
        reset();
        navigate("/bookings");
      },
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          disabled={isLoading}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input
          type="password"
          disabled={isLoading}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters" },
          })}
        />
      </FormRow>

      <FormRow>
        <Button type="reset" variation="secondary" disabled={isLoading}>
          Cancel
        </Button>

        <Button disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default LoginForm;


// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// import Button from "../../ui/Button";
// import Form from "../../ui/Form";
// import Input from "../../ui/Input";
// import FormRow from "../../ui/FormRow";

// import axiosClient from "../../services/axiosClient";
// import useAuth from "../../hooks/useAuth";
// import { useNavigate } from "react-router-dom";

// function LoginForm() {
//   const [isLoading, setIsLoading] = useState(false);
//   const { setAuth } = useAuth();
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       email: "demo@example.com",
//       password: "demo12345",
//     },
//   });

//   const persistAuth = ({ access, refresh, username, email }) => {
//     localStorage.setItem("accessToken", access);
//     localStorage.setItem("refreshToken", refresh);
//     localStorage.setItem("username", username);
//     localStorage.setItem("email", email);

//     setAuth({
//       accessToken: access,
//       refreshToken: refresh,
//       username,
//       email,
//       isAuthAuthenticated: true,
//     });
//   };

//   const onSubmit = async (formData) => {
//     // toast.loading('Wait ....')
//     if (localStorage.getItem('refreshToken')) return toast.success('You Already Logged in ')
//     if (isLoading) return;

//     setIsLoading(true);

//     try {
//       const { data } = await axiosClient.post("users/login/", formData);


//       persistAuth({
//         access: data.access,
//         refresh: data.refresh,
//         username: data.username,
//         email: data.email,
//       });

//       toast.success("Logged in successfully");

//       navigate('/bookings ')


//     } catch (error) {
//       const message =
//         error?.response?.data?.detail || "Invalid email or password";

//       toast.error(message);
//     } finally {
//       setIsLoading(false);
//       reset();
//     }
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)}>
//       <FormRow label="Email address" error={errors?.email?.message}>
//         <Input
//           type="email"
//           id="email"
//           disabled={isLoading}
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: "Invalid email address",
//             },
//           })}
//         />
//       </FormRow>

//       <FormRow
//         label="Password (min 8 characters)"
//         error={errors?.password?.message}
//       >
//         <Input
//           type="password"
//           id="password"
//           disabled={isLoading}
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 8,
//               message: "Password must be at least 8 characters long",
//             },
//           })}
//         />
//       </FormRow>

//       <FormRow>
//         <Button type="reset" variation="secondary" disabled={isLoading}>
//           Cancel
//         </Button>

//         <Button disabled={isLoading}>
//           {isLoading ? "Logging in..." : "Login"}
//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default LoginForm;

// import { useState } from "react";
// import Button from "../../ui/Button";
// import Form from "../../ui/Form";
// import Input from "../../ui/Input";
// import FormRow from "../../ui/FormRow";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import axiosClient from "../../services/axiosClient";
// import useAuth from "../../hooks/useAuth";
// import { redirectUser } from "../../utils/helpers";

// function LoginForm() {
//   const [isSubmitted, setIsSubmitted] = useState(false);


//   const { setAuth } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     defaultValues: {
//       email: "demo@example.com",
//       password: "demo12345",
//     },
//   }); // initialized form useform <library></library>

//   const onSubmit = async (data) => {
//     if (!data) return;
//     setIsSubmitted(true);

//     // const response = await loginUser(data);

//     try {
//       // after successful login
//       const res = await axiosClient.post("users/login/", data);



//       const responseData = res?.data || {};

//       console.log("RES DATA- ", res.data);

//       const accessToken = responseData.access;
//       const refreshToken = responseData.refresh;
//       const username = responseData.username;
//       const email = responseData.email;
//       // const message = responseData.message || ''
//       console.log(accessToken, refreshToken, username, email)

//       localStorage.setItem("refreshToken", refreshToken);
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("username", username);
//       // update context with full minimal slice

//       setAuth({
//         accessToken: accessToken,
//         refreshToken: refreshToken,
//         isAuthAuthenticated: true,
//         email: email,
//         username: username
//       })





//       toast.success(`${responseData.message}- Logged in successfully`);

//       setTimeout(() => {
//         redirectUser('redirectAfterLogin')

//       }, 1000)

//     } catch (error) {
//       const serverMessage =
//         error?.response?.data?.detail ||

//         "Authentication failed";

//       console.log('Error Message -', error?.response?.data?.detail);


//       setAuth({
//         accessToken: null,
//         refreshToken: null,
//         username: null,
//         email: null,
//         isAuthAuthenticated: false,
//       });


//       toast.error(String(serverMessage));
//     } finally {
//       reset();
//       setIsSubmitted(false);
//     }
//   };
//   return (
//     <Form onSubmit={handleSubmit(onSubmit)}>
//       <FormRow label="Email address" error={errors?.email?.message}>
//         <Input
//           type="email"
//           id="email"
//           {...register("email", {
//             required: "Email is required",
//             pattern: {
//               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//               message: "Invalid email address",
//             },
//           })}
//         />
//       </FormRow>
//       <FormRow
//         label="Password (min 8 characters)"
//         error={errors?.password?.message}
//       >
//         <Input
//           type="password"
//           id="password"
//           {...register("password", {
//             required: "Password is required",
//             minLength: {
//               value: 8,
//               message: "Password must be at least 8 characters long!",
//             },
//           })}
//         />
//       </FormRow>

//       <FormRow>
//         {/* type is an HTML attribute! */}
//         <Button variation="secondary" type="reset">
//           Cancel
//         </Button>
//         <Button disabled={isSubmitted}>

//           {isSubmitted ? "Logging in..." : "Login"}

//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default LoginForm;
