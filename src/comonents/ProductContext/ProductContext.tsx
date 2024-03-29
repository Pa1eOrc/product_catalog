/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Product } from '../../type/Product';
import * as ProductClient from '../api/products';
import { DropdownIterface, Option } from '../../type/Dropdown';
import { getPhones } from '../api/phones';
import { getTablets } from '../api/tablets';
import { getAccessories } from '../api/accessories';
import { ProductDeatails } from '../../type/ProductDetails';
import { useLocalStorage } from '../../helpers/localStorage/useLocalStorage';
import { fetchProducts, fetchDetails } from '../../helpers/fetch/fetchClient';
import { filterProductsById }
  from '../../helpers/utils/sortHelperFunctions';

type Props = {
  children: React.ReactNode;
};

type ProductsContextProps = {
  products: Product[],
  hotPriceProducts: Product[],
  newBrandProducts: Product[],
  links: string[],
  sortDropdown: DropdownIterface,
  perPageDropdown: DropdownIterface,
  page: number,
  sort: string,
  query: string,
  perPage: string,
  setPerPage: (length: number) => number;
  setPageCount: (length: number, perPageToNum: number) => number[],
  setStartIndex: (perPageToNum: number) => number,
  phones: Product[],
  isLoading: boolean,
  tablets: Product[]
  accessories: Product[],
  setCurrentOption: (options: Option, currentValue: string) => string,
  productDetails: ProductDeatails,
  selectedProductId: string,
  setSelectedProductId: (selectedProductId: string) => void,
  selectedProduct: Product,
  getArrayLength: (array: Product[]) => number,
  carts: Product[],
  setCarts: (v: Product[]) => void,
  randomProducts: Product[],
  favourites: Product[],
  setFavourites: (v: Product[]) => void,
  isProductAdded: (productsToCheck: Product[], id: string) => boolean,
  getArrayUpdates: (
    productsToUpdare: Product[], productToCheck: Product) => Product[],
  isProductNotFound: boolean;
  isError: string,
  isMessage: boolean,
  setIsMessage: (isMessage: boolean) => void,
  isMobile: boolean,
  screenWidth: number,
};

export const ProductsContext = React.createContext<ProductsContextProps>({
  products: [],
  hotPriceProducts: [],
  newBrandProducts: [],
  links: [],
  sortDropdown: {
    name: '',
    options: {},
    isOpen: false,
  },
  perPageDropdown: {
    name: '',
    options: {},
    isOpen: false,
  },
  page: 0,
  sort: '',
  query: '',
  perPage: '',
  setPerPage: () => 0,
  setPageCount: () => [],
  setStartIndex: () => 0,
  phones: [],
  isLoading: true,
  tablets: [],
  accessories: [],
  setCurrentOption: () => '',
  productDetails: {
    id: '',
    capacityAvailable: [],
    colorsAvailable: [],
    color: '',
    capacity: '',
    namespaceId: '',
    images: [],
    description: [
      {
        title: '',
        text: [],
      },
    ],
    resolution: '',
    processor: '',
    camera: '',
    zoom: '',
    cell: [],
  },
  selectedProductId: '',
  setSelectedProductId: () => '',
  selectedProduct: {
    fullPrice: 0,
    price: 0,
    year: 0,
    id: '',
    itemId: '',
    capacity: '',
    name: '',
    image: '',
    category: '',
    screen: '',
    ram: '',
  },
  getArrayLength: () => 0,
  carts: [],
  setCarts: () => [],
  randomProducts: [],
  favourites: [],
  setFavourites: () => [],
  isProductAdded: () => false,
  getArrayUpdates: () => [],
  isProductNotFound: false,
  isError: '',
  isMessage: false,
  setIsMessage: () => {},
  isMobile: false,
  screenWidth: 1040,
});

