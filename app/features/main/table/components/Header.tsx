interface HeaderProps {
  totalTable: number;
}

export const Header = ({ totalTable }: HeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Tables</h1>
      </div>

      <div className="flex gap-4 items-center justify-end">
        <p className="text-primary-orange-main text-xl">
          Total: {totalTable} tables
        </p>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1 items-center">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span>No Customers</span>
          </div>
          <div className="flex gap-1 items-center">
            <div className="w-4 h-4 bg-primary-orange-main rounded"></div>
            <span>Have Customers</span>
          </div>
        </div>
      </div>
    </>
  );
};
