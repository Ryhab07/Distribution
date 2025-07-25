// filterProducts.test.ts

import filterProducts from '../../pages/api/b365/filterProducts';

describe('filterProducts function', () => {
  // Mocked objects for NextApiRequest and NextApiResponse
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should filter products based on category, subcategory, and startsWith', () => {
    // Mock data for products
    const mockProducts = [
      {
        Parent_Category: '',
        Item_Category_Code: '',
        NO: 'TestProduct1',
      },
      {
        Parent_Category: 'TestCategory',
        Item_Category_Code: 'TestSubcategory',
        NO: 'TestProduct2',
      },
      // Add more mock products as needed
    ];

    // Call filterProducts with mock request, response, and parameters
    filterProducts(mockRequest, mockResponse, 'TestCategory', 'TestSubcategory', 'Test');

    // Expectations
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ products: expect.any(Array) });

    // Check if the filtered products match the expected result
    const filteredProducts = mockResponse.json.mock.calls[0][0].products;
    expect(filteredProducts).toEqual(expect.arrayContaining(mockProducts));
  });

  // Add more test cases as needed

});
