import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../services/authService";

export default function Register() {
     const [form, setForm] = useState({ fullname: "", phone: "", email: "", password: "" });
     const [errors, setErrors] = useState({});
     const [message, setMessage] = useState({ text: "", type: "" });
     const [showPwd, setShowPwd] = useState(false);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const validateField = (name, value) => {
          switch (name) {
               case "fullname":
                    return value.trim() ? "" : "Vui lòng nhập họ và tên.";
               case "phone":
                    if (!value) return "Vui lòng nhập số điện thoại.";
                    if (!/^0[0-9]{9}$/.test(value)) {
                         return "Số điện thoại không hợp lệ (bắt đầu bằng 0, 10 chữ số).";
                    }
                    return "";
               case "email":
                    if (!value) return "Vui lòng nhập email.";
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email không hợp lệ.";
                    return "";
               case "password":
                    if (!value) return "Vui lòng nhập mật khẩu.";
                    if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
                    return "";
               default:
                    return "";
          }
     };

     const validate = (formValue = form) => {
          const errs = {};
          Object.keys(formValue).forEach((key) => {
               const fieldError = validateField(key, formValue[key]);
               if (fieldError) errs[key] = fieldError;
          });
          return errs;
     };

     const handleChange = (e) => {
          const { name, value } = e.target;
          const nextForm = { ...form, [name]: value };
          setForm(nextForm);
          setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
     };

     const handleBlur = (e) => {
          const { name, value } = e.target;
          setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          const errs = validate();
          if (Object.keys(errs).length) {
               setErrors(errs);
               return;
          }
          setLoading(true);
          try {
               const data = await register(form);
               if (data.success) {
                    setMessage({ text: "Đăng ký thành công! Đang chuyển hướng...", type: "success" });
                    setTimeout(() => navigate("/login"), 1500);
               } else {
                    setMessage({ text: data.message || "Đăng ký thất bại.", type: "danger" });
               }
          } catch {
               setMessage({ text: "Có lỗi xảy ra. Vui lòng thử lại.", type: "danger" });
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="container py-5">
               <div className="row justify-content-center align-items-stretch g-0">
                    <div className="col-12 col-lg-5">
                         <div className="d-flex align-items-center justify-content-center text-center text-white h-100"
                              style={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)', borderRadius: '12px 0 0 12px', padding: '2rem' }}>
                              <div>
                                   <h2 className="fw-bold">Tạo tài khoản mới</h2>
                                   <h6 className="mb-4">Cùng khám phá Việt Nam với hàng ngàn tour du lịch hấp dẫn.</h6>
                              </div>
                         </div>
                    </div>

               <div className="col-12 col-lg-7">
                    <div className="card h-100 shadow-sm p-4" style={{ borderRadius: '0 12px 12px 0' }}>
                         <div className="card-body">
                         {message.text && (
                              <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>
                         )}

                         <form onSubmit={handleSubmit} noValidate>
                              <div className="mb-3">
                                   <label className="form-label">Họ và tên</label>
                                   <div className="input-group">
                                        <span className="input-group-text"><i className="fa-solid fa-user" /></span>
                                        <input
                                        id="fullname"
                                        name="fullname"
                                        type="text"
                                        className={`form-control${errors.fullname ? " is-invalid" : ""}`}
                                        placeholder="Nhập họ và tên của bạn"
                                        value={form.fullname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        />
                                        {errors.fullname && <div className="invalid-feedback">{errors.fullname}</div>}
                                   </div>
                              </div>

                              <div className="mb-3">
                                   <label className="form-label">Số điện thoại</label>
                                   <div className="input-group">
                                        <span className="input-group-text"><i className="fa-solid fa-phone" /></span>
                                        <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        className={`form-control${errors.phone ? " is-invalid" : ""}`}
                                        placeholder="Nhập số điện thoại"
                                        value={form.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        />
                                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                   </div>
                              </div>

                              <div className="mb-3">
                                   <label className="form-label">Email</label>
                                   <div className="input-group">
                                        <span className="input-group-text"><i className="fa-solid fa-envelope" /></span>
                                        <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        className={`form-control${errors.email ? " is-invalid" : ""}`}
                                        placeholder="Nhập địa chỉ email"
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                   </div>
                              </div>

                              <div className="mb-4">
                                   <label className="form-label">Mật khẩu</label>
                                   <div className="input-group">
                                        <span className="input-group-text"><i className="fa-solid fa-key" /></span>
                                        <input
                                        id="password"
                                        name="password"
                                        type={showPwd ? "text" : "password"}
                                        className={`form-control${errors.password ? " is-invalid" : ""}`}
                                        placeholder="Nhập mật khẩu"
                                        value={form.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        />
                                        <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => setShowPwd(!showPwd)}
                                        >
                                        {showPwd ? "Ẩn" : "Hiện"}
                                        </button>
                                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                   </div>
                              </div>

                              <div className="d-grid mb-3">
                                   <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                                        Đăng ký
                                   </button>
                              </div>
                         </form>

                         <p className="text-center text-muted mb-0">
                              Đã có tài khoản?{" "}
                              <Link to="/login" className="fw-semibold">Đăng nhập</Link>
                         </p>
                         </div>
                    </div>
               </div>
               </div>

               <div className="row">
                    <div className="col-12 col-lg-7 offset-lg-5">
                         <p className="text-center mt-3 mb-0"><Link to="/">Quay về trang chủ</Link></p>
                    </div>
               </div>
          </div>
     );
}
