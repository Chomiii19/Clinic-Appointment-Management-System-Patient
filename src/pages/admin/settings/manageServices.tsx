import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/serviceTable/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { IService } from "../../../@types/interface";
import Filter from "../../../components/admin/serviceTable/filter";
import type { FiltersState } from "../../../@types/types";

interface ServiceFormData {
  name: string;
  price: number;
  status: string;
}

function ManageServices() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [data, setData] = useState<IService[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);
  const [formState, setFormState] = useState<ServiceFormData>({
    name: "",
    price: 0,
    status: "",
  });

  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editFormState, setEditFormState] = useState<ServiceFormData>({
    name: "",
    price: 0,
    status: "",
  });

  const tabs = ["All"];

  const handleEditService = async (formData: ServiceFormData, id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/services/${id}`,
        {
          name: formData.name,
          price: formData.price,
          status: formData.status,
        },
        { withCredentials: true },
      );
      setLoading(true);

      setOpenEditModal(false);
      setEditFormState({ name: "", price: 0, status: "" });
      setCurrentPage(1);
    } catch (err) {
      console.error("Service update failed:", err);
    } finally {
      setLoading(false);
      setRefresh((prev) => prev + 1);
    }
  };

  const handleAddService = async (formData: ServiceFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/services/add`,
        {
          name: formData.name,
          price: formData.price,
          status: formData.status,
        },
        { withCredentials: true },
      );
      setLoading(true);
      setOpenAddModal(false);

      setFormState({
        name: "",
        price: 0,
        status: "",
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
          `${BACKEND_DOMAIN}/api/v1/services?${params.toString()}`,
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
        page="manageServices"
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
              if (editServiceId)
                handleEditService(editFormState, editServiceId);
            }}
            onClose={() => setOpenEditModal(false)}
            title="Edit Service"
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Services" />
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
            onEditClick={(service) => {
              setEditFormState({
                name: service.name,
                price: service.price,
                status: service.status,
              });
              setOpenEditModal(true);
              setEditServiceId(service._id);
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
  handleAddAdmin: (formData: ServiceFormData) => Promise<void>;
  formState: ServiceFormData;
  setFormState: React.Dispatch<React.SetStateAction<ServiceFormData>>;
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
        <h1 className="font-bold text-lg">Add New Service</h1>
        <p className="text-sm text-zinc-400">
          Fill in the details below to record the service.
        </p>
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            name="name"
            id="name"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g. Vaccination"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="price">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            name="price"
            id="price"
            value={formState.price}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            placeholder="e.g. 100"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            required
            name="status"
            id="status"
            value={formState.status}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Available">Available</option>
            <option value="Not Available">Unavailable</option>
          </select>
        </div>

        <div className="flex items-center w-full justify-end gap-3">
          <button
            onClick={() => {
              setOpenAddModal(false);
              setFormState({
                name: "",
                price: 0,
                status: "",
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
  formState: ServiceFormData;
  setFormState: React.Dispatch<React.SetStateAction<ServiceFormData>>;
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
            Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formState.name}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, name: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>
            Price <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            value={formState.price}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>
            Status <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={formState.status}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="Available">Available</option>
            <option value="Not Available">Unavailable</option>
          </select>
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

export default ManageServices;
