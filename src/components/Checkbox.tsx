import { Check } from "lucide-react";

interface CustomCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
}

export function CustomCheckbox({
  checked,
  indeterminate = false,
  onChange,
}: CustomCheckboxProps) {
  const handleClick = () => {
    if (indeterminate) {
      onChange(true);
    } else {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`w-4 h-4
        flex items-center justify-center
        border ${
          checked
            ? "bg-blue-500 border-blue-500"
            : "border-zinc-400 dark:border-zinc-600"
        }
        rounded-sm
        bg-white dark:bg-zinc-900
        cursor-pointer
        select-none`}
    >
      {indeterminate ? (
        <div className="w-2 h-0.5 bg-white rounded"></div>
      ) : (
        checked && (
          <div className="w-full h-full bg-blue-500 flex justify-center items-center">
            <Check className="w-3 h-3 text-white" />
          </div>
        )
      )}
    </div>
  );
}
