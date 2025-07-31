import React from "react";

import { AddIcon } from "@/public/icons/AddIcon";
import { ArrowDownDoubleIcon } from "@/public/icons/ArrowDownDoubleIcon";
import { ArrowDownIcon } from "@/public/icons/ArrowDownIcon";
import { ArrowLeftIcon } from "@/public/icons/ArrowLeftIcon";
import { ArrowRightIcon } from "@/public/icons/ArrowRightIcon";
import { ArrowUpDoubleIcon } from "@/public/icons/ArrowUpDoubleIcon";
import { BahtIcon } from "@/public/icons/BahtIcon";
import { CalendarIcon } from "@/public/icons/CalendarIcon";
import { CheckIcon } from "@/public/icons/CheckIcon";
import { CloseIcon } from "@/public/icons/CloseIcon";
import { CustomerIcon } from "@/public/icons/CustomerIcon";
import { DashboardIcon } from "@/public/icons/DashboardIcon";
import { EditIcon } from "@/public/icons/EditIcon";
import { LogoutIcon } from "@/public/icons/LogoutIcon";
import { MenuIcon } from "@/public/icons/MenuIcon";
import { MinusIcon } from "@/public/icons/MinusIcon";
import { OrderIcon } from "@/public/icons/OrderIcon";
import { PlusIcon } from "@/public/icons/PlusIcon";
import { PencilIcon } from "@/public/icons/PencilIcon";
import { PrintIcon } from "@/public/icons/PrintIcon";
import { PromotionIcon } from "@/public/icons/PromotionIcon";
import { HidePasswordIcon } from "@/public/icons/HidePasswordIcon";
import { RestaurantIcon } from "@/public/icons/RestaurantIcon";
import { SearchIcon } from "@/public/icons/SearchIcon";
import { SettingIcon } from "@/public/icons/SettingIcon";
import { ShowPasswordIcon } from "@/public/icons/ShowPasswordIcon";
import { StockIcon } from "@/public/icons/StockIcon";
import { TableIcon } from "@/public/icons/TableIcon";
import { ThaiQRIcon } from "@/public/icons/ThaiQRIcon";
import { TrashIcon } from "@/public/icons/TrashIcon";
import { TrendDownIcon } from "@/public/icons/TrendDownIcon";
import { TrendUpIcon } from "@/public/icons/TrendUpIcon";
import { UploadIcon } from "@/public/icons/UploadIcon";

const iconNames = {
  AddIcon,
  ArrowDownDoubleIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDoubleIcon,
  BahtIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  CustomerIcon,
  DashboardIcon,
  EditIcon,
  LogoutIcon,
  MenuIcon,
  MinusIcon,
  OrderIcon,
  PlusIcon,
  PencilIcon,
  PrintIcon,
  PromotionIcon,
  HidePasswordIcon,
  RestaurantIcon,
  SearchIcon,
  SettingIcon,
  ShowPasswordIcon,
  StockIcon,
  TableIcon,
  ThaiQRIcon,
  TrashIcon,
  TrendDownIcon,
  TrendUpIcon,
  UploadIcon,
};

type IconProps = {
  name: keyof typeof iconNames;
} & React.SVGProps<SVGSVGElement>;

const Icons: React.FC<IconProps> = ({ name, ...props }) => {
  const SvgIcon = iconNames[name];
  if (!SvgIcon) {
    return null;
  }
  return <SvgIcon className="w-auto" {...props} />;
};

export { Icons, iconNames };
