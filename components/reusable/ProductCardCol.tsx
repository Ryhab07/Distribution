import Image from "next/image";
//import { useDispatch } from "react-redux";
//import { addKitToCart, addToCart } from "@/redux/store/cartSlice";
import { ArrowRightCircle } from "lucide-react";
import HoverButton from "./HoverButton";
import DisabledButton from "./DisabledButton";
import Link from "next/link";

interface CardProps {
  [key: string]: any;
}

const ProductCardCol: React.FC<CardProps> = ({
  displayedProducts,
  category,
  sub,
  type,
  image,
  kitype,
}) => {
  //const dispatch = useDispatch();
  const active = true;

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
  };*/

  /*const handleAddToCartKit = (kit: any) => {
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
  };*/

  /*const getComponentQuantityAndPrice = (
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
  };*/

  console.log(displayedProducts);
  console.log("displayedProducts", displayedProducts);

  return (
    <div className=" mt-10">
      {displayedProducts.map((user, index) => {
        const { name, totalPrice, stock, cost, ref, stock_reel, status, description, _id, kit } = user;
        // Debugging logs for user object
        console.log("user", user);
        console.log("user description:", description);
        console.log("user _id:", _id);
        console.log("user kit:", kit);

        // Determine the correct description and ID based on type and kitype
        const productDescription = type === "kit" && kitype === "Kit PV" ? user.description : description;
        const productId =
        type === "kit" && kitype === "Kit PV"
          ? _id
          : type === "kit" && kitype === "Kit De Fixation"
          ? user?.kit?._id || _id // Fallback to _id if user.kit is undefined
          : _id;

        console.log("productDescription:", productDescription);
        console.log("productId:", productId);

        return (
          <div
            key={index}
            className={`flex group cursor-pointer w-full lg:w-full mb-4 ${
              type !== "product" ? "h-[200px]" : "h-[150px]"
            } gap-10 bg-white rounded-md border border-gray-300 overflow-hidden ${
              active
                ? "hover:rounded-t-0 hover:border-t-2 hover:border-devinovGreen"
                : ""
            } transition-all duration-200 ease-out transform translate-x-0`}
          >
            {/*{active && (
              <div className="w-[60px] h-[60px] ml-auto mr-auto absolute top-8 left-[140px] lg:left-[120px] group-hover:left-[150px] lg:group-hover:left-[140px] group-hover:top-[42px] bg-[#efefef] bg-opacity-35 rounded-[22px] transition-all duration-300 group-hover:scale-150"></div>
            )}*/}
            <div className="flex justify-center h-full mt-8  mb-8 w-[20%]">
              <Link
                className=" "
                href={
                  type === "product"
                    ? `/produits/${category}/${sub}/${user.productId}`
                    : `/produits/${category}/${sub}/${user.productId}`
                }
              >
                <div className="z-10 mt-[-20px]">
                  <Image
                    className={`lg:h-[140px] lg:!w-[100px] !h-[110px] !w-[90px] m-2 mt-0 `}
                    src={type === "product" ? `/images/${user.image}` : image}
                    alt="icon"
                    width={250}
                    height={250}
                    style={{
                      filter: !active ? "grayscale(100%)" : "none",
                      opacity: !active ? 0.2 : 1,
                    }}
                  />
                </div>
              </Link>
              <div className="border-l border-[#d1d5db] h-[90%] w-1 mt-[-20px] ml-8"></div>
            </div>
            {type === "product" ? (
              <div className="flex justify-start h-full   w-[80%] p-4">
                <Link
                  href={
                    type === "product"
                      ? `/produits/${category}/${sub}/${productId}`
                      : `/produits/${category}/${sub}/${productId}`
                  }
                  className="w-full"
                >
                  <div className="w-full">
                    <div className="flex mx-auto justify-between">
                      <h2 className="lg:text-[16px] font-bold relative text-[14px]">
                        <span className={` ${!active ? "opacity-20" : ""}`}>
                          {name}
                        </span>
                      </h2>
                      <p className="lg:text-[20px] text-[14px] font-[500] text-devinovBleu">
                        <span className={` ${!active ? "opacity-20" : ""}`}>
                          {cost}€
                        </span>
                      </p>
                    </div>
                    <div className="flex w-full mx-auto justify-between  text-[#5F5F5F] lg:text-[16px] text-[12px] ">
                      <p className="text-[16px]">Reférence : <span className="text-[#7dc06a]">{ref}</span></p>
                    </div>

                    <div className="flex w-full mx-auto justify-between  text-[#5F5F5F] lg:text-[16px] text-[12px]">
                      <p className="text-[16px] ">
                        Stock: {stock === 0 || stock_reel === 0 || status !== 'available'? <span className="text-red-500">Indisponible</span> : <span className="text-[#7dc06a]">Disponible</span>}

                      </p>
                    </div>
                    <div className="text-end mb-4 pl-6">
                      {active ? (
                        <HoverButton
                          color="6fb95a"
                          directTo={
                            type === "product"
                              ? `/produits/${category}/${sub}/${productId}`
                              : `/produits/${category}/${sub}/${productId}`
                          }
                        >
                          <ArrowRightCircle />
                          Consulter
                        </HoverButton>
                      ) : (
                        <DisabledButton>
                          <ArrowRightCircle />
                          Consulter
                        </DisabledButton>
                      )}
                      {/*<Link href={`/produits/${category}/${sub}/${user.kit?._id}`}>
                      <p className="text-[#fab516] hover:text-[#227ba8] hover:font-[600]">Consulter</p>
                      </Link>*/}
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
              <div className="flex justify-start h-full   w-[80%] p-4">
                <Link
                  href={`/produits/${category}/${sub}/${productId}`}
                  className="w-full"
                >
                  <div className="w-full">
                    <div className="flex mx-auto justify-between">
                      <p className="lg:text-[20px] font-bold relative text-[14px]">
                        <span className={` ${!active ? "opacity-20" : ""}`}>
                          {name}
                        </span>
                      </p>

                      <p className="lg:text-[20px] text-[14px] font-[500] text-[#255D74]">
                        <span className={` ${!active ? "opacity-20" : ""}`}>
                          {totalPrice}€
                        </span>
                      </p>
                    </div>
                    <p className="text-[16px] mt-4">{user.kit?.description}</p>
                    {/*<div className="flex w-full mx-auto justify-between mt-2 text-[#5F5F5F] lg:text-[16px] text-[12px] mb-4">
                      <p className="text-[16px]">
                        Stock : {stock} {typeStock}
                      </p>

            </div>*/}
                    <div className="text-end mb-4 pl-6">
                      {active ? (
                        <HoverButton
                          color="6fb95a"
                          directTo={`/produits/${category}/${sub}/${productId}`}
                        >
                          <ArrowRightCircle />
                          Consulter
                        </HoverButton>
                      ) : (
                        <DisabledButton>
                          <ArrowRightCircle />
                          Consulter
                        </DisabledButton>
                      )}
                      {/*<Link href={`/produits/${category}/${sub}/${user.kit?._id}`}>
                      <p className="text-[#fab516] hover:text-[#227ba8] hover:font-[600]">Consulter</p>
                      </Link>*/}
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
        );
      })}
    </div>
  );
};

export default ProductCardCol;
