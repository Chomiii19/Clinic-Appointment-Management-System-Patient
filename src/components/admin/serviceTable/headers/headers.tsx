import {
  CalendarPlus2,
  Hospital,
  PhilippinePeso,
  Sparkles,
  Wand,
} from "lucide-react";
import { statusOption } from "../data";

export const tableHeaders = [
  {
    name: "Service Name",
    icon: <Hospital className="w-4" />,
    filter: false,
    singleValue: false,
    options: [],
    sortable: true,
  },
  {
    name: "Price",
    icon: <PhilippinePeso className="w-4" />,
    filter: false,
    singleValue: false,
    options: [{ value: "", label: "" }],
    sortable: true,
  },
  {
    name: "Status",
    icon: <Sparkles className="w-4" />,
    filter: true,
    singleValue: true,
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
