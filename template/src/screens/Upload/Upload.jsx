import React from 'react';
import useFetch from '../../hooks/useFetch';
import { fetchUploadHistory } from '../../services/oracleApi';
import { formatDate, formatFileSize } from '../../utils/format';

export default function Upload() {
  const { data, loading, error } = useFetch(() => fetchUploadHistory({ limit: 10 }), []);
  const uploads = Array.isArray(data) ? data : [];

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Upload</h3>
      </div>

      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Historial de cargas</h4>

              {loading && <p className="text-muted mb-0">Cargando historial...</p>}

              {error && (
                <div className="alert alert-warning" role="alert">
                  No se pudo cargar el historial. Verifica tu API Oracle o la variable REACT_APP_API_BASE_URL.
                </div>
              )}

              {!loading && !error && uploads.length === 0 && (
                <p className="text-muted mb-0">No hay cargas registradas.</p>
              )}

              {!loading && !error && uploads.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Archivo</th>
                        <th>Tamano</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploads.map((upload) => (
                        <tr key={upload.id}>
                          <td>{upload.fileName || 'sin nombre'}</td>
                          <td>{formatFileSize(upload.sizeBytes)}</td>
                          <td>{formatDate(upload.createdAt)}</td>
                          <td>
                            <label className="badge badge-gradient-success mb-0">
                              {upload.status || 'UNKNOWN'}
                            </label>
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
