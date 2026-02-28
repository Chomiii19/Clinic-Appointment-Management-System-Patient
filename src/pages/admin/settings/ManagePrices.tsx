import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { Options } from "../../../components/admin/serviceTable/table";
import Filter from "../../../components/admin/serviceTable/filter";
import type { FiltersState } from "../../../@types/types";

// ── Types ─────────────────────────────────────────────────────
interface IPrice {
  _id: string;
  serviceName: string;
  amount: number;
  status: string;
}

interface PriceFormData {
  serviceName: string;
  amount: number;
  status: string;
}

const DEFAULT_FORM: PriceFormData = {
  serviceName: "",
  amount: 0,
  status: "",
};

// ── Inline Price Table ────────────────────────────────────────
function PriceTable({
  data,
  loading,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  perPage,
  onEditClick,
}: {
  data: IPrice[];
  loading: boolean;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onEditClick: (price: IPrice) => void;
}) {
  const startItem = (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="overflow-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-4 py-3 font-medium">Service Name</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b border-zinc-100 dark:border-zinc-800"
                >
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-zinc-400"
                >
                  No prices found.
                </td>
              </tr>
            ) : (
              data.map((price) => (
                <tr
                  key={price._id}
                  className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-4 py-3">{price.serviceName}</td>
                  <td className="px-4 py-3">
                    ₱{price.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        price.status === "Available"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {price.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onEditClick(price)}
                      className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500">
          <span>
            Showing {startItem}–{endItem} of {totalItems}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 disabled:opacity-40 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-2 py-1 rounded border border-zinc-300 dark:border-zinc-600 disabled:opacity-40 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Shared Modal ──────────────────────────────────────────────
function PriceModal({
  title,
  subtitle,
  formState,
  setFormState,
  onSubmit,
  onClose,
  submitLabel,
}: {
  title: string;
  subtitle?: string;
  formState: PriceFormData;
  setFormState: React.Dispatch<React.SetStateAction<PriceFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
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
        {subtitle && <p className="text-sm text-zinc-400">{subtitle}</p>}
      </header>

      <section className="p-5 pt-2 flex flex-col gap-3.5 text-sm">
        {/* Service Name */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="serviceName">
            Service Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            id="serviceName"
            value={formState.serviceName}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, serviceName: e.target.value }))
            }
            placeholder="e.g. Vaccination"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        {/* Amount */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="amount">
            Amount (₱) <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="number"
            id="amount"
            min={0}
            value={formState.amount}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }))
            }
            placeholder="e.g. 500"
            className="border border-zinc-300 dark:border-zinc-700 outline-none rounded-md px-2 py-0.5 w-full"
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            required
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
          <button type="button" onClick={onClose} className="cursor-pointer">
            Cancel
          </button>
          <button
            type="submit"
            className="bg-zinc-900 text-zinc-100 px-3 py-1 rounded-full font-bold cursor-pointer"
          >
            {submitLabel}
          </button>
        </div>
      </section>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function ManagePrices() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );

  const [data, setData] = useState<IPrice[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);

  // Add modal
  const [openAddModal, setOpenAddModal] = useState(false);
  const [formState, setFormState] = useState<PriceFormData>(DEFAULT_FORM);

  // Edit modal
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editPriceId, setEditPriceId] = useState<string | null>(null);
  const [editFormState, setEditFormState] =
    useState<PriceFormData>(DEFAULT_FORM);

  const tabs = ["All"];

  // ── Fetch ──
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
          `${BACKEND_DOMAIN}/api/v1/prices?${params.toString()}`,
          { withCredentials: true },
        );

        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setPerPage(response.data.limit);
      } catch (error) {
        console.error("Failed to fetch prices", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, currentPage, search, refresh]);

  // ── Add ──
  const handleAddPrice = async (formData: PriceFormData) => {
    try {
      await axios.post(
        `${BACKEND_DOMAIN}/api/v1/prices/add`,
        {
          serviceName: formData.serviceName,
          amount: formData.amount,
          status: formData.status,
        },
        { withCredentials: true },
      );
      setOpenAddModal(false);
      setFormState(DEFAULT_FORM);
      setCurrentPage(1);
      setFilters({});
      setSearch("");
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Price creation failed:", error);
    }
  };

  // ── Edit ──
  const handleEditPrice = async (formData: PriceFormData, id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/prices/${id}`,
        {
          serviceName: formData.serviceName,
          amount: formData.amount,
          status: formData.status,
        },
        { withCredentials: true },
      );
      setOpenEditModal(false);
      setEditFormState(DEFAULT_FORM);
      setEditPriceId(null);
      setCurrentPage(1);
    } catch (err) {
      console.error("Price update failed:", err);
    } finally {
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden relative">
      <Sidebar
        page="managePrices"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      {/* Add Modal */}
      {openAddModal && (
        <div
          onClick={() => setOpenAddModal(false)}
          className="absolute h-screen w-screen z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <PriceModal
            title="Add New Price"
            subtitle="Fill in the details below to record the price."
            formState={formState}
            setFormState={setFormState}
            onSubmit={() => handleAddPrice(formState)}
            onClose={() => {
              setOpenAddModal(false);
              setFormState(DEFAULT_FORM);
            }}
            submitLabel="Create"
          />
        </div>
      )}

      {/* Edit Modal */}
      {openEditModal && (
        <div
          onClick={() => setOpenEditModal(false)}
          className="fixed inset-0 z-60 flex justify-center items-center bg-black/15 dark:bg-black/25"
        >
          <PriceModal
            title="Edit Price"
            formState={editFormState}
            setFormState={setEditFormState}
            onSubmit={() => {
              if (editPriceId) handleEditPrice(editFormState, editPriceId);
            }}
            onClose={() => {
              setOpenEditModal(false);
              setEditFormState(DEFAULT_FORM);
            }}
            submitLabel="Save"
          />
        </div>
      )}

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Prices" />
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

          <PriceTable
            data={data}
            loading={loading}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            perPage={perPage}
            onEditClick={(price) => {
              setEditFormState({
                serviceName: price.serviceName,
                amount: price.amount,
                status: price.status,
              });
              setEditPriceId(price._id);
              setOpenEditModal(true);
            }}
          />
        </section>
      </div>
    </main>
  );
}

export default ManagePrices;
