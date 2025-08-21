"use client";

// import { ConfirmModalComponent } from "@/app/components/featureComponents/ConfirmModalComponent";
// import { ConfirmTypeEnum } from "@/public/enum/confirmModalEnum";
import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent";

const MenuRender = () => {
  return (
    <div className="flex gap-10">
      <div className="text-red-500">Menu Hello World!!!</div>
      <ItemCardComponent
        title="Tonkutsu"
        amount={80}
        unit="Bahts"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        useIngredients={true}
        showIngredients={true}
        setShowIngredientsState={() => console.log("Set Show Ingredients")}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
      <ItemCardComponent
        imgUrl="https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg"
        title="Tonkutsu"
        amount={80}
        unit="Bahts"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        useIngredients={true}
        showIngredients={false}
        setShowIngredientsState={() => console.log("Set Show Ingredients")}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
      <ItemCardComponent
        imgUrl="https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg"
        title="Tonkutsu"
        amount={80}
        unit="Bahts"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        useIngredients={true}
        showIngredients={true}
        setShowIngredientsState={() => console.log("Set Show Ingredients")}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
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