export const ProductsProvider: React.FC<Props> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [hotPriceProducts, setHotPriceProducts] = useState<Product[]>([]);
  const [newBrandProducts, setNewBrandProducts] = useState<Product[]>([]);
  const [tablets, setTablets] = useState<Product[]>([]);
  const [phones, setPhones] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const links = ['phones', 'tablets', 'accessories', 'favourites'];
  const [isError, setIsError] = useState('');
  const [isMessage, setIsMessage] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.outerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.outerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mobileScreen = 639;
  const isMobile = screenWidth <= mobileScreen;

  useEffect(() => {
    fetchProducts(
      ProductClient.getProducts,
      setProducts,
      setIsError,
      setIsLoading,
      'products',
    );
  }, []);

  useEffect(() => {
    setHotPriceProducts(ProductClient.getHotPriceProducts(products));
    setNewBrandProducts(ProductClient.getBrandNewProducts(products));
  }, [products]);

  useEffect(() => {
    if (location.pathname === '/phones') {
      fetchProducts(getPhones, setPhones, setIsError, setIsLoading, 'phones');
    }

    if (location.pathname === '/tablets') {
      fetchProducts(
        getTablets, setTablets, setIsError, setIsLoading, 'tablets',
      );
    }

    if (location.pathname === '/accessories') {
      fetchProducts(
        getAccessories, setAccessories, setIsError, setIsLoading, 'accessories',
      );
    }
  }, [location.pathname]);

  // #region Details
  const count = 8;
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productDetails, setProductDetails] = useState<ProductDeatails>({
    id: '',
    capacityAvailable: [],
    colorsAvailable: [],
    color: '',
    capacity: '',
    namespaceId: '',
    images: [],
    description: [
      {
        title: '',
        text: [],
      },
    ],
    resolution: '',
    processor: '',
    camera: '',
    zoom: '',
    cell: [],
  });
  const [selectedProduct, setSelectedProduct] = useState<Product>({
    fullPrice: 0,
    price: 0,
    year: 0,
    id: '',
    itemId: '',
    capacity: '',
    name: '',
    image: '',
    category: '',
    screen: '',
    ram: '',
  });
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [isProductNotFound, setIsProductNotFound] = useState(false);

  useEffect(() => {
    fetchDetails(
      selectedProductId,
      setProductDetails,
      setSelectedProduct,
      setIsProductNotFound,
      setIsError,
      setIsLoading,
      products,
      'product details',
    );
  }, [selectedProductId, products]);

  useEffect(() => {
    setRandomProducts(
      ProductClient.getSuggestedProducts(products, selectedProductId, count),
    );
  }, [selectedProductId, products, count]);

  // #endregion Details

  //  #region Pagination, Dropdown, Carousel
  const sortDropdown: DropdownIterface = {
    name: 'sort',
    options: {
      Newest: 'age',
      Alphabetically: 'name',
      Cheapest: 'price',
    },
    isOpen: false,
  };

  const perPageDropdown: DropdownIterface = {
    name: 'perPage',
    options: {
      4: '4',
      8: '8',
      16: '16',
      All: 'all',
    },
    isOpen: false,
  };
  const page = +(searchParams.get('page') || 1);
  const sort = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || '16';
  const query = searchParams.get('query') || '';
  const itemsPerPage = 4;

  function getArrayLength(array: Product[]) {
    return array.length - itemsPerPage;
  }

  function setPerPage(length: number) {
    return perPage === 'all' ? length : +perPage;
  }

  function setPageCount(length: number, perPageToNum: number) {
    return Array.from(
      { length: Math.ceil(length / perPageToNum) },
      (_, index) => index + 1,
    );
  }

  function setStartIndex(perPageToNum: number) {
    return (page - 1) * perPageToNum;
  }

  function setCurrentOption(options: Option, currentValue: string): string {
    const foundKey = Object.keys(options).find(
      key => options[key] === currentValue,
    );

    return foundKey || '';
  }

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [page, perPage, sort]);
  //  #endregion Pagination & Dropdown

  // #region Cart & Favourites
  const [carts, setCarts] = useLocalStorage<Product[]>('cart', []);
  const [favourites, setFavourites] = useLocalStorage<Product[]>(
    'favourites', [],
  );

  function isProductAdded(productsToCheck: Product[], id: string) {
    return productsToCheck.some(product => product.id === id);
  }

  function getArrayUpdates(
    productsToUpdare: Product[], productToCheck: Product,
  ) {
    const productIsAdded = isProductAdded(productsToUpdare, productToCheck.id);
    let updatedProducts = [];

    if (productIsAdded) {
      updatedProducts = filterProductsById(productsToUpdare, productToCheck.id);
    } else {
      updatedProducts = [...productsToUpdare, productToCheck];
    }

    return updatedProducts;
  }
  // #endregion Cart

  const productValue: ProductsContextProps = {
    products,
    hotPriceProducts,
    newBrandProducts,
    links,
    sortDropdown,
    perPageDropdown,
    page,
    sort,
    query,
    perPage,
    setPerPage,
    setPageCount,
    setStartIndex,
    isLoading,
    phones,
    tablets,
    accessories,
    setCurrentOption,
    productDetails,
    selectedProductId,
    setSelectedProductId,
    selectedProduct,
    getArrayLength,
    carts,
    setCarts,
    randomProducts,
    favourites,
    setFavourites,
    isProductAdded,
    getArrayUpdates,
    isProductNotFound,
    isError,
    isMessage,
    setIsMessage,
    isMobile,
    screenWidth,
  };

  return (
    <ProductsContext.Provider value={productValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = (
): ProductsContextProps => React.useContext(ProductsContext);
