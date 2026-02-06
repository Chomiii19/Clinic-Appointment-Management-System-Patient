import { Menu } from "lucide-react";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { useEffect, useState } from "react";
import Table, {
  type Options,
} from "../../../components/admin/patientTable/table";
import { BACKEND_DOMAIN } from "../../../configs/config";
import axios from "axios";
import type { SingleValue } from "react-select";
import type { IUser } from "../../../@types/interface";
import Filter from "../../../components/admin/patientTable/filter";
import type { FiltersState } from "../../../@types/types";

function Patients() {
  const [openSidebar, setOpenSidebar] = useState(
    () =>
      window.innerWidth >= 1024 &&
      localStorage.getItem("sidebarOpen") === "true",
  );
  const [patients, setPatients] = useState<IUser[]>([]);
  const [filters, setFilters] = useState<FiltersState>({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(0);

  const tabs = ["All"];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        const genderFilter = filters["Gender"] as SingleValue<Options> | null;
        if (genderFilter?.value) params.append("gender", genderFilter.value);

        // Marital status filter
        const maritalFilter = filters[
          "Marital Status"
        ] as SingleValue<Options> | null;
        if (maritalFilter?.value)
          params.append("maritalStatus", maritalFilter.value);

        if (search.trim()) params.append("search", search.trim());
        params.append("page", String(currentPage));

        const response = await axios.get(
          `${BACKEND_DOMAIN}/api/v1/users/patients?${params.toString()}`,
          { withCredentials: true },
        );
        setLoading(false);
        setPatients(response.data.data);
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

    fetchPatients();
  }, [filters, currentPage, search]);

  return (
    <main className="bg-off-white dark:bg-off-black dark:text-zinc-50 font-manrope h-screen w-full flex gap-3 overflow-hidden">
      <Sidebar
        page="patients"
        openSidebar={openSidebar}
        setOpenSidebar={setOpenSidebar}
      />

      <div className="w-full h-screen flex flex-col gap-4 lg:ml-58 p-5 overflow-hidden">
        <div className="flex items-center gap-1 w-full">
          <Menu
            onClick={() => setOpenSidebar(true)}
            className="text-zinc-500 cursor-pointer w-7 visible lg:hidden"
          />
          <Header headline="Patients" />
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
          />

          <Table
            patients={patients}
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
export default Patients;
