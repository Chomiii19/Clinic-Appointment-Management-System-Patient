import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BACKEND_DOMAIN } from "../configs/config";

function ViewAccount() {
  const { id } = useParams<{ id: string }>();
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");

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
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden shadow-md">
      <div className="w-full h-screen flex flex-col items-center gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 lg:w-[800px] w-full">
          <Header headline="Profile" />
        </div>

        <div className="bg-system-white dark:bg-system-black rounded-xl w-full lg:w-[800px] p-5 flex flex-col gap-2">
          <div className="w-full flex items-center gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="firstname">Firstname</label>
              <div
                id="firstname"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              >
                {firstname}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="surname">Surname</label>
              <div
                id="surname"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              >
                {surname}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="email">Email</label>
            <div
              id="email"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            >
              {email}
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div
              id="phoneNumber"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            >
              {phoneNumber}
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="birthDate">Birth Date</label>
            <div
              id="birthDate"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            >
              {birthDate}
            </div>
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="address">Address</label>
            <div
              id="address"
              className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
            >
              {address}
            </div>
          </div>

          <div className="flex items-center w-full justify-between gap-3">
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="gender">Gender</label>
              <div
                id="gender"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              >
                {gender}
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="maritalStatus">Marital Status</label>
              <div
                id="maritalStatus"
                className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
              >
                {maritalStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewAccount;
