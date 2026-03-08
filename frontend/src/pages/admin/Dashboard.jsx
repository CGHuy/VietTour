import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTours } from "../../services/tourService";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalTours: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllTours()
      .then((data) => {
        if (data.success) setStats({ totalTours: data.data.length });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Dashboard</h2>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <div className="card text-center shadow-sm p-3">
              <div className="card-body">
                <h5 className="card-title text-muted">Tổng số Tour</h5>
                <h2 className="fw-bold text-primary">{stats.totalTours}</h2>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Quản lý Tour</h5>
              <p className="card-text text-muted">Thêm, sửa, xóa các tour du lịch.</p>
              <Link to="/admin/tours" className="btn btn-primary">Quản lý Tour</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Lịch trình Tour</h5>
              <p className="card-text text-muted">Quản lý lịch trình các tour.</p>
              <Link to="/admin/tour-itinerary" className="btn btn-primary">Lịch trình</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
