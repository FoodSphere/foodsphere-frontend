interface TableProps {
  id: string;
  hasCustomers: boolean;
  onClick: (id: string) => void;
}

export const Table = ({
  id,
  hasCustomers,
  onClick,
}: TableProps) => {
  return (
    <button
      className={`h-40 w-60 rounded-lg text-white text-2xl font-semibold transition-all hover:scale-105 
              ${hasCustomers ? "bg-primary-orange-main" : "bg-gray-600"}`}
      onClick={() => onClick(id)}
    >
      Table {id}
    </button>
  );
};
