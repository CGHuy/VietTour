function formatPrice(price) {
     return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
}

export default function TourCard({ tour }) {
     return (
          <div className="col-12 col-md-6 col-lg-3">
               <a href={`/tour-detail?id=${tour.id}`} className="text-decoration-none">
                    <div className="card h-100 tour-card">
                         <img
                         src={tour.image || tour.cover_image || "/assets/default-tour.jpg"}
                         className="card-img-top"
                         alt={tour.name}
                         />

                         <div className="card-badges">
                              <span className="badge bg-info">
                                   {tour.location || tour.region}
                              </span>

                              <span className="badge bg-primary">
                                   {tour.duration}
                              </span>
                         </div>

                         <div className="card-body">
                              <h5 className="card-title">{tour.name}</h5>

                              <p className="card-text">{tour.description}</p>

                              <div className="card-price">
                                   <b>Giá:</b>
                                   <span className="hightlight_price">
                                        {formatPrice(tour.price || tour.price_default)}
                                   </span>
                              </div>
                         </div>
                    </div>
               </a>
          </div>
     );
}