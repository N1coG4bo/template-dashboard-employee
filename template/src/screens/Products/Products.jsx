import React, { useEffect, useMemo, useState } from 'react';
import { createProduct, deleteProduct, listProducts, updateProduct, uploadProductImage } from '../../services/productsApi';

const INITIAL_FORM = {
  name: '',
  description: '',
  price: '',
  category: '',
  status: 'draft',
  stock: '',
  imageUrl: '',
};

function normalizeForm(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    category: form.category.trim(),
    status: form.status,
    stock: Number(form.stock),
    imageUrl: form.imageUrl.trim(),
  };
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const submitLabel = useMemo(() => (editingId ? 'Actualizar producto' : 'Crear producto'), [editingId]);

  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const response = await listProducts(true);
      setProducts(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setError('No se pudo cargar la lista de productos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: String(product.price ?? ''),
      category: product.category || '',
      status: product.status || 'draft',
      stock: String(product.stock ?? ''),
      imageUrl: product.imageUrl || '',
    });
    setImageFile(null);
    setMessage('');
    setError('');
  }

  function handleCancelEdit() {
    setEditingId(null);
    setForm(INITIAL_FORM);
    setImageFile(null);
    setMessage('');
    setError('');
  }

  async function handleDelete(id) {
    const accepted = window.confirm('Esta accion eliminara el producto. Quieres continuar?');
    if (!accepted) {
      return;
    }

    setError('');
    setMessage('');

    try {
      await deleteProduct(id);
      setMessage('Producto eliminado.');
      await loadProducts();
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (err) {
      setError('No se pudo eliminar el producto.');
    }
  }

  async function resolveImageUrl() {
    if (!imageFile) {
      return form.imageUrl;
    }

    const uploadResponse = await uploadProductImage(imageFile);
    return uploadResponse?.data?.url || '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setMessage('');

    try {
      const imageUrl = await resolveImageUrl();
      const payload = normalizeForm({ ...form, imageUrl });

      if (!payload.imageUrl) {
        setError('Debes cargar una imagen o indicar una URL.');
        setSubmitting(false);
        return;
      }

      if (editingId) {
        await updateProduct(editingId, payload);
        setMessage('Producto actualizado correctamente.');
      } else {
        await createProduct(payload);
        setMessage('Producto creado correctamente.');
      }

      handleCancelEdit();
      await loadProducts();
    } catch (err) {
      setError('No se pudo guardar el producto. Verifica los datos e intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Gestion de productos</h3>
      </div>

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">{submitLabel}</h4>
              <p className="card-description">Administra nombre, descripcion, precio, stock e imagen.</p>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-success">{message}</div>}

              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="product-name">Nombre</label>
                      <input
                        id="product-name"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="product-category">Categoria</label>
                      <input
                        id="product-category"
                        className="form-control"
                        name="category"
                        value={form.category}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="product-description">Descripcion</label>
                  <textarea
                    id="product-description"
                    className="form-control"
                    rows="3"
                    name="description"
                    value={form.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="product-price">Precio</label>
                      <input
                        id="product-price"
                        className="form-control"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={form.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="product-stock">Stock</label>
                      <input
                        id="product-stock"
                        className="form-control"
                        name="stock"
                        type="number"
                        min="0"
                        value={form.stock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="product-status">Estado</label>
                      <select
                        id="product-status"
                        className="form-control"
                        name="status"
                        value={form.status}
                        onChange={handleInputChange}
                      >
                        <option value="draft">Borrador</option>
                        <option value="published">Publicado</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="product-image-url">URL de imagen</label>
                      <input
                        id="product-image-url"
                        className="form-control"
                        name="imageUrl"
                        value={form.imageUrl}
                        onChange={handleInputChange}
                        placeholder="/uploads/products/archivo.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="product-file">Subir imagen (opcional)</label>
                  <input
                    id="product-file"
                    className="form-control"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                  />
                  <small className="text-muted">Si seleccionas archivo, se prioriza sobre URL de imagen.</small>
                </div>

                <button className="btn btn-gradient-primary mr-2" type="submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : submitLabel}
                </button>
                {editingId && (
                  <button className="btn btn-light" type="button" onClick={handleCancelEdit} disabled={submitting}>
                    Cancelar
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Lista de productos</h4>

              {loading && <p className="text-muted mb-0">Cargando productos...</p>}

              {!loading && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-muted">No hay productos cargados.</td>
                        </tr>
                      )}

                      {products.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category}</td>
                          <td>${Number(product.price || 0).toFixed(2)}</td>
                          <td>{product.stock}</td>
                          <td>
                            <label className={`badge mb-0 ${product.status === 'published' ? 'badge-gradient-success' : 'badge-gradient-warning'}`}>
                              {product.status}
                            </label>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary mr-2"
                              type="button"
                              onClick={() => handleEdit(product)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              type="button"
                              onClick={() => handleDelete(product.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
