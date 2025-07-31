'use client'

import { ItemCardComponent } from "@/app/components/featureComponents/ItemCardComponent"

const MenuRender = () => {
  return (
    <div className="flex">
      <div className='text-red-500'>Menu Hello World!!!</div>
      <ItemCardComponent
        page="menu"
        imgUrl="https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg"
        title="Tonkutsu"
        amount={10}
        unit="kg"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        showIngredients={true}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
      <ItemCardComponent
        page="stock"
        imgUrl="https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg"
        title="Tonkutsu"
        amount={10}
        unit="kg"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        showIngredients={true}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
      <ItemCardComponent
        page="stock"
        imgUrl="https://www.japanesecooking101.com/wp-content/uploads/2012/03/IMG_3833.jpeg"
        title="Tonkutsu"
        amount={10}
        unit="kg"
        onEdit={() => console.log("Edit Item")}
        onClose={() => console.log("Close Item")}
        showIngredients={true}
        Ingredients={[
          { title: "Ingredient 1", amount: 100 },
          { title: "Ingredient 2", amount: 200 },
        ]}
      />
    </div>
  )
}

export default MenuRender
