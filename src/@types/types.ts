import type { SingleValue, MultiValue } from "react-select";
import type { Options } from "../components/patient/appointmentTable/allAppointments/table";

export type FilterValue = SingleValue<Options> | MultiValue<Options> | null;
export type FiltersState = Record<string, FilterValue>;

export type OptionType = {
  value: string;
  label: string;
};
