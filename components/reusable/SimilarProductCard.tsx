import Image from "next/image";
//import { useDispatch } from "react-redux";
//import { addKitToCart, addToCart } from "@/redux/store/cartSlice";

import DisabledButton from "./DisabledButton";
import Link from "next/link";

import HoverButtonNew from "./HoverButtonNew";

interface CardProps {
  [key: string]: any;
}

const SimilarProductCard: React.FC<CardProps> = ({
  displayedProducts,
  category,
  sub,
  type,
  image,
  kitype,
}) => {
  //const dispatch = useDispatch();
  const active = true;

  console.log("kitype", kitype);

  /*const handleAddToCart = (id: string) => {
    console.log("id", id);
    const product = displayedProducts.find((product) => product._id === id);
    if (product) {
      dispatch(
        addToCart({
          id: product._id,
          name: product.name,
          price: product.cost,
          stock: product.stock,
          image: image,
          desc: product.desc || product.name,
          typeStock: product.typeStock,
          quantity: 1,
          option1: product.option1,
          option2: product.option2,
          sales: product.sales,
        })
      );
    }
  };

  const handleAddToCartKit = (kit: any) => {
    let totalPrice = 0; // Initialize totalPrice
    console.log('kit', kit);
    const kitId = kit.kit._id
    console.log("kitId", kitId);
    // Create an array of composants for the payload
    const composants = kit?.kit?.composants?.map((composant: any) => {
      const { quantity, totalPrice: composantTotalPrice } = getComponentQuantityAndPrice(
        kit.quantities,
        composant.cost,
        composant.name,
        composant.use
      );
  
      // Add composantTotalPrice to totalPrice
      totalPrice += composantTotalPrice;
  
      // Return the composant information along with its quantity and totalPrice
      return {
        id: composant._id,
        name: composant.name,
        quantity: quantity,
        price: composant.cost,
        totalPrice: typeof composantTotalPrice === 'number' ? Number(composantTotalPrice.toFixed(2)) : 0,
        image: image,
        desc: composant.name,
        stock: composant.stock,
        typeStock: "",
        option1: null,
        option2: null,
        sales: 0,
      };
    }) || [];

    
  
    // Dispatch the addToCart action with the kit information
    dispatch(
      addKitToCart({
        id: kitId,
        kitName: kit.name,
        totalPrice: totalPrice, 
        image: image,
        quantity: 1,
        composants: composants, 
        option1: '',
        option2: '',
      })
    );
  };

  const getComponentQuantityAndPrice = (
    quantities: any,
    cost: number,
    componentName: string,
    use: string
  ) => {
    const normalizedComponentName = componentName
      .toLowerCase()
      .replace(/\s/g, "");
    const usage = use; // Normalize component name
    if (normalizedComponentName === "outildedéconnexion") {
      const matchingKey = Object.keys(quantities).find(
        (key) => key.toLowerCase() === "nboutildeconnexion"
      );

      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    } else {
      const matchingKey = Object.keys(quantities).find((key) => {
        const normalizedKey = key.toLowerCase().replace(/^nb/, "");
        const normalKey = key;
        // Normalize quantity key
        // Check if the normalized component name contains the normalized key or vice versa
        return (
          normalizedKey.includes(normalizedComponentName) || normalKey === usage
        );
      });
      if (matchingKey) {
        const quantity = quantities[matchingKey];
        const totalPrice = quantity * cost;
        return { quantity: quantity, totalPrice: totalPrice };
      }
    }

    return { quantity: 0, totalPrice: 0 };
  };

  console.log(displayedProducts)*/

  // Utility function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength - 3) + "...";
    }
    return text;
  };

  return (
    <div className="lg:flex md:flex md:justify-start lg:justify-start justify-center mt-10 flex-wrap gap-2 lg:gap-[6px] md:gap-[40px] sm:w-[100%]">
      {displayedProducts.map((user, index) => {
        const { name, totalPrice } = user;
        return (
          <div className="relative lg:w-[19%] md:w-[45%] " key={index}>
 <div className="ml-[4px]  border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[4px]  bg-[#fee2b7] z-10 h-[87%] rounded-lg w-[100%] mx-auto flex justify-center"></div>

            <div
              className={`mx-auto w-[95%] z-40 group cursor-pointer relative mb-10 lg:w-full ${
                type === "product" ? "h-[275px]" : "h-[340px]"
              } bg-[#D0E5F2] rounded-md border border-gray-300 overflow-hidden ${
                active
                  ? "hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516]"
                  : ""
              } transition-all duration-200 ease-out transform translate-x-0`}
            >
              {active === true && (
                <div className="w-[60px] h-[60px] ml-auto mr-auto absolute top-8 lg:left-[60px] md:left-[60px] left-[160px] sm:left-[10px] md:group-hover:left-[80px] lg:group-hover:left-[80px] group-hover:left-[180px] group-hover:top-[42px] bg-transparent bg-opacity-100 rounded-[22px] transition-all duration-300 lg:group-hover:scale-150  "></div>
              )}
              <div className="flex mt-8 justify-center h-full mb-8">
                <Link
                  href={
                    type === "product"
                      ? `/produits/${category}/${sub}/${user._id}`
                      : `/produits/${category}/${sub}/${user.kit?._id}`
                  }
                  className="z-10"
                >
                  <Image
                    className="mr-2 h-20 w-20"
                    src={type === "product" ? `/images/${user.image}` : image}
                    alt="icon"
                    width={100}
                    height={50}
                    style={{
                      filter: !active ? "grayscale(100%)" : "none",
                      opacity: !active ? 0.2 : 1,
                    }}
                  />
                </Link>
              </div>
              {type === "product" ? (
                <div className="mt-20">
                  <Link href={`/produits/${category}/${sub}/${user._id}`}>
                    <div className="absolute bottom-[5px] left-0 right-0 ">
                      <div className="flex w-[90%] mx-auto justify-center h-20">
                        <h2 className="text-[16px] font-bold relative text-center">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {truncateText(name, 43)}
                          </span>
                        </h2>
                      </div>

                      <div></div>
                      <div className="mx-auto text-center">
                        {active ? (
                          <HoverButtonNew
                            color="6fb95a"
                            directTo={`/produits/${category}/${sub}/${user._id}`}
                          >
                            Voir le produit
                          </HoverButtonNew>
                        ) : (
                          <DisabledButton>Voir le produit</DisabledButton>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/*{active && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleAddToCart(_id)}
                        className="absolute bottom-4 bg-[#255D74] p-3 w-[85%] mx-auto text-white flex items-center justify-center rounded-[5px] space-x-2"
                      >
                        <ShoppingCart />
                        <span>Ajouter au panier</span>
                      </button>
                    </div>
                  )}*/}
                </div>
              ) : (
                <div className="mt-20">
                  <Link href={`/produits/${category}/${sub}/${user.kit?._id}`}>
                    <div className="absolute top-[130px] left-0 right-0  pl-[8px] ">
                      <div className="flex w-[90%] mx-auto">
                        <h2 className="text-[14px] font-bold relative ">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {name}
                          </span>
                        </h2>
                      </div>
                      <div className="flex w-[90%] mx-auto justify-between  text-[#5F5F5F] text-[16px] mt-4">
                        {/*<p className="text-[16px]">
                          Stock :{" "}
                          <span className="text-devinovGreen">
                            {" "}
                            {stock} {typeStock}{" "}
                          </span>
              </p>*/}

                        <h2 className="text-[13px] font-[500] text-[#255D74] relative">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {totalPrice}€
                          </span>
                        </h2>
                      </div>
                      {user?.kit?.description && (
                        <p className="text-[13px] p-4 ">
                          {user?.kit?.description}
                        </p>
                      )}

                      <div
                        className={`mx-auto text-center ${
                          kitype === "Kit De Fixation" ? "mt-[60px]" : "mt-0"
                        } `}
                      >
                        {active ? (
                          <HoverButtonNew
                            color="6fb95a"
                            directTo={`/produits/${category}/${sub}/${user.kit?._id}`}
                          >
                            Voir le produit
                          </HoverButtonNew>
                        ) : (
                          <DisabledButton>Voir le produit</DisabledButton>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/*{active && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleAddToCartKit(user)}
                        className="absolute bottom-4 bg-[#255D74] p-3 w-[85%] mx-auto text-white flex items-center justify-center rounded-[5px] space-x-2"
                      >
                        <ShoppingCart />
                        <span>Ajouter au panier</span>
                      </button>
                    </div>
                  )}*/}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SimilarProductCard;
