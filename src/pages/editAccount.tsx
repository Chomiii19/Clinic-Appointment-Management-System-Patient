import { Eye, EyeClosed } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BACKEND_DOMAIN } from "../configs/config";

interface UpdateUserPayload {
  firstname: string;
  surname: string;
  address: string;
  email: string;
  phoneNumber: string;
  gender: string;
  maritalStatus: string;
  birthDate: string;
  password?: string;
}

function EditAccount() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [firstname, setFirstname] = useState("");
  const [password, setPassword] = useState("");
  const [surname, setSurname] = useState("");
  const [viewPassword, setViewPassword] = useState(false);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updateData: UpdateUserPayload = {
        firstname,
        surname,
        address,
        email,
        maritalStatus,
        gender,
        birthDate,
        phoneNumber,
      };

      if (password.trim() !== "") updateData.password = password;

      await axios.patch(`${BACKEND_DOMAIN}/api/v1/users/update`, updateData, {
        withCredentials: true,
      });

      alert("Account updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Failed to update user account", error);
      alert("Failed to update account.");
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
        setAddress(res.data.data.address);
        setEmail(res.data.data.email);
        setPhoneNumber(res.data.data.phoneNumber);
        setGender(res.data.data.gender);
        setMaritalStatus(res.data.data.maritalStatus);
        setBirthDate(res.data.data.birthDate);
        setFirstname(res.data.data.firstname);
        setSurname(res.data.data.surname);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const err = e as AxiosError<{ message?: string }>;
          setError(err.response?.data?.message ?? "Fetch failed.");
        } else if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("An unexpected error occurred.");
        }
        console.log(error);
      }
    };

    fetchAdmin();
  }, [id]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <div className="w-full h-screen flex flex-col items-center gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 lg:w-[800px] w-full">
          <Header headline="Edit Account" />
        </div>

        <form
          onSubmit={handleUpdateUser}
          className="bg-system-white dark:bg-system-black rounded-xl w-full lg:w-[800px] p-5 flex flex-col gap-2"
        >
          <div className="w-full flex items-center gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="firstname">
                Firstname <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="firstname"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="e.g. John"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="surname">
                Surname <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                name="surname"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                placeholder="e.g. Doe"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. example@gmail.com"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="phoneNumber">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="string"
              name="phoneNumber"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 09123456789"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="birthDate">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="birthDate"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="MM/DD/YYYY"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            />
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="address">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="address"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Blk Lot, Street, City, Province"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            />
          </div>

          <div className="flex items-center w-full justify-between gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="gender">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="gender"
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="maritalStatus">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="maritalStatus"
                id="maritalStatus"
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
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

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="password">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="w-full flex items-center relative">
              <input
                type={viewPassword ? "text" : "password"}
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              />
              <button
                type="button"
                className="absolute right-2 text-zinc-400 cursor-pointer dark:text-zinc-600"
                onClick={() => setViewPassword((prev) => !prev)}
              >
                {viewPassword ? <EyeClosed /> : <Eye />}
              </button>
            </div>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Password must be at least 8 characters long, and include a mix of
              uppercase letters, numbers, and symbols.
            </p>
          </div>

          <div className="flex items-center w-full justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditAccount;
