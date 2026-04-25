import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Product API
export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getById: (id: number) => apiClient.get(`/products/${id}`),
  getByGame: (gameId: number) => apiClient.get(`/products/game/${gameId}`),
  getBySubCategory: (subCategoryId: number) => apiClient.get(`/products/subcategory/${subCategoryId}`),
  getByGameAndSubCategory: (gameId: number, subCategoryId: number) =>
    apiClient.get(`/products/game/${gameId}/subcategory/${subCategoryId}`),
  search: (term: string) => apiClient.get(`/products/search?term=${term}`),
  searchByGame: (gameId: number, term: string) =>
    apiClient.get(`/products/search/game/${gameId}?term=${term}`),
  getTopRated: (gameId: number) => apiClient.get(`/products/top-rated/game/${gameId}`),
  getCheapest: (gameId: number) => apiClient.get(`/products/cheapest/game/${gameId}`),
};

// Game API
export const gameAPI = {
  getAll: () => apiClient.get('/games'),
  getById: (id: number) => apiClient.get(`/games/${id}`),
  getByName: (name: string) => apiClient.get(`/games/name/${name}`),
  create: (data: any) => apiClient.post('/games', data),
  update: (id: number, data: any) => apiClient.put(`/games/${id}`, data),
  delete: (id: number) => apiClient.delete(`/games/${id}`),
};

// Review API
export const reviewAPI = {
  getByProduct: (productId: number) => apiClient.get(`/reviews/product/${productId}`),
  getByUser: (userId: number) => apiClient.get(`/reviews/user/${userId}`),
  create: (productId: number, userId: number, rating: number, comment?: string) =>
    apiClient.post('/reviews', null, {
      params: { productId, userId, rating, comment },
    }),
  delete: (id: number) => apiClient.delete(`/reviews/${id}`),
};

// Order API
export const orderAPI = {
  create: (userId: number, shippingAddress: string) =>
    apiClient.post('/orders', null, { params: { userId, shippingAddress } }),
  getById: (id: number) => apiClient.get(`/orders/${id}`),
  getByUser: (userId: number) => apiClient.get(`/orders/user/${userId}`),
  getByStatus: (status: string) => apiClient.get(`/orders/status/${status}`),
  updateStatus: (id: number, status: string) =>
    apiClient.put(`/orders/${id}/status`, null, { params: { status } }),
};

// Cart API
export const cartAPI = {
  getCart: (userId: number) => apiClient.get(`/cart/${userId}`),
  addItem: (userId: number, productId: number, quantity: number) =>
    apiClient.post('/cart', null, { params: { userId, productId, quantity } }),
  updateItem: (cartItemId: number, quantity: number) =>
    apiClient.put(`/cart/${cartItemId}`, null, { params: { quantity } }),
  removeItem: (cartItemId: number) => apiClient.delete(`/cart/${cartItemId}`),
  removeByProduct: (userId: number, productId: number) =>
    apiClient.delete(`/cart/product/${userId}/${productId}`),
  clear: (userId: number) => apiClient.delete(`/cart/${userId}/clear`),
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  signup: (email: string, password: string, fullName: string) =>
    apiClient.post('/auth/signup', null, { params: { email, password, fullName } }),
  registerAdmin: (email: string, password: string, fullName: string) =>
    apiClient.post('/auth/admin/register', null, { params: { email, password, fullName } }),
};

export default apiClient;
