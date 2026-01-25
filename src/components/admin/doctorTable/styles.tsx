import type { StylesConfig } from "react-select";
import type { Options } from "./table";

export const customStyles = (
  darkMode: boolean,
): StylesConfig<Options, boolean> => ({
  control: (provided) => ({
    ...provided,
    boxShadow: "none",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#09090b" : "white",
    border: darkMode ? "1px solid #3f3f46" : "1px solid #e4e4e7",
  }),

  menuList: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#09090b" : "white",
    paddingTop: 4,
    paddingBottom: 4,
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? darkMode
        ? "#27272a"
        : "#f4f4f5"
      : darkMode
      ? "#09090b"
      : "white",
    color: darkMode ? "#fafafa" : "#18181b",
    cursor: "pointer",
  }),

  singleValue: (provided, state) => ({
    ...provided,
    color: state.hasValue ? "#3b82f6" : darkMode ? "#fafafa" : "#18181b",
  }),

  multiValue: (provided) => ({
    ...provided,
    backgroundColor: darkMode ? "#27272a" : "#e4e4e7",
  }),

  multiValueLabel: (provided, state) => ({
    ...provided,
    color:
      state.getValue().length > 0
        ? "#3b82f6"
        : darkMode
        ? "#fafafa"
        : "#18181b",
  }),

  clearIndicator: (provided) => ({
    ...provided,
    color: "#3b82f6",
    "&:hover": { color: "#2563eb" },
  }),

  dropdownIndicator: (provided, state) => {
    const val = state.selectProps.value;
    const hasValue = Array.isArray(val) ? val.length > 0 : !!val;

    return {
      ...provided,
      color: hasValue ? "#3b82f6" : darkMode ? "#fafafa" : "#3f3f46",
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      transition: "transform 0.2s ease, color 0.2s ease",
    };
  },
});

