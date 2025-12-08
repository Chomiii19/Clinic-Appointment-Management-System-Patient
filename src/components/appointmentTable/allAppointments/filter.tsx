import Select, { type MultiValue, type SingleValue } from "react-select";
import { ClipboardClock, Search } from "lucide-react";
import type { Options } from "./table";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { customStyles } from "./styles";
import { tableHeaders } from "./headers/appointments";
import type { FiltersState, FilterValue } from "../../../@types/types";
import type { IAppointment } from "../../../@types/interface";
import { useEffect, useState } from "react";
import { statusOption } from "../data";
import axios from "axios";
import { BACKEND_DOMAIN } from "../../../configs/config";
import { Link } from "react-router-dom";

function Filter({
  tabs,
  currentTab,
  filters,
  setFilters,
  appointments,
  setCurrentPage,
  search,
  setSearch,
  setOpenAddModal,
}: {
  tabs: string[];
  currentTab: string;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  appointments: IAppointment[];
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { darkMode } = useDarkMode();
  const [serviceOptions, setServiceOptions] = useState<Options[]>([]);
  const [doctorOptions, setDoctorOptions] = useState<Options[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/services`, {
          withCredentials: true,
        });
        const services: Options[] = res.data.data.map(
          (svc: { name: string }) => ({
            value: svc.name,
            label: svc.name,
          })
        );
        setServiceOptions(services);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${BACKEND_DOMAIN}/api/v1/doctors`, {
          withCredentials: true,
        });
        const doctors: Options[] = res.data.data.map(
          (svc: { name: string }) => ({
            value: svc.name,
            label: svc.name,
          })
        );
        setDoctorOptions(doctors);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };

    fetchServices();
    fetchDoctors();
  }, []);

  const updateFilter = (name: string, value: FilterValue) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));

    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({});
    setSearch("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    Object.values(filters).some((val) => {
      if (!val) return false;
      if (Array.isArray(val)) return val.length > 0;
      return true;
    });

  const patientOptions: Options[] = Array.from(
    new Set(
      appointments
        .filter((appt): appt is IAppointment => !!appt)
        .map((appt) => appt.patientName)
        .filter((name): name is string => !!name)
    )
  ).map((name) => ({ value: name, label: name }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <header className="flex flex-col w-full z-30">
      <div className="flex items-end justify-between w-full border-b border-zinc-300 dark:border-zinc-700 pb-2">
        <div className="flex items-center gap-1 lg:gap-1.5 text-zinc-600 dark:text-zinc-400">
          {tabs.map((tab, i) => (
            <Link
              to={`/appointments/${tab === "All" ? "" : tab.toLowerCase()}`}
              key={i}
              className={`px-2 lg:px-3 py-0.5 hover:text-zinc-800 dark:hover:text-zinc-100 cursor-pointer rounded-sm ${
                tab === currentTab &&
                "bg-system-white dark:bg-system-black text-zinc-950 dark:text-zinc-50 shadow-sm"
              }`}
            >
              {tab}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 lg:gap-4">
          <span className="flex items-center gap-2 px-3 py-1 bg-system-white dark:bg-system-black text-sm rounded-lg w-fit border border-zinc-300 dark:border-zinc-700">
            <Search className="text-zinc-400 w-5" />
            <input
              type="text"
              placeholder="Search"
              className="outline-none w-20 lg:w-52"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>

          <button
            onClick={() => setOpenAddModal(true)}
            className="flex items-center gap-2 px-1.5 py-0.5 rounded-md text-sm bg-system-white dark:bg-system-black text-zinc-800 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          >
            <ClipboardClock className="w-5" />
            <p className="hidden lg:block">Create Appointment</p>
          </button>
        </div>
      </div>

      <div className="flex gap-2 items-center pt-2 text-sm overflow-x-auto no-scrollbar whitespace-nowrap">
        {tableHeaders.map((filter, i) => {
          let options = filter.options;

          if (filter.name === "Patient Name") options = patientOptions;
          if (filter.name === "Status") options = statusOption;
          if (filter.name === "Services") options = serviceOptions;
          if (filter.name === "Doctor Assigned") options = doctorOptions;

          if (!filter.filter) return null;

          const hasValue = (() => {
            const val = filters[filter.name];
            if (!val) return false;
            if (Array.isArray(val)) return val.length > 0;
            return true;
          })();

          const val = filters[filter.name];

          const safeValue: FilterValue = (() => {
            if (!val) return filter.singleValue ? null : [];

            if (filter.singleValue) {
              // single select
              const single = val as SingleValue<Options>;
              return options.find((opt) => opt.value === single?.value) ?? null;
            } else {
              // multi select
              const multi = val as MultiValue<Options>;
              return multi.filter((v) =>
                options.some((opt) => opt.value === v.value)
              );
            }
          })();

          return filter.filter ? (
            <div
              key={i}
              className={`flex items-center bg-system-white dark:bg-system-black rounded-full pl-3 border ${
                hasValue
                  ? "border-blue-500"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              <span
                className={` ${
                  hasValue
                    ? "text-blue-500"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {filter.icon}
              </span>
              <Select<Options, boolean>
                key={i}
                placeholder={filter.name}
                isMulti={!filter.singleValue}
                isClearable={filter.singleValue}
                options={options}
                value={safeValue}
                onChange={(val) => updateFilter(filter.name, val)}
                styles={{
                  ...customStyles(darkMode),
                  menuPortal: (base) => ({ ...base, zIndex: 40 }),
                }}
                menuPortalTarget={document.body}
                menuPosition="absolute"
                className="w-28 lg:w-auto"
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
            </div>
          ) : null;
        })}

        {hasActiveFilters && (
          <button
            onClick={() => resetFilters()}
            className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-150 ease-in-out cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>
    </header>
  );
}

export default Filter;
