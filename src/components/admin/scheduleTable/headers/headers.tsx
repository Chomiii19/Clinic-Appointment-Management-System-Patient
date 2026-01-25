import { Calendar, CalendarPlus2, ShieldUser, Wand } from "lucide-react";
import { statusOption } from "../data";

export const tableHeaders = [
  {
    name: "Doctor Name",
    icon: <ShieldUser className="w-4" />,
    filter: true,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Start",
    icon: <Calendar className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "End",
    icon: <Calendar className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Created At",
    icon: <CalendarPlus2 className="w-4" />,
    filter: false,
    singleValue: false,
    options: statusOption,
    sortable: true,
  },
  {
    name: "Action",
    icon: <Wand className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: false,
  },
];
