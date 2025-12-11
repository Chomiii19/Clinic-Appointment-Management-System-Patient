import { useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BACKEND_DOMAIN } from "../../configs/config";

import { Eye, EyeClosed } from "lucide-react";

function CustomInput({
  type,
  name,
  placeholder,
  state,
  stateSetter,
}: {
  type: string;
  name: string;
  placeholder?: string;
  state: string;
  stateSetter: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const birthdateRegex =
    /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={};':"\\|,.<>/?]).{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    stateSetter(value);

    if (name === "birthDate") {
      if (!birthdateRegex.test(value)) {
        setError("Use MM/DD/YYYY format.");
      } else {
        setError("");
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setError(
          "Password must be at least 8 characters long, and include a mix of uppercase letters, numbers, and symbols."
        );
      } else {
        setError("");
      }
    }

    if (name === "email") {
      if (!emailRegex.test(value)) {
        setError("Enter a valid email address.");
      } else {
        setError("");
      }
    }
  };

  return (
    <>
      <div className="w-full relative flex flex-row justify-center items-center">
        <input
          type={type !== "password" ? type : showPassword ? "text" : type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={state}
          onChange={handleChange}
          className={`bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out ${
            error ? "border-red-500" : "border-zinc-400"
          }`}
        />

        {type === "password" && (
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            onMouseDown={(e) => e.preventDefault()}
            className="right-2 absolute cursor-pointer"
          >
            {showPassword ? <Eye /> : <EyeClosed />}
          </div>
        )}
      </div>
      <p className="text-red-500 text-xs">{error}</p>
    </>
  );
}

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetCodeInput, setShowResetCodeInput] = useState(false);
  const [showResetPasswordInput, setShowResetPasswordInput] = useState(false);

  const handleInputEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/auth/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setShowResetCodeInput(true);
      setMessage(
        "A reset code was sent to your account's email. Please input the code."
      );
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        const err = e as AxiosError<{ message?: string }>;
        setError(err.response?.data?.message ?? "Login failed.");
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/auth/reset-code`,
        { email, resetCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setShowResetPasswordInput(true);
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        const err = e as AxiosError<{ message?: string }>;
        setError(err.response?.data?.message ?? "Login failed.");
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/auth/reset-password`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setShowResetPasswordInput(true);

      setPasswordMessage("Your password has successfully resetted.");
    } catch (e) {
      console.log(e);
      if (axios.isAxiosError(e)) {
        const err = e as AxiosError<{ message?: string }>;
        setError(err.response?.data?.message ?? "Login failed.");
      } else if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col w-full h-screen bg-system-white overflow-hidden font-manrope">
      <section className="w-full h-full flex items-center">
        <div className="bg-system-white h-full w-full lg:w-1/3 rounded-lg font-roboto text-zinc-900 py-3 px-8 flex flex-col gap-5 items-center justify-center ">
          {showResetPasswordInput ? (
            <div className="w-full">
              <header className="flex flex-col mb-5">
                <img src="/assets/icons/logo.png" className="w-20 mb-2" />
                <h1 className="font-bold text-3xl">Reset Password</h1>
                <h3 className="text-sm mt-2 text-zinc-600">
                  Please enter your account's new password.
                </h3>
              </header>

              <form
                onSubmit={handleResetPassword}
                className="flex flex-col justify-center items-center w-full gap-2"
              >
                <div className="flex flex-col w-full">
                  <label htmlFor="pasword">Password</label>
                  <CustomInput
                    type="password"
                    name="password"
                    placeholder=""
                    state={password}
                    stateSetter={setPassword}
                  />
                </div>

                {passwordMessage && (
                  <p className="text-green-500">{passwordMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-zinc-900 rounded-md w-full py-1.5  text-zinc-200 font-bold justify-center items-center flex mt-3 ${
                    loading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>

                <footer className="w-full py-1 justify-center flex flex-row items-center gap-1 text-zinc-800 text-xs">
                  <p>Resetted your password?</p>{" "}
                  <Link className="text-primary" to={"/login"}>
                    Log in
                  </Link>
                </footer>
              </form>
            </div>
          ) : (
            <div className="w-full">
              <header className="flex flex-col mb-5">
                <img src="/assets/icons/logo.png" className="w-20 mb-2" />
                <h1 className="font-bold text-3xl">Forgotten Password?</h1>
                <h3 className="text-sm mt-2 text-zinc-600">
                  Please enter your account's email and we will send an OTP.
                </h3>
              </header>

              <form
                onSubmit={
                  showResetCodeInput ? handleInputCode : handleInputEmail
                }
                className="flex flex-col justify-center items-center w-full gap-2"
              >
                {showResetCodeInput ? (
                  <div className="flex flex-col w-full">
                    <label htmlFor="resetCode">Reset Code</label>
                    <CustomInput
                      type="text"
                      name="resetCode"
                      placeholder=""
                      state={resetCode}
                      stateSetter={setResetCode}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col w-full">
                    <label htmlFor="email">Email</label>
                    <CustomInput
                      type="email"
                      name="email"
                      placeholder="example@gmail.com"
                      state={email}
                      stateSetter={setEmail}
                    />
                  </div>
                )}

                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-zinc-900 rounded-md w-full py-1.5  text-zinc-200 font-bold justify-center items-center flex mt-3 ${
                    loading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Submit"
                  )}
                </button>

                <footer className="w-full py-1 justify-center flex flex-row items-center gap-1 text-zinc-800 text-xs">
                  <p>Remembered your account?</p>{" "}
                  <Link className="text-primary" to={"/login"}>
                    Log in
                  </Link>
                </footer>
              </form>
            </div>
          )}
        </div>

        <div className="relative h-full hidden lg:flex lg:w-2/3">
          <img
            src="/assets/images/login-bg.png"
            alt="clinic"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 w-1/12 bg-linear-to-r from-system-white  via-transparent to-transparent pointer-events-none" />
          <div className="absolute right-5 bottom-5 w-2/5 bg-primary/80 text-zinc-100 font-medium rounded-xl px-5 text-3xl py-3">
            Log in to create an appointment.
          </div>
        </div>
      </section>
    </main>
  );
}
