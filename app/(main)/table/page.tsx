import TableRender from "@/app/features/main/table/Index";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense>
        <TableRender />
      </Suspense>
    </div>
  );
};

export default page;
