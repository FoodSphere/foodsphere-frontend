import clsx from "clsx";

import { Input } from "@/app/components/ui/input";
import { Icons } from "@/app/icons";

interface InputComponentProps {
  label?: string;
  placeHolder?: string;
  isNum?: boolean;
  isTel?: boolean;
  isEmail?: boolean;
  isPassword?: boolean;
  validateKey?: string;
  getError?: (field: string) => string | undefined;
  state?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  iconState?: boolean;
  setIconState?: React.Dispatch<React.SetStateAction<boolean>>;
  isRequire?: boolean;
  onRemove?: () => void;
}

export const InputComponent = ({
  label,
  placeHolder,
  isNum,
  isTel,
  isEmail,
  isPassword = false,
  validateKey,
  getError,
  state,
  onChange,
  disabled,
  iconState,
  setIconState,
  isRequire,
  onRemove,
}: InputComponentProps) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && (
        <p>
          {label}
          {isRequire && <span className="text-primary-red-main">*</span>}
        </p>
      )}
      <div className="flex flex-col gap-1">
        <Input
          value={state}
          className={clsx(
            "disabled:opacity-100",
            {
              "border-urgent-fail-02":
                getError && validateKey && getError(validateKey),
            },
            {
              "placeholder:text-slate-300": state === "" || state === 0,
            }
          )}
          placeholder={placeHolder ? placeHolder : "กรุณากรอก"}
          type={
            isNum
              ? "number"
              : isTel
                ? "tel"
                : isEmail
                  ? "email"
                  : iconState === false
                    ? "password"
                    : "text"
          }
          onKeyDown={(e) => {
            if (
              isNum &&
              (e.key === "e" || e.key === "E" || e.key === "-" || e.key === "+")
            ) {
              e.preventDefault();
            }
          }}
          onWheel={(e) => (e.target as HTMLElement).blur()}
          onChange={onChange}
          disabled={disabled}
          BackIcon={
            isPassword ? (
              iconState ? (
                <Icons name="ShowPasswordIcon" className="w-5 h-5 text-gray-500" />
              ) : (
                <Icons name="HidePasswordIcon" className="w-5 h-5 text-gray-500" />
              )
            ) : (
              ""
            )
          }
          onIconClick={() => setIconState && setIconState(!iconState)}
        />

        {getError && validateKey && getError(validateKey) ? (
          <p className="text-urgent-fail-02 text-sm">{getError(validateKey)}</p>
        ) : null}
      </div>

      {onRemove && (
        <div className="flex justify-end">
          <Icons
            name="TrashIcon"
            onClick={onRemove}
            className="w-5 h-5 text-primary-red-main"
          />
        </div>
      )}
    </div>
  );
};
