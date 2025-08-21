import { OrderCardDisplay } from "./components/OrderCardDisplay";

const OrderRender = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="text-red-500">Order Hello World!!!</div>
      <OrderCardDisplay />
    </div>
  );
};

export default OrderRender;
