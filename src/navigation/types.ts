 
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
};

export type MainStackParamList = {
  AllProducts: undefined;
  ProductsByCategory: {
    categoryId: string;
    categoryName: string;
  };
};

