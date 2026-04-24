// // import React from "react";
// import styled from "styled-components";
// import LoginForm from "../features/authentication/LoginForm";

// /* Optional: you can move these CSS variables to your global stylesheet */
// const Page = styled.main`
//   --bg: #f7f9fc;
//   --card: #ffffff;
//   --muted: #6b7280;
//   --accent-1: #6d28d9;
//   --accent-2: #0ea5a4;
//   --shadow: 0 8px 30px rgba(16, 24, 40, 0.08);
//   --radius: 14px;
//   min-height: 100vh;
//   display: grid;
//   place-items: center;
//   padding: 4rem 1.6rem;
//   background: linear-gradient(180deg, var(--bg) 0%, #ffffff 100%);
//   font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
//     Roboto, "Helvetica Neue", Arial;
//   color: #101828;
// `;

// /* Card that holds form + optional side art */
// const Card = styled.section`
//   width: 100%;
//   max-width: 980px;
//   display: grid;
//   grid-template-columns: 1fr 420px;
//   gap: 2.4rem;
//   background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.95));
//   border-radius: var(--radius);
//   box-shadow: var(--shadow);
//   padding: 2.4rem;
//   align-items: center;
//   overflow: hidden;

//   @media (max-width: 880px) {
//     grid-template-columns: 1fr;
//     padding: 2rem;
//   }
// `;

// /* Left column (headline + form) */
// const Left = styled.div`
//   padding: 0 0.4rem;
// `;

// /* Headline styles */
// const Heading = styled.h1`
//   font-size: 1.6rem;
//   margin: 0 0 0.6rem 0;
//   letter-spacing: -0.02em;
// `;

// const Sub = styled.p`
//   color: var(--muted);
//   margin: 0 0 1.6rem 0;
//   font-size: 0.95rem;
// `;

// /* Right column: illustration / branding */
// const Right = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: linear-gradient(180deg, rgba(109,40,217,0.08), rgba(14,165,164,0.04));
//   border-radius: 12px;
//   padding: 1.6rem;
//   min-height: 220px;

//   @media (max-width: 880px) {
//     order: -1; /* place illustration above on mobile */
//     margin-bottom: 1rem;
//   }
// `;

// /* Simple svg illustration wrapper */
// const Hero = styled.div`
//   width: 100%;
//   max-width: 300px;
//   text-align: center;
//   opacity: 0.98;

//   svg {
//     width: 100%;
//     height: auto;
//     display: block;
//   }

//   p {
//     margin-top: 0.8rem;
//     font-size: 0.9rem;
//     color: var(--muted);
//   }
// `;

// /* Form container to make the inner form feel distinct */
// const FormWrap = styled.div`
//   background: linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.97));
//   padding: 1.2rem;
//   border-radius: 10px;

//   /* Tiny helper: style any direct button inside LoginForm if they are plain DOM buttons */
//   button {
//     border-radius: 10px;
//     padding: 0.9rem 1.2rem;
//     font-weight: 600;
//     cursor: pointer;
//   }

//   /* Error text style if the inner form uses p or .form-error */
//   .form-error,
//   p.form-error {
//     color: #ef4444;
//     font-size: 0.875rem;
//     margin-top: 0.4rem;
//   }

//   /* Small helper links */
//   .form-links {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     margin-top: 0.8rem;
//     font-size: 0.9rem;
//     color: var(--muted);
//   }

//   a {
//     color: var(--accent-1);
//     text-decoration: none;
//     font-weight: 600;
//   }
// `;

// function Login() {
//   return (
//     <Page>
//       <Card>
//         <Left>
//           <Heading>Log in to your account</Heading>
//           <Sub>Welcome back — enter your details to continue.</Sub>

//           <FormWrap>
//             {/* LoginForm should handle email/password inputs + submit */}
//             <LoginForm />

//             <div className="form-links">
//               <a href="/forgot-password">Forgot password?</a>
//               <span>
//                 Don't have an account? <a href="/signup">Sign up</a>
//               </span>
//             </div>
//           </FormWrap>
//         </Left>

//         <Right aria-hidden="true">
//           <Hero>
//             {/* Simple modern SVG — replace or remove as you like */}
//             <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Decorative illustration">
//               <defs>
//                 <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
//                   <stop offset="0" stopColor="#6d28d9" stopOpacity="0.95" />
//                   <stop offset="1" stopColor="#06b6d4" stopOpacity="0.9" />
//                 </linearGradient>
//               </defs>

//               <rect x="0" y="0" width="800" height="600" rx="24" fill="url(#g1)" opacity="0.08" />
//               <g transform="translate(100 60)">
//                 <circle cx="120" cy="120" r="68" fill="#fff" opacity="0.14" />
//                 <rect x="40" y="220" width="260" height="120" rx="18" fill="#fff" opacity="0.12" />
//                 <path d="M60 40c40-28 140-28 180 0v160H60z" fill="#fff" opacity="0.08" />
//               </g>
//             </svg>

//             <p>Secure, fast login — we respect your privacy.</p>
//           </Hero>
//         </Right>
//       </Card>
//     </Page>
//   );
// }

// export default Login;
import styled from "styled-components";
import LoginForm from "../features/authentication/LoginForm";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import HowToRegIcon from "@mui/icons-material/HowToReg";
const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;




const SignUpNotice = styled.div`
  margin-top: 1.6rem;
  padding: 1.2rem 1.6rem;
  border-radius: 12px;

  background: linear-gradient(
    135deg,
    #196262,
    #1f7a7a
  );

  color: #eafafa;
  font-size: 0.95rem;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.2rem;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);

  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
  }
`;



function Login() {
  const navigate = useNavigate();

  return (
    <LoginLayout>
      <Logo />

      <Heading as="h4">Log in to your account</Heading>

      <LoginForm />

      <SignUpNotice>
        <span>
          Not an existing account on our platform?
        </span>

        <Button
          variant="contained"
          startIcon={<HowToRegIcon />}
          onClick={() => navigate("/register")}
          sx={{
            backgroundColor: "#ffffff",
            color: "#196262",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: "10px",
            padding: "0.5rem 1.4rem",
            "&:hover": {
              backgroundColor: "#e0f2f1",
              transform: "translateY(-1px)",
            },
            transition: "all 0.2s ease",
          }}
        >
          Sign Up
        </Button>
      </SignUpNotice>
    </LoginLayout>
  );
}
export default Login;

