import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BACKEND_DOMAIN } from "../../configs/config";

import { Eye, EyeClosed } from "lucide-react";

interface AdminFormData {
  firstname: string;
  surname: string;
  maritalStatus: string;
  gender: string;
  birthDate: string;
  address: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

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
  stateSetter: (value: string) => void;
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
      {type === "password" && !error && (
        <p className="text-z-800 text-xs">
          Password must be at least 8 characters long, and include a mix of
          uppercase letters, numbers, and symbols.
        </p>
      )}
    </>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<AdminFormData>({
    firstname: "",
    surname: "",
    maritalStatus: "",
    gender: "",
    birthDate: "",
    address: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "user",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_DOMAIN}/api/v1/auth/signup`,
        formState,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("Signup success:", response.data);

      navigate("/appointments");
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
          <div className="w-full">
            <header className="flex flex-col mb-5">
              <img src="/assets/icons/logo.png" className="w-20 mb-2" />
              <h1 className="font-bold text-3xl">Welcome!</h1>
              <h3 className="text-sm mt-2 text-zinc-600">
                Hello! Please enter your details to create an account.
              </h3>
            </header>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center w-full gap-2"
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex flex-col w-full">
                  <label htmlFor="firstname">
                    Firstname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstname"
                    id="firstname"
                    value={formState.firstname}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        firstname: e.target.value,
                      }))
                    }
                    placeholder="e.g. John"
                    className="bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out border-zinc-400"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="surname">
                    Surname <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="surname"
                    id="surname"
                    value={formState.surname}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        surname: e.target.value,
                      }))
                    }
                    placeholder="e.g. Doe"
                    className="bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out border-zinc-400"
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </label>
                <CustomInput
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  state={formState.email}
                  stateSetter={(value) =>
                    setFormState((prev) => ({ ...prev, email: value }))
                  }
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="e.g. Doe"
                  className="bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out border-zinc-400"
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="birthDate">
                  Birth Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="birthDate"
                  id="birthDate"
                  value={formState.birthDate}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      birthDate: e.target.value,
                    }))
                  }
                  className="bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out border-zinc-400"
                />
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="address">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formState.address}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="e.g. Blk Lot, Street, City, Province"
                  className="bg-white border rounded-md outline-none px-2 py-0.5 focus:border-primary transition-colors duration-150 w-full  ease-in-out border-zinc-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full">
                <div className="flex flex-col w-full">
                  <label htmlFor="gender">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="gender"
                    id="gender"
                    value={formState.gender}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
                    className="border border-zinc-400 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="maritalStatus">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    name="maritalStatus"
                    id="maritalStatus"
                    value={formState.maritalStatus}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        maritalStatus: e.target.value,
                      }))
                    }
                    className="border border-zinc-400 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
                  >
                    <option value="" disabled>
                      Select Marital
                    </option>
                    <option value="single">Single</option>
                    <option value="widowed">Widowed</option>
                    <option value="married">Married</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col w-full">
                <div className="w-full flex flex-row justify-between items-center">
                  <label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Link
                    className="text-zinc-900 text-sm"
                    to={"/forgot-password"}
                  >
                    Forgot Password?
                  </Link>
                </div>
                <CustomInput
                  type="password"
                  name="password"
                  placeholder=""
                  state={formState.password}
                  stateSetter={(value) =>
                    setFormState((prev) => ({ ...prev, password: value }))
                  }
                />
              </div>

              <div className="flex flex-row items-center gap-1 w-full">
                <input
                  type="checkbox"
                  name="rememberMe"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="text-sm">
                  Remember me
                </label>
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={`bg-zinc-900 rounded-md w-full py-1.5  text-zinc-200 font-bold justify-center items-center flex ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign Up"
                )}
              </button>

              <footer className="w-full py-1 justify-center flex flex-row items-center gap-1 text-zinc-800 text-xs">
                <p>Already have an account?</p>{" "}
                <Link className="text-primary" to={"/login"}>
                  Log In
                </Link>
              </footer>
            </form>
          </div>
        </div>

        <div className="relative h-full hidden lg:flex lg:w-2/3">
          <img
            src="/assets/images/login-bg.png"
            alt="clinic"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 w-1/12 bg-linear-to-r from-system-white  via-transparent to-transparent pointer-events-none" />
          <div className="absolute right-5 bottom-5 w-2/5 bg-primary/80 text-zinc-100 font-medium rounded-xl px-5 text-3xl py-3">
            Sign up to create an appointment.
          </div>
        </div>
      </section>
    </main>
  );
}
