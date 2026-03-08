import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTours, getToursByRegion } from "../services/tourService";
import TourCard from "../components/tourCard";

export default function Home() {
     const [topTours, setTopTours] = useState([]);
     const [mienBac, setMienBac] = useState([]);
     const [mienTrung, setMienTrung] = useState([]);
     const [mienNam, setMienNam] = useState([]);
     const [loading, setLoading] = useState(true);
     const [search, setSearch] = useState("");
     const navigate = useNavigate();

     useEffect(() => {
     loadTours();
     }, []);

     const loadTours = async () => {
     try {
          const [top, bac, trung, nam] = await Promise.all([
               getAllTours(),
               getToursByRegion("Miền Bắc"),
               getToursByRegion("Miền Trung"),
               getToursByRegion("Miền Nam"),
          ]);
          if (top.success) setTopTours(top.data);
          if (bac.success) setMienBac(bac.data);
          if (trung.success) setMienTrung(trung.data);
          if (nam.success) setMienNam(nam.data);
     } catch (err) {
          console.error(err);
     } finally {
          setLoading(false);
     }
     };

     const handleSearch = (e) => {
          e.preventDefault();
          if (search.trim()) {
               navigate(`/tours?search=${encodeURIComponent(search.trim())}`);
          }
     };

     const renderTours = (tours) => {
          if (!tours.length) return <p className="text-muted">Không có tour nào.</p>;
          return (
               <div className="row g-3">
               {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} />
               ))}
               </div>
          );
     };

     if (loading) {
          return (
               <div className="loading-spinner">
                    <div className="spinner-border text-primary" role="status">
                         <span className="visually-hidden">Đang tải...</span>
                    </div>
               </div>
          );
     }

     return (
     <div className="container">
          {/* Thanh tìm kiếm */}
          <div className="my-4">
               <form className="search-group" onSubmit={handleSearch}>
                    <button type="submit" className="search-icon">
                    <i className="fa-solid fa-magnifying-glass" />
                    </button>
                    <input
                    type="text"
                    className="search-input"
                    placeholder="Tìm kiếm tour du lịch..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    />
               </form>
          </div>

          <h2 className="section-main-title">Top Tours</h2>
          {renderTours(topTours)}

          <h2 className="region-title mt-5">
          <i className="fa-solid fa-mountain" />
          Miền Bắc
          </h2>
          {renderTours(mienBac)}

          <h2 className="region-title mt-5">
          <i className="fa-solid fa-umbrella-beach" />
          Miền Trung
          </h2>
          {renderTours(mienTrung)}

          <h2 className="region-title mt-5">
          <i className="fa-solid fa-city" />
          Miền Nam
          </h2>
          {renderTours(mienNam)}
          
          <div className="mb-5"></div>
     </div>
     );
}
