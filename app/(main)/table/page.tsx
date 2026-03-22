import { Suspense } from "react";

import TableRender from "@/app/features/main/table/Index";

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
