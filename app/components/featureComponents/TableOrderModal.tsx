import { useState } from "react";

import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "Completed" | "Pending";
  imgUrl: string | null;
}

interface TableOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  onCheckBill?: () => void;
}

const MOCK_ORDERS: OrderItem[] = [
  {
    id: "1",
    name: "Soi Ju",
    price: 150,
    quantity: 1,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2069",
  },
  {
    id: "2",
    name: "Fish & Ships",
    price: 89,
    quantity: 2,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "3",
    name: "Mapo Tofu",
    price: 80,
    quantity: 1,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1780",
  },
  {
    id: "4",
    name: "Ice",
    price: 10,
    quantity: 1,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "5",
    name: "Beer Chang",
    price: 80,
    quantity: 2,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "6",
    name: "Water",
    price: 10,
    quantity: 2,
    status: "Completed",
    imgUrl: "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&q=80&w=1974",
  },
];

export const TableOrderModal = ({
  isOpen,
  onClose,
  tableId,
  onCheckBill,
}: TableOrderModalProps) => {
  const [orders, setOrders] = useState<OrderItem[]>(MOCK_ORDERS);

  if (!isOpen) return null;

  const subtotal = orders.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const vat = subtotal * 0.07;
  const total = subtotal - discount + vat;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-[rgba(0,0,0,0.5)]">
      <div className="bg-[#E5E5E5] rounded-l-3xl w-[900px] h-full overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 pt-8 pb-4 shrink-0">
          <div className="bg-[#FF5C39] text-white px-8 py-3 rounded-xl text-2xl font-bold shadow-md">
            Table {tableId}
          </div>
          <button 
            onClick={onClose}
            className="bg-[#FF5C39] text-white p-3 rounded-full shadow-md hover:bg-[#ff451f] transition-colors"
          >
            <Icons name="ArrowRightIcon" className="w-6 h-6" />
          </button>
        </div>

        <div className="border-b border-gray-300 mx-8 mb-6 shrink-0"></div>

        <div className="flex gap-8 flex-1 overflow-hidden px-8 pb-8">
          {/* Left Column */}
          <div className="w-[320px] flex flex-col gap-6 shrink-0">
            {/* QR Section */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-medium text-black">
                QR <span className="text-[#FF5C39]">Table{tableId}</span> for Ordering
              </p>
              <div className="bg-transparent p-2">
                {/* QR Code Placeholder - Matching style */}
                <div className="w-[200px] h-[200px] bg-black p-2 rounded-lg">
                   <div className="w-full h-full bg-white flex flex-wrap content-center justify-center gap-1 p-2">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div key={i} className={`w-3 h-3 ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`} />
                      ))}
                   </div>
                </div>
              </div>
              <button className="bg-[#FF5C39] hover:bg-[#ff451f] text-white px-10 py-3 rounded-xl font-bold text-lg shadow-md flex items-center gap-3 transition-colors">
                Print <Icons name="PrintIcon" className="w-6 h-6" />
              </button>
            </div>

            {/* Summary Section */}
            <div className="mt-auto">
              <h3 className="text-2xl font-bold mb-4 text-black">Summary</h3>
              <div className="space-y-2 text-lg">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Discount</span>
                  <span>{discount.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Vat 7%</span>
                  <span>{vat.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between text-2xl font-bold mt-4">
                  <span className="text-black">Total</span>
                  <span className="text-[#FF5C39]">{total.toFixed(2)} Bahts</span>
                </div>
              </div>
              
              <button 
                onClick={onCheckBill}
                className="w-full bg-[#FF5C39] hover:bg-[#ff451f] text-white py-4 rounded-xl font-bold text-xl shadow-md mt-6 flex items-center justify-center gap-3 transition-colors"
              >
                Check Bill <Icons name="OrderIcon" className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Column - Order List */}
          <div className="flex-1 bg-white rounded-3xl p-6 flex flex-col shadow-sm h-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-4 text-black">Order</h2>
            
            <div className="flex-1 overflow-hidden relative">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex gap-4 items-start border-b border-gray-100 pb-4 last:border-0">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {order.imgUrl ? (
                          <img src={order.imgUrl} alt={order.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-black truncate pr-2">{order.name}</h4>
                          <span className="bg-[#4ADE80] text-white text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wide shrink-0">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-gray-500 font-medium">{order.price} B</span>
                          <span className="text-black font-bold">x {order.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 shrink-0">
              <button className="w-full bg-[#FF5C39] hover:bg-[#ff451f] text-white py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors">
                Add Order <Icons name="PlusIcon" className="w-6 h-6" />
              </button>
              <button className="w-full bg-[#5C5C5C] hover:bg-[#4a4a4a] text-white py-3 rounded-xl font-bold text-lg shadow-md flex items-center justify-center gap-2 transition-colors">
                Edit Order <Icons name="EditIcon" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
