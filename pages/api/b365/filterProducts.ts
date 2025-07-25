// Function to filter products by category, subcategory, and starts with
const filterProducts = (products: any[], category: string, subcategory: string, startsWith: string) => {
  return products.filter((product) => {
    return (
      product.Parent_Category === category &&
      product.Item_Category_Code === subcategory &&
      product.No.startsWith(startsWith)
    );
  });
};

export default filterProducts;
