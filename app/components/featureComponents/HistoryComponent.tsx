import React from "react";
import Image from "next/image";

import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

// 1. กำหนด Type สำหรับข้อมูล History
type HistoryStatus = "New" | "Edited" | "Deleted";

type HistoryItem = {
  id: number;
  name: string;
  menuNumber: string;
  status: HistoryStatus;
  date: string;
  time: string;
  imageUrl: string;
};

// 2. สร้างข้อมูลตัวอย่าง (Mock Data)
const historyData: HistoryItem[] = [
  {
    id: 1,
    name: "Wagyu Steak",
    menuNumber: "000121",
    status: "New",
    date: "10/03/2025",
    time: "18:00",
    imageUrl:
      "",
  },
  {
    id: 2,
    name: "Sea Bass Steak",
    menuNumber: "000121",
    status: "Edited",
    date: "10/03/2025",
    time: "17:48",
    imageUrl:
      "",
  },
  {
    id: 3,
    name: "Pa-nang Curry",
    menuNumber: "000048",
    status: "Edited",
    date: "08/03/2025",
    time: "19:23",
    imageUrl:
      "",
  },
  {
    id: 4,
    name: "Wine",
    menuNumber: "000052",
    status: "Deleted",
    date: "08/03/2025",
    time: "07:19",
    imageUrl:
      "",
  },
  {
    id: 5,
    name: "Mohito",
    menuNumber: "000099",
    status: "Edited",
    date: "02/03/2025",
    time: "16:07",
    imageUrl:
      "",
  },
  {
    id: 6,
    name: "Paella",
    menuNumber: "000102",
    status: "Deleted",
    date: "27/02/2025",
    time: "06:56",
    imageUrl:
      "",
  },
  {
    id: 7,
    name: "Sea Bass Steak",
    menuNumber: "000121",
    status: "New",
    date: "14/02/2025",
    time: "10:10",
    imageUrl:
      "",
  },
  {
    id: 8,
    name: "Soi Ju",
    menuNumber: "000120",
    status: "New",
    date: "10/02/2025",
    time: "17:29",
    imageUrl:
      "",
  },
];

// 3. สร้าง Compo
export function HistoryComponent() {
  // Function สรับ map status ไปยัง variant ของ Badge
  const getBadgeVariant = (status: HistoryStatus) => {
    switch (status) {
      case "New":
        return "success";
      case "Edited":
        return "warning";
      case "Deleted":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-50 border-gray-200 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          Menu History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <ScrollArea className="h-[500px] w-full bg-white rounded-lg border p-1">
          <div className="p-4 space-y-4">
            {historyData.map((item, index) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center space-x-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getBadgeVariant(item.status)}>
                        {item.status}
                      </Badge>
                      <p className="text-xs text-gray-500">{`${item.date}   ${item.time}`}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      Menu # {item.menuNumber}
                    </p>
                  </div>
                </div>
                {index < historyData.length - 1 && (
                  <Separator className="my-4 bg-red-200" />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
