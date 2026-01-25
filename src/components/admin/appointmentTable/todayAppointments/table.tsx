import Select, {
  components,
  type OptionProps,
  type SingleValueProps,
} from "react-select";
import { ArrowUpRight, ChevronsUpDown, Upload, Wand, X } from "lucide-react";
import { useRef, useState, type JSX } from "react";
import { CustomCheckbox } from "../../../Checkbox";
import { tableHeaders } from "./headers/archiveAppointments";
import type { IAppointment, IDoctor } from "../../../../@types/interface";
import dayjs from "dayjs";
import Pagination from "../pagination";
import { serviceColors, statusColors } from "../data";
import { BACKEND_DOMAIN } from "../../../../configs/config";
import axios from "axios";
import { doctorSelectStyles } from "./styles";
import { useDarkMode } from "../../../../hooks/useDarkMode";
import { Link } from "react-router-dom";
import { truncateFilename } from "../../../../utils/truncate";

export type Options = {
  value: string;
  label: string;
};

export interface ITableHeaders {
  name: string;
  icon: JSX.Element;
  filter: boolean;
  singleValue: boolean;
  options: Options[];
  sortable: boolean;
}

function Table({
  appointments,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  perPage,
  setRefresh,
  loading,
}: {
  appointments: IAppointment[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  perPage: number;
  setRefresh: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
}) {
  const { darkMode } = useDarkMode();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [doctorOptions, setDoctorOptions] = useState<
    Record<string, DoctorOptionType[]>
  >({});

  const loadDoctorsForAppointment = async (apptId: string) => {
    try {
      const res = await axios.get(
        `${BACKEND_DOMAIN}/api/v1/appointments/${apptId}/doctors-available`,
        { withCredentials: true },
      );

      return res.data.data.map((d: IDoctor) => ({
        value: d._id,
        label: d.name,
        image: "/assets/images/profile-doctor.jpg",
      }));
    } catch (err) {
      console.error("Failed to load doctors:", err);
      return [];
    }
  };

  const handleDoctorUpdate = async (apptId: string, doctorId: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${apptId}/doctor`,
        { doctorId },
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update doctor:", err);
    }
  };

  const handleAction = async (id: string, action: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/${action}`,
        {},
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to mark appointment as no-show", error);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await axios.patch(
        `${BACKEND_DOMAIN}/api/v1/appointments/${id}/archive`,
        { archive: false },
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to archive appointment", error);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelected: Record<string, boolean> = {};
    appointments.forEach((appt) => {
      newSelected[appt._id] = checked;
    });
    setSelectedRows(newSelected);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    apptId: string,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointmentId", apptId);

    try {
      const { data } = await axios.post(
        `${BACKEND_DOMAIN}/api/v1/medical-records/upload`,
        formData,
        {
          withCredentials: true,
        },
      );
      console.log("Upload success:", data);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDeleteMedicalRecord = async (
    appointmentId: string,
    recordId: string,
  ) => {
    if (!confirm("Are you sure you want to delete this medical record?"))
      return;

    try {
      await axios.delete(
        `${BACKEND_DOMAIN}/api/v1/medical-records/${recordId}/appointments/${appointmentId}`,
        { withCredentials: true },
      );

      setRefresh((prev) => prev + 1);

      console.log("Medical record deleted successfully");
    } catch (err) {
      console.error("Failed to delete medical record:", err);
      alert("Failed to delete medical record");
    }
  };

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="rounded-xl border border-zinc-300 dark:border-zinc-700 mt-3 bg-system-white dark:bg-system-black flex flex-col max-h-[80vh] overflow-hidden">
      <div className="overflow-x-auto w-full no-scrollbar">
        <div className="w-full">
          <div className="overflow-y-auto w-full">
            <table className="table-auto border-collapse w-full">
              <thead className="text-sm text-zinc-500 sticky top-0 bg-system-white dark:bg-system-black z-10">
                <tr>
                  <th className="w-36 px-5 py-2 z-20 border-b border-zinc-300 dark:border-zinc-700">
                    <div className="flex items-center gap-2 cursor-pointer w-fit">
                      <CustomCheckbox
                        checked={selectAll}
                        onChange={toggleSelectAll}
                      />
                      REF <ChevronsUpDown className="w-3" />
                    </div>
                  </th>
                  {tableHeaders.map((header, i) => (
                    <TableHeader key={i} header={header} />
                  ))}
                  <th className="w-36 px-5 py-2 border-b border-zinc-300 dark:border-zinc-700">
                    <div className="flex items-center gap-2">
                      <Wand className="w-4" /> Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm text-zinc-600 dark:text-zinc-400">
                {!loading &&
                  appointments.length !== 0 &&
                  appointments
                    .filter((appt): appt is IAppointment => !!appt)
                    .map((appt, i) => (
                      <tr
                        key={i}
                        className={`border-b border-zinc-300 dark:border-zinc-700 transition-colors duration-150 ease-in-out ${
                          selectedRows[appt._id]
                            ? "bg-zinc-200/50 dark:bg-zinc-700/50"
                            : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        }`}
                      >
                        <td className="py-2 px-5">
                          <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <CustomCheckbox
                              checked={!!selectedRows[appt._id]}
                              onChange={(checked) => {
                                setSelectedRows((prevSelected) => {
                                  const newSelected = {
                                    ...prevSelected,
                                    [appt._id]: checked,
                                  };

                                  if (!checked) setSelectAll(false);
                                  else {
                                    const allChecked = appointments.every(
                                      (a) => newSelected[a._id],
                                    );
                                    if (allChecked) setSelectAll(true);
                                  }

                                  return newSelected;
                                });
                              }}
                            />

                            {appt._id.slice(0, 6)}
                          </div>
                        </td>
                        <td className="py-2 px-5 font-medium text-zinc-950 dark:text-zinc-50">
                          <Link
                            // @ts-expect-error: shut it
                            to={`/users/${appt.patientId._id}`}
                            className="flex items-center gap-2"
                          >
                            <img
                              src="/assets/images/user-profile.jpg"
                              alt="profile"
                              className="w-7 h-7 rounded-full"
                            />
                            <p className="cursor-pointer w-fit whitespace-nowrap">
                              {appt.patientName}
                            </p>
                          </Link>
                        </td>
                        <td className="py-2 px-5">{appt.email}</td>
                        <td className="py-2 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-sm text-white text-xs font-bold ${
                              statusColors[appt.status] || "bg-gray-400"
                            }`}
                          >
                            {appt.status === "Approved"
                              ? "On Queue"
                              : appt.status}
                          </span>
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {dayjs(appt.schedule).format("h:mm A")}
                        </td>
                        <td className="py-2 px-5 text-zinc-950 dark:text-zinc-50 font-medium">
                          <div
                            title={
                              appt.status !== "Approved"
                                ? "Doctor can only be assigned if status is On Queue"
                                : ""
                            }
                            className={`${
                              appt.status !== "Approved"
                                ? "cursor-not-allowed opacity-70"
                                : "cursor-pointer"
                            }`}
                          >
                            <Select<DoctorOptionType, false>
                              placeholder="Select Doctor"
                              isDisabled={appt.status !== "Approved"}
                              options={doctorOptions[appt._id] || []}
                              onMenuOpen={async () => {
                                if (doctorOptions[appt._id]) return;

                                const options = await loadDoctorsForAppointment(
                                  appt._id,
                                );
                                setDoctorOptions((prev) => ({
                                  ...prev,
                                  [appt._id]: options,
                                }));
                              }}
                              onChange={(opt) => {
                                if (!opt) return;
                                handleDoctorUpdate(appt._id, opt.value);
                              }}
                              value={
                                appt.doctorId
                                  ? {
                                      value: appt.doctorId._id,
                                      label: appt.doctorId.name,
                                      image:
                                        "/assets/images/profile-doctor.jpg",
                                    }
                                  : null
                              }
                              className="w-40"
                              styles={doctorSelectStyles(darkMode)}
                              components={{
                                IndicatorSeparator: () => null,
                                Option: DoctorOption,
                                SingleValue: DoctorSingleValue,
                              }}
                            />
                          </div>
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          <div className="flex gap-2 flex-nowrap">
                            {Array.isArray(appt.medicalDepartment) ? (
                              appt.medicalDepartment.map((svc, idx) => (
                                <span
                                  key={idx}
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    serviceColors[svc] ||
                                    "bg-gray-50 text-gray-700 border border-gray-200"
                                  }`}
                                >
                                  {svc}
                                </span>
                              ))
                            ) : (
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  serviceColors[appt.medicalDepartment] ||
                                  "bg-gray-50 text-gray-700 border border-gray-200"
                                }`}
                              >
                                {appt.medicalDepartment}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {appt?.medicalRecord?.fileUrl ? (
                            <div className="flex items-center gap-1">
                              <a
                                href={appt?.medicalRecord?.fileUrl ?? "/"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-2 border border-green-500 text-green-500 bg-green-200/20 rounded-md w-fit"
                              >
                                {truncateFilename(
                                  appt?.medicalRecord?.filename ?? "",
                                )}
                                <ArrowUpRight className="w-4" />
                              </a>
                              <button
                                onClick={() =>
                                  handleDeleteMedicalRecord(
                                    appt._id,
                                    appt?.medicalRecord?._id,
                                  )
                                }
                              >
                                <X className="w-6 text-red-500 cursor-pointer" />
                              </button>
                            </div>
                          ) : appt.status === "Completed" ? (
                            <>
                              <button
                                type="button"
                                onClick={handleButtonClick}
                                className="flex items-center gap-1 bg-primary text-white rounded-md px-2 py-0.5 font-semibold cursor-pointer"
                              >
                                <Upload className="w-4" /> Upload
                              </button>

                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e, appt._id)}
                                className="hidden"
                              />
                            </>
                          ) : (
                            "none"
                          )}
                        </td>
                        <td className="px-5">
                          {appt.status === "Pending" && (
                            <div className="flex items-center gap-3 text-white font-bold text-xs">
                              <button
                                onClick={() =>
                                  handleAction(appt._id, "approve")
                                }
                                className="bg-green-500 rounded-sm px-2 py-0.5 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleAction(appt._id, "decline")
                                }
                                className="bg-red-400 rounded-sm px-2 py-0.5 cursor-pointer"
                              >
                                Decline
                              </button>
                            </div>
                          )}

                          {appt.status === "Approved" && (
                            <div className="flex items-center gap-3 text-white font-bold text-xs">
                              <button
                                onClick={() =>
                                  handleAction(appt._id, "completed")
                                }
                                className="bg-green-500 rounded-sm px-2 py-0.5 cursor-pointer"
                              >
                                Completed
                              </button>
                              <button
                                onClick={() => handleAction(appt._id, "noshow")}
                                className="bg-red-400 rounded-sm px-2 py-0.5 cursor-pointer whitespace-nowrap"
                              >
                                No Show
                              </button>
                            </div>
                          )}

                          {[
                            "Cancelled",
                            "No Show",
                            "Completed",
                            "Declined",
                          ].includes(appt.status) && (
                            <div className="flex items-center gap-3 text-white font-bold text-xs">
                              <button
                                onClick={() => handleArchive(appt._id)}
                                className="bg-orange-400 rounded-sm px-2 py-0.5 cursor-pointer whitespace-nowrap"
                              >
                                Archive
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            Loading appointments. Please wait.
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            No appointments found.
          </div>
        )}
      </div>

      {/* Pagination stays visible */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        perPage={perPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function TableHeader({ header }: { header: ITableHeaders }) {
  return (
    <th className="min-w-[120px] py-2 px-5 z-20 border-b border-zinc-300 dark:border-zinc-700">
      <div
        className={`flex items-center gap-2 w-fit ${
          header.sortable && "cursor-pointer"
        }`}
      >
        {header.icon}
        <span className="truncate">{header.name}</span>
        {header.sortable && <ChevronsUpDown className="w-3" />}
      </div>
    </th>
  );
}

export interface DoctorOptionType {
  value: string;
  label: string;
  image?: string;
}

const DoctorOption = (props: OptionProps<DoctorOptionType, false>) => {
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <img
          src={props.data.image || "/assets/images/user-profile.jpg"}
          alt="profile"
          className="w-7 h-7 rounded-full"
        />
        <span>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const DoctorSingleValue = (
  props: SingleValueProps<DoctorOptionType, false>,
) => {
  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-2">
        <img
          src={props.data.image || "/assets/images/profile-doctor.jpg"}
          alt="profile"
          className="w-7 h-7 rounded-full"
        />
        <span>{props.data.label}</span>
      </div>
    </components.SingleValue>
  );
};

export default Table;
