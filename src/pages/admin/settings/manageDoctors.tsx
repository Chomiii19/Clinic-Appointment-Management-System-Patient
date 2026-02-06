import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/doctorTable/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { IDoctor } from "../../../@types/interface";
import Filter from "../../../components/admin/doctorTable/filter";
import type { FiltersState } from "../../../@types/types";

interface DoctorFormData {
  firstname: string;
  middlename: string;
  surname: string;
  specialization: string;
}

function ManageDoctors() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [data, setData] = useState<IDoctor[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [formState, setFormState] = useState<DoctorFormData>({
    firstname: "",
    middlename: "",
    surname: "",
    specialization: "",
  });

  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<DoctorFormData>({
    firstname: "",
    middlename: "",
    surname: "",
    specialization: "",
  });

  const tabs = ["All"];

  const handleEditDoctor = async (formData: DoctorFormData, id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/doctors/${id}`,
        {
          firstname: formData.firstname,
          middlename: formData.middlename,
          surname: formData.surname,
          specialization: formData.specialization,
        },
        { withCredentials: true },
      );
      setLoading(true);

      setOpenEditModal(false);
      setEditFormState({
        firstname: "",
        middlename: "",
        surname: "",
        specialization: "",
      });
      setCurrentPage(1);
    } catch (err) {
      console.error("Doctor update failed:", err);
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleAddService = async (formData: DoctorFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/doctors/add`,
        {
          firstname: formData.firstname,
          middlename: formData.middlename,
          surname: formData.surname,
          specialization: formData.specialization,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
        firstname: "",
        middlename: "",
        surname: "",
        specialization: "",
      });

      setCurrentPage(1);
      setFilters({});
      setSearch("");
    } catch (error) {
      console.error("Service creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const statusFilter = filters["Status"] as SingleValue<Options> | null;
        if (statusFilter?.value) params.append("status", statusFilter.value);

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/doctors?${params.toString()}`,
          { withCredentials: true },
        );
        setLoading(false);
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setPerPage(response.data.limit);
      } catch (error) {
        setLoading(false);
        console.error("Failed to fetch appointments", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage, search, refresh]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden relative">
      <Sidebar
        page="manageDoctors"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {openAddModal && (
        <div
          onClick={() => setOpenAddModal(false)}
          className="absolute h-screen w-screen z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <AddService
            handleAddAdmin={handleAddService}
            formState={formState}
            setFormState={setFormState}
            setOpenAddModal={setOpenAddModal}
          />
        </div>
      )}

      {openEditModal && (
        <div
          onClick={() => setOpenEditModal(false)}
          className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <ServiceModal
            formState={editFormState}
            setFormState={setEditFormState}
            onSubmit={() => {
              if (editServiceId) handleEditDoctor(editFormState, editServiceId);
            }}
            onClose={() => setOpenEditModal(false)}
            title="Edit Doctor"
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Doctors" />
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
            onEditClick={(doctor) => {
              setEditFormState({
                firstname: doctor.firstname,
                middlename: doctor.middlename,
                surname: doctor.surname,
                specialization: doctor.specialization,
              });

              setOpenEditModal(true);
              setEditServiceId(doctor._id);
            }}
          />
        </section>
      </div>
    </main>
  );
}

function AddService({
  handleAddAdmin,
  formState,
  setFormState,
  setOpenAddModal,
}: {
  handleAddAdmin: (formData: DoctorFormData) => Promise<void>;
  formState: DoctorFormData;
  setFormState: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
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
        <h1 className="font-bold text-lg">Add New Doctor</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the doctor.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
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
          <label htmlFor="middlename">
            Middlename <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="middlename"
            id="middlename"
            value={formState.middlename}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, middlename: e.target.value }))
            }
            placeholder="e.g. Michael"
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
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="specialization">
            Specialization <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="string"
            name="specialization"
            id="specialization"
            value={formState.specialization}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                specialization: e.target.value,
              }))
            }
            placeholder="e.g. Cardiologist"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex items-center w-full justify-end gap-3">
          <button
            onClick={() => {
              setOpenAddModal(false);
              setFormState({
                firstname: "",
                middlename: "",
                surname: "",
                specialization: "",
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

function ServiceModal({
  formState,
  setFormState,
  onSubmit,
  onClose,
  title,
}: {
  formState: DoctorFormData;
  setFormState: React.Dispatch<React.SetStateAction<DoctorFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
}) {
  return (
    <form
      onClick={(e) => e.stopPropagation()}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="absolute z-70 bg-system-white dark:bg-system-black shadow-xl lg:w-[500px] h-auto rounded-2xl mx-5 lg:mx-0 md:max-h-[670px] overflow-auto no-scrollbar"
    >
      <header className="p-5 pb-2 border-b border-zinc-300 dark:border-zinc-700">
        <h1 className="font-bold text-lg">{title}</h1>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label>
            Firstname <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formState.firstname}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, firstname: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>
            Middlename <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formState.middlename}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, middlename: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>
            Surname <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formState.surname}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, surname: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="specialization">
            Specialization <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="string"
            name="specialization"
            id="specialization"
            value={formState.specialization}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                specialization: e.target.value,
              }))
            }
            placeholder="e.g. Cardiologist"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        <div className="flex items-center w-full justify-end gap-3">
          <button type="button" onClick={onClose} className="cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            Save
          </button>
        </div>
      </section>
    </form>
  );
}

export default ManageDoctors;
