import { ChevronsUpDown } from "lucide-react";
import { useState, type JSX } from "react";
import { CustomCheckbox } from "../../Checkbox";
import { tableHeaders } from "./headers/headers";
import type { IService } from "../../../@types/interface";
import dayjs from "dayjs";
import Pagination from "./pagination";

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
  data,
  currentPage,
  setCurrentPage,
  totalPages,
  totalItems,
  perPage,
  loading,
  onEditClick,
}: {
  data: IService[];
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  totalItems: number;
  perPage: number;
  loading: boolean;
  onEditClick: (service: IService) => void;
}) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const toggleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    const newSelected: Record<string, boolean> = {};
    data.forEach((d) => {
      newSelected[d._id] = checked;
    });
    setSelectedRows(newSelected);
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
                      ID <ChevronsUpDown className="w-3" />
                    </div>
                  </th>
                  {tableHeaders.map((header, i) => (
                    <TableHeader key={i} header={header} />
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm text-zinc-600 dark:text-zinc-400">
                {!loading &&
                  data.length !== 0 &&
                  data
                    .filter((d): d is IService => !!d)
                    .map((d, i) => (
                      <tr
                        key={i}
                        className={`border-b border-zinc-300 dark:border-zinc-700 transition-colors duration-150 ease-in-out ${
                          selectedRows[d._id]
                            ? "bg-zinc-200/50 dark:bg-zinc-700/50"
                            : "hover:bg-zinc-200/50 dark:hover:bg-zinc-700/50"
                        }`}
                      >
                        <td className="py-2 px-5">
                          <div className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                            <CustomCheckbox
                              checked={!!selectedRows[d._id]}
                              onChange={(checked) => {
                                setSelectedRows((prevSelected) => {
                                  const newSelected = {
                                    ...prevSelected,
                                    [d._id]: checked,
                                  };

                                  if (!checked) setSelectAll(false);
                                  else {
                                    const allChecked = data.every(
                                      (a) => newSelected[a._id],
                                    );
                                    if (allChecked) setSelectAll(true);
                                  }

                                  return newSelected;
                                });
                              }}
                            />
                            P-{d._id.slice(0, 6)}
                          </div>
                        </td>
                        <td className="py-2 px-5 font-medium text-zinc-950 dark:text-zinc-50">
                          <div className="flex items-center gap-2">
                            <img
                              src="/assets/images/user-profile.jpg"
                              alt="profile"
                              className="w-7 h-7 rounded-full"
                            />
                            <p className="w-fit whitespace-nowrap">{d.name}</p>
                          </div>
                        </td>
                        <td className="py-2 px-5">
                          ₱
                          {Number(d.price).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-2 px-5">
                          <div
                            className={`px-2 py-1 border rounded-lg w-fit flex items-center gap-2 ${
                              d.status === "Available"
                                ? "border-green-400 text-green-400 bg-green-400/20"
                                : "border-red-400 text-red-400 bg-red-400/20"
                            }`}
                          >
                            {d.status === "Available" ? (
                              <>Available</>
                            ) : (
                              <>Unavailable</>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-5 whitespace-nowrap">
                          {dayjs(d.createdAt).format("MM/DD/YY, hh:mm:ss")}
                        </td>
                        <td className="py-2 px-5">
                          <div className="flex items-center gap-3 text-sm">
                            <button
                              onClick={() => onEditClick(d)}
                              className="px-3 py-1 rounded-lg bg-green-500 text-white font-bold cursor-pointer"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            Loading services. Please wait.
          </div>
        )}

        {!loading && data.length === 0 && (
          <div className="w-full h-96 flex justify-center items-center text-zinc-400 dark:text-zinc-600">
            No services found.
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

export default Table;
