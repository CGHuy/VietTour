import { useEffect, useState } from "react";
import { getAllTours } from "../../services/tourService";

export default function AdminTour() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTours()
      .then((data) => { if (data.success) setTours(data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý Tour</h2>
        <button className="btn btn-primary">
          <i className="fa-solid fa-plus me-2" />
          Thêm Tour
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Tên Tour</th>
                  <th>Vùng</th>
                  <th>Giá</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {tours.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center text-muted py-4">Không có tour nào.</td>
                  </tr>
                ) : (
                  tours.map((tour, idx) => (
                    <tr key={tour.id}>
                      <td>{idx + 1}</td>
                      <td>{tour.name}</td>
                      <td>{tour.region || tour.location}</td>
                      <td>{new Intl.NumberFormat("vi-VN").format(tour.price || tour.price_default)} VNĐ</td>
                      <td>{tour.duration}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1">Sửa</button>
                        <button className="btn btn-sm btn-outline-danger">Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
