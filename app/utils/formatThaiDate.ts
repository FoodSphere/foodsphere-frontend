import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";

export const formatThaiDate = (isoString: string) => {
  const date = parseISO(isoString);
  const buddhistYear = date.getFullYear() + 543;

  const formattedDate = format(date, "d MMMM", { locale: th });

  return `${formattedDate} ${buddhistYear}`;
};
