import { Icons } from "@/app/icons";

const DashboardRender = () => {
  return (
    <div>
      <div className="text-complete-01">Dashboard Hello World!!!</div>
      <div className="flex flex-col"> 
        <Icons name="HidePasswordIcon" className="w-20 text-fail-01"/>
        <Icons name="RestaurantIcon" className="w-20 text-fail-01"/>
        <Icons name="SearchIcon" className="w-20 text-fail-01"/>
        <Icons name="SettingIcon" className="w-20 text-fail-01"/>
        <Icons name="ShowPasswordIcon" className="w-20 text-fail-01"/>
        <Icons name="StockIcon" className="w-20 text-fail-01"/>
        <Icons name="TableIcon" className="w-20 text-fail-01"/>
        <Icons name="ThaiQRIcon" className="w-20 text-fail-01"/>
        <Icons name="TrashIcon" className="w-20 text-fail-01"/>
        <Icons name="TrendDownIcon" className="w-20 text-fail-01"/>
        <Icons name="TrendUpIcon" className="w-20 text-fail-01"/>
        <Icons name="UploadIcon" className="w-20 text-fail-01"/>
      </div>
    </div>
  );
};

export default DashboardRender;
