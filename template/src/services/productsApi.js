import { del, get, patch, post } from './api';

export async function listProducts(includeDraft = true) {
  return get('/products', { query: { includeDraft } });
}

export async function createProduct(payload) {
  return post('/products', payload);
}

export async function updateProduct(id, payload) {
  return patch(`/products/${id}`, payload);
}

export async function deleteProduct(id) {
  return del(`/products/${id}`);
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  return post('/uploads/products', formData);
}
