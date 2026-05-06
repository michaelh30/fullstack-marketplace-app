import axios from 'axios';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadAPI = {
  image: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Add token to requests if it exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ProductListParams {
  page?: number;   // 0-based
  size?: number;
  sort?: 'recommended' | 'cheapest' | 'top-rated';
  search?: string;
}

// Product API
export const productAPI = {
  // --- Non-paginated (kept for admin / internal use) ---
  getAll: () => apiClient.get('/products'),
  getById: (id: number) => apiClient.get(`/products/${id}`),
  getBySubCategory: (subCategoryId: number) => apiClient.get(`/products/subcategory/${subCategoryId}`),
  getTopRated: (gameId: number) => apiClient.get(`/products/top-rated/game/${gameId}`),
  getCheapest: (gameId: number) => apiClient.get(`/products/cheapest/game/${gameId}`),

  // --- Paginated listing endpoints ---
  getByGame: (gameId: number, params: ProductListParams = {}) =>
    apiClient.get(`/products/game/${gameId}`, { params }),
  getByGameAndSubCategory: (gameId: number, subCategoryId: number, params: ProductListParams = {}) =>
    apiClient.get(`/products/game/${gameId}/subcategory/${subCategoryId}`, { params }),
  searchByGame: (gameId: number, term: string, params: ProductListParams = {}) =>
    apiClient.get(`/products/search/game/${gameId}`, { params: { term, ...params } }),

  // --- Write operations ---
  create: (data: any) => apiClient.post('/products', data),
  update: (id: number, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: number) => apiClient.delete(`/products/${id}`),
};

export const subCategoryAPI = {
  getByGame: (gameId: number) => apiClient.get(`/subcategories/game/${gameId}`),
  create: (data: any) => apiClient.post('/subcategories', data),
  update: (id: number, data: any) => apiClient.put(`/subcategories/${id}`, data),
  delete: (id: number) => apiClient.delete(`/subcategories/${id}`),
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
  signup: (email: string, password: string, fullName: string, role = 'CUSTOMER') =>
    apiClient.post('/auth/signup', { email, password, fullName, role }),
  registerAdmin: (email: string, password: string, fullName: string) =>
    apiClient.post('/auth/admin/register', { email, password, fullName }),
};

export default apiClient;
