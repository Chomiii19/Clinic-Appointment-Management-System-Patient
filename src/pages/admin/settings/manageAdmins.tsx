import { Eye, EyeClosed, Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/adminTable/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { IUser } from "../../../@types/interface";
import Filter from "../../../components/admin/adminTable/filter";
import type { FiltersState } from "../../../@types/types";

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
}

function ManageAdmins() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [data, setData] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
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
  });

  const tabs = ["All"];

  const handleAddAdmin = async (formData: AdminFormData) => {
    try {
      await axios.post(`${BACKEND_DOMAIN}/api/v1/auth/signup`, {
        firstname: formData.firstname,
        surname: formData.surname,
        maritalStatus: formData.maritalStatus,
        gender: formData.gender,
        birthDate: formData.birthDate,
        address: formData.address,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: "admin",
      });
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
        firstname: "",
        surname: "",
        maritalStatus: "",
        gender: "",
        birthDate: "",
        address: "",
        email: "",
        phoneNumber: "",
        password: "",
      });

      setCurrentPage(1);
      setFilters({});
      setSearch("");
    } catch (error) {
      console.error("Account creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const genderFilter = filters["Gender"] as SingleValue<Options> | null;
        if (genderFilter?.value) params.append("gender", genderFilter.value);

        const maritalFilter = filters[
          "Marital Status"
        ] as SingleValue<Options> | null;
        if (maritalFilter?.value)
          params.append("maritalStatus", maritalFilter.value);

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/users/admins?${params.toString()}`,
          { withCredentials: true },
        );
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setPerPage(response.data.limit);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage, search]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden relative">
      <Sidebar
        page="manageAdmins"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {openAddModal && (
        <div
          onClick={() => setOpenAddModal(false)}
          className="absolute h-screen w-screen z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <AddAdmin
            handleAddAdmin={handleAddAdmin}
            formState={formState}
            setFormState={setFormState}
            setOpenAddModal={setOpenAddModal}
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Admins" />
        </div>
        <section className="flex flex-col w-full h-full overflow-hidden">
          <Filter
            tabs={tabs}
            currentTab="All"
            filters={filters}
            setFilters={setFilters}
            setCurrentPage={setCurrentPage}
            search={search}
            setSearch={setSearch}
            setOpenAddModal={setOpenAddModal}
          />

          <Table
            data={data}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}

function AddAdmin({
  handleAddAdmin,
  formState,
  setFormState,
  setOpenAddModal,
}: {
  handleAddAdmin: (formData: AdminFormData) => Promise<void>;
  formState: AdminFormData;
  setFormState: React.Dispatch<React.SetStateAction<AdminFormData>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [viewPassword, setViewPassword] = useState(false);

  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        handleAddAdmin(formState);
      }}
      className="absolute  bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] overflow-auto no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">Add New Admin</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the admin.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex items-center w-full justify-between gap-3">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="firstname">
              Firstname <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              name="firstname"
              id="firstname"
              value={formState.firstname}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, firstname: e.target.value }))
              }
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
              value={formState.surname}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, surname: e.target.value }))
              }
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
            value={formState.email}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, email: e.target.value }))
            }
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
            value={formState.phoneNumber}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
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
            type="date"
            name="birthDate"
            id="birthDate"
            value={formState.birthDate}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, birthDate: e.target.value }))
            }
            placeholder=""
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="string"
            name="address"
            id="address"
            value={formState.address}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, address: e.target.value }))
            }
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
              value={formState.gender}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, gender: e.target.value }))
              }
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
              value={formState.maritalStatus}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  maritalStatus: e.target.value,
                }))
              }
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
              required
              type={viewPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formState.password}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
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
            onClick={() => {
              setOpenAddModal(false);
              setFormState({
                firstname: "",
                surname: "",
                maritalStatus: "",
                gender: "",
                birthDate: "",
                address: "",
                email: "",
                phoneNumber: "",
                password: "",
              });
            }}
            type="button"
            className="cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            Create
          </button>
        </div>
      </section>
    </form>
  );
}

export default ManageAdmins;
