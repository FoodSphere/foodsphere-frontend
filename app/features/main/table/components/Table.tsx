interface TableProps {
  id: string;
  hasCustomers: boolean;
  badge?: number;
  onClick: (id: string) => void;
}

export const Table = ({
  id,
  hasCustomers,
  badge,
  onClick,
}: TableProps) => {
  return (
    <button
      className={`relative h-40 w-60 rounded-lg text-white text-2xl font-semibold transition-all hover:scale-105 
              ${hasCustomers ? "bg-primary-orange-main" : "bg-gray-600"}`}
      onClick={() => onClick(id)}
    >
      Table {id}
      {hasCustomers && (badge ?? 0) > 0 && (
        <span className="absolute top-[-10px] right-[-10px] bg-red-500 text-white rounded-full px-2 py-1 text-sm">
          {badge}
        </span>
      )}
    </button>
  );
};
