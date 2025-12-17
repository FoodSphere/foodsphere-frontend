import { useState } from "react";

import { Input } from "@/app/components/ui/input";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Icons } from "@/app/icons";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imgUrl: string | null;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  onCashPayment: () => void;
  onQRPayment: () => void;
}

const MOCK_SUMMARY_ITEMS: OrderItem[] = [
  {
    id: "1",
    name: "Sea Bass Steak",
    price: 99,
    quantity: 1,
    imgUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2069",
  },
  {
    id: "2",
    name: "Fish & Ship",
    price: 79,
    quantity: 2,
    imgUrl: "https://images.unsplash.com/photo-1579208575657-c595a05383b7?auto=format&fit=crop&q=80&w=2070",
  },
  {
    id: "3",
    name: "Wagyu Steak",
    price: 300,
    quantity: 1,
    imgUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1780",
  },
  {
    id: "4",
    name: "Fish Onigiri Soup",
    price: 89,
    quantity: 2,
    imgUrl: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=1974",
  },
  {
    id: "5",
    name: "Soi Ju",
    price: 99,
    quantity: 1,
    imgUrl: "https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&q=80&w=2070",
  },
];

export const PaymentModal = ({
  isOpen,
  onClose,
  tableId,
  onCashPayment,
  onQRPayment,
}: PaymentModalProps) => {
  const [discountCode, setDiscountCode] = useState("");
  
  if (!isOpen) return null;

  const subtotal = 834.00;
  const discount = 34.00;
  const vat = 56.00;
  const total = 856.00;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-end bg-[rgba(0,0,0,0.5)]">
      <div className="bg-[#E5E5E5] rounded-l-3xl w-[1000px] h-full overflow-hidden shadow-2xl flex relative max-w-[90vw]">
        
        {/* Left Column: Order Summary (White Card) */}
        <div className="w-[55%] bg-white p-8 flex flex-col h-full rounded-tr-none z-10 shadow-[4px_0_24px_rgba(0,0,0,0.05)]">
           <div className="mb-6 mt-2 pt-4">
             <button 
                onClick={onClose}
                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-4"
              >
                <Icons name="ArrowLeftIcon" className="w-4 h-4" />
                <span className="underline text-sm font-medium">Back to table page</span>
              </button>

             <div className="bg-[#FF5C39] text-white px-6 py-2 rounded-lg text-xl font-bold inline-block shadow-sm mb-6">
                Table {tableId}
             </div>
             
             <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-2xl font-bold text-black">Order Summary</h2>
                <span className="text-lg text-gray-600">20 Items</span>
             </div>
             
             <div className="border-b-2 border-[#FF5C39] w-full"></div>
           </div>

           {/* ScrollArea container needs overflow-hidden to constrain the scroll area */}
           <div className="flex-1 overflow-hidden relative -mr-4 pr-4 pb-4">
             <ScrollArea className="h-full pr-4">
                <div className="space-y-4 pb-4 pt-2">
                  {MOCK_SUMMARY_ITEMS.map((item) => (
                    <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-24 border-[#FF5C39]">
                      <div className="w-32 bg-gray-200 shrink-0">
                        {item.imgUrl ? (
                          <img src={item.imgUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-300" />
                        )}
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-lg text-black line-clamp-1">{item.name}</h3>
                            <span className="font-bold text-lg text-black">X {item.quantity}</span>
                        </div>
                        <p className="text-gray-600 text-base">{item.price} Bahts</p>
                      </div>
                    </div>
                  ))}
                  {/* Duplicates to show scrolling */}
                  {MOCK_SUMMARY_ITEMS.map((item) => (
                    <div key={`${item.id}-dup`} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-24 border-[#FF5C39]">
                      <div className="w-32 bg-gray-200 shrink-0">
                        <img src={item.imgUrl || ""} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-lg text-black line-clamp-1">{item.name}</h3>
                            <span className="font-bold text-lg text-black">X {item.quantity}</span>
                        </div>
                        <p className="text-gray-600 text-base">{item.price} Bahts</p>
                      </div>
                    </div>
                  ))}
                  {MOCK_SUMMARY_ITEMS.map((item) => (
                    <div key={`${item.id}-dup2`} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex h-24 border-[#FF5C39]">
                      <div className="w-32 bg-gray-200 shrink-0">
                        <img src={item.imgUrl || ""} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 p-3 flex flex-col justify-center">
                        <div className="flex justify-between items-start w-full">
                            <h3 className="font-bold text-lg text-black line-clamp-1">{item.name}</h3>
                            <span className="font-bold text-lg text-black">X {item.quantity}</span>
                        </div>
                        <p className="text-gray-600 text-base">{item.price} Bahts</p>
                      </div>
                    </div>
                  ))}
                </div>
             </ScrollArea>
           </div>
        </div>

        {/* Right Column: Receipt Summary (Gray Background) */}
        <div className="flex-1 bg-[#E5E5E5] p-8 flex flex-col h-full pt-12">
            <div className="mt-8"> {/* Adjusted spacer */}
              <h2 className="text-2xl font-bold mb-4 text-black">Receipt Summary</h2> {/* Reduced gap mb-6 -> mb-4 */}
              
              <div className="mb-6">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Discount code..."
                  className="bg-white border-none h-12 text-base rounded-xl shadow-sm px-4 w-full"
                />
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-black text-base">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between text-black text-base">
                  <span>Discount</span>
                  <span>{discount.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between text-black text-base">
                  <span>Vat 7%</span>
                  <span>{vat.toFixed(2)} Bahts</span>
                </div>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-2xl font-bold text-black">Total</span>
                  <span className="text-2xl font-bold text-[#FF5C39]">{total.toFixed(2)} Bahts</span>
                </div>
              </div>

              <div className="space-y-3">
                <div onClick={onCashPayment} className="w-full bg-[#FF5C39] hover:bg-[#ff451f] text-white h-14 rounded-xl font-bold text-lg shadow-md flex items-center justify-between px-6 cursor-pointer transition-colors relative">
                  <span>Cash Pay</span>
                  <div className="bg-white text-[#FF5C39] font-bold w-8 h-8 rounded flex items-center justify-center text-xl">B</div>
                </div>
                
                <div onClick={onQRPayment} className="w-full bg-[#003D6B] hover:bg-[#002f52] text-white h-14 rounded-xl font-bold text-lg shadow-md flex items-center justify-between px-6 cursor-pointer transition-colors">
                  <span>Thai QR Pay</span>
                   <Icons name="ThaiQRIcon" className="w-6 h-6 fill-white" />
                </div>
              </div>

              <button 
                onClick={onClose} 
                className="mt-6 w-full text-center text-[#FF5C39] underline font-medium hover:text-[#d93f1d] text-sm"
              >
                Cancel
              </button>
            </div>
        </div>

      </div>
    </div>
  );
};
