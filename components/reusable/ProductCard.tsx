import Image from "next/image";
import DisabledButton from "./DisabledButton";
import Link from "next/link";
import HoverButtonNew from "./HoverButtonNew";

interface CardProps {
  [key: string]: any;
}

const ProductCard: React.FC<CardProps> = ({
  displayedProducts,
  category,
  sub,
  type,
  image,
  kitype,
}) => {
  const active = true;

  console.log("type", type);
  console.log("kitype", kitype);
  console.log("displayedProducts", displayedProducts);

  return (
    <div className="lg:flex md:flex md:justify-start lg:justify-start justify-center mt-10 flex-wrap gap-2 lg:gap-[40px] md:gap-[40px] sm:w-[100%]">
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
          <div className="relative lg:w-[30%] md:w-[45%]" key={index}>
<div className="ml-[4px]  border-gray-300 absolute left-1/2 -translate-x-1/2 mt-[4px]  bg-[#fee2b7] z-10 h-[88%] rounded-lg w-[100%] mx-auto flex justify-center"></div>

            <div
              className={`mx-auto w-[95%] z-40 group cursor-pointer relative mb-10 lg:w-full ${
                type === "product" ? "h-[295px]" : "h-[420px]"
              } bg-[#d0e5f2] rounded-md border border-gray-300 overflow-hidden ${
                active
                  ? "hover:rounded-t-[0px] hover:border-t-2 hover:border-t-[#fab516]"
                  : ""
              } transition-all duration-200 ease-out transform translate-x-0`}
            >
              {active === true && (
                <div className="w-[60px] h-[60px] ml-auto mr-auto absolute top-8 lg:left-[120px] md:left-[100px] left-[100px] sm:left-[10px] md:group-hover:left-[140px] lg:group-hover:left-[140px] group-hover:left-[135px] group-hover:top-[42px] bg-transparent bg-opacity-100 rounded-[22px] transition-all duration-300 group-hover:scale-150"></div>
              )}
              <div className="flex mt-8 justify-center h-full mb-8">
                <Link
                  href={
                    type === "product" || (type === "kit" && kitype === "Kit PV")
                      ? `/produits/${category}/${sub}/${productId}`
                      : `/produits/${category}/${sub}/${productId}`
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
                <div className="mt-30">
                  <Link href={`/produits/${category}/${sub}/${productId}`}>
                    <div className="absolute bottom-[5px] left-0 right-0 ">
                      <div className="flex w-[90%] mx-auto justify-between mt-6 ">
                        <h2 className="text-[14px] font-bold relative mt-10">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {name}
                          </span>
                        </h2>
                      </div>
                      <div className="flex w-[90%] mx-auto justify-between  text-[#5F5F5F] text-[16px] ">
                        <p className={`text-[16px] `}>
                          Référence :{" "}
                          <span
                            className={`text-[16px] text-regular ${"text-devinovGreen"}`}
                          >
                            {ref}
                          </span>
                        </p>
                      </div>
                      <div className="flex w-[90%] mx-auto justify-between  text-[#5F5F5F] text-[16px] mb-4">
                        <p className="text-[16px] ">
                          Stock: {stock === 0 || stock_reel === 0 || status !== 'available' ? (
                            <span className="text-red-500">Indisponible</span>
                          ) : (
                            <span className="text-[#7dc06a]">Disponible</span>
                          )}
                        </p>
                        <p className="text-[13px] font-[500] text-[#255D74] relative">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {cost}€
                          </span>
                        </p>
                      </div>
                      <div></div>
                      <div className="mx-auto text-center">
                        {active ? (
                          <HoverButtonNew
                            color="6fb95a"
                            directTo={`/produits/${category}/${sub}/${productId}`}
                          >
                            Consulter
                          </HoverButtonNew>
                        ) : (
                          <DisabledButton>Consulter</DisabledButton>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                <div className="mt-30">
                  <Link href={`/produits/${category}/${sub}/${productId}`}>
                    <div className="absolute top-[130px] left-0 right-0  pl-[8px] ">
                      <div className="flex w-[90%] mx-auto">
                        <p className="text-[14px] font-bold relative ">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {name}
                          </span>
                        </p>
                      </div>
                      <div className="flex w-[90%] mx-auto justify-between  text-[#5F5F5F] text-[16px] mt-4">
                        <p className="text-[13px] font-[500] text-[#255D74] relative">
                          <span className={` ${!active ? "opacity-20" : ""}`}>
                            {totalPrice}€
                          </span>
                        </p>
                      </div>
                      {productDescription && (
                        <p className="text-[13px] p-4 ">
                          {productDescription}
                        </p>
                      )}
                      <div className={`mx-auto text-center ${kitype === "Kit De Fixation" ? "mt-[60px]" : "mt-0"} `}>
                      {active ? (
                          <HoverButtonNew
                            color="6fb95a"
                            directTo={`/produits/${category}/${sub}/${productId}`}
                          >
                            Consulter
                          </HoverButtonNew>
                        ) : (
                          <DisabledButton>Consulter</DisabledButton>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductCard;