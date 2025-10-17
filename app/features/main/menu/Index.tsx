"use client";

import { FilterBarComponent } from "@/app/components/featureComponents/FilterBarComponent";
import { HistoryComponent } from "@/app/components/featureComponents/HistoryComponent";
// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";

interface MenuItem {
  id: string;
  imgUrl: string | null;
  title: string;
  amount: number;
  unit: string;
  ingredients: Array<{ title: string; amount: number }>;
}

const menuItems: MenuItem[] = [
  {
    id: "1",
    imgUrl: null,
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "2",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "3",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "4",
    imgUrl:
      "https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg",
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
  {
    id: "5",
    imgUrl: null,
    title: "Tonkutsu",
    amount: 80,
    unit: "Bahts",
    ingredients: [
      { title: "Ingredient 1", amount: 100 },
      { title: "Ingredient 2", amount: 200 },
    ],
  },
];

const MenuRender = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <FilterBarComponent />

      <div className="flex">
        {/* Menus Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          <ItemCardComponent
            imgUrl={null}
            title="Tonkutsu"
            amount={80}
            unit="Bahts"
            onAdd={() => console.log("Add Item")}
            useIngredients={true}
            Ingredients={[
              { title: "Ingredient 1", amount: 100 },
              { title: "Ingredient 2", amount: 200 },
            ]}
          />
          {menuItems.map((item) => (
            <ItemCardComponent
              key={item.id}
              imgUrl={item.imgUrl}
              title={item.title}
              amount={item.amount}
              unit={item.unit}
              onEdit={() => console.log("Edit Item")}
              onClose={() => console.log("Close Item")}
              useIngredients={true}
              Ingredients={item.ingredients}
            />
          ))}
        </div>

        <HistoryComponent />
      </div>

      {/* <ConfirmModalComponent 
        confirmType={ConfirmTypeEnum.AddMenu}
        itemName="Sukiyaki"
        onConfirm={() => console.log("Confirm")}
        onCancel={() => console.log("Cancel")}
      /> */}
    </div>
  );
};

export default MenuRender;
