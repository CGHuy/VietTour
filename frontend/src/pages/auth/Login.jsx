import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

export default function Login() {
     const [form, setForm] = useState({ username: "", password: "" });
     const [errors, setErrors] = useState({});
     const [message, setMessage] = useState({ text: "", type: "" });
     const [showPwd, setShowPwd] = useState(false);
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();

     const validateField = (name, value) => {
          switch (name) {
               case "username": {
                    const input = value.trim();
                    if (!input) return "Vui lòng nhập email hoặc số điện thoại.";
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
                    const isPhone = /^0[0-9]{9}$/.test(input);
                    if (!isEmail && !isPhone) return "Email hoặc số điện thoại không hợp lệ.";
                    return "";
               }
               case "password":
                    return value ? "" : "Vui lòng nhập mật khẩu.";
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
          setForm((prev) => ({ ...prev, [name]: value }));
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
               const data = await login(form.username, form.password);
               if (data.success) {
                    localStorage.setItem("token", data?.data?.token || "");
                    localStorage.setItem("user", JSON.stringify(data?.data?.user || null));
                    navigate("/");
               } else {
                    setMessage({ text: data.message || "Đăng nhập thất bại.", type: "danger" });
               }
          } catch {
               setMessage({ text: "Có lỗi xảy ra. Vui lòng thử lại.", type: "danger" });
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="container py-5">
               <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-6">
                         <div className="hero d-flex align-items-center justify-content-center text-center text-white mb-4"
                         style={{ background: 'linear-gradient(135deg, #1976d2, #42a5f5)', borderRadius: 12, padding: '2rem' }}>
                              <div>
                                   <h1 className="fw-bold">Đăng nhập</h1>
                                   <h5 className="mb-0">Chào mừng trở lại với VietTour</h5>
                              </div>
                         </div>

                         <div className="card shadow-sm p-4" style={{ borderRadius: 12 }}>
                              <div className="card-body">
                                   {message.text && (
                                        <div className={`alert alert-${message.type}`} role="alert">{message.text}</div>
                                   )}

                                   <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                             <label className="form-label mb-2">Email hoặc số điện thoại</label>
                                             <div className="input-group">
                                                  <span className="input-group-text">
                                                       <i className="fa-solid fa-user" />
                                                  </span>
                                                  <input
                                                  id="username"
                                                  type="text"
                                                  name="username"
                                                  className={`form-control${errors.username ? " is-invalid" : ""}`}
                                                  placeholder="Nhập email hoặc số điện thoại"
                                                  value={form.username}
                                                  onChange={handleChange}
                                                  onBlur={handleBlur}
                                                  />
                                                  {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                             </div>
                                        </div>

                                        <div className="mb-4">
                                             <label className="form-label mb-2">Mật khẩu</label>
                                             <div className="input-group">
                                                  <span className="input-group-text">
                                                       <i className="fa-solid fa-key" />
                                                  </span>
                                                  <input
                                                  id="password"
                                                  name="password"
                                                  type={showPwd ? "text" : "password"}
                                                  className={`form-control${errors.password ? " is-invalid" : ""}`}
                                                  placeholder="Nhập mật khẩu của bạn"
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
                                             {loading ? (
                                                  <span className="spinner-border spinner-border-sm me-2" />
                                             ) : null}
                                             Đăng nhập
                                        </button>
                                        </div>
                                   </form>

                                   <p className="text-center text-muted mb-0">
                                        Chưa có tài khoản?{" "}
                                        <Link to="/register" className="fw-semibold">Đăng ký ngay</Link>
                                   </p>
                              </div>
                         </div>
                         <p className="text-center mt-3">
                         <Link to="/">Quay về trang chủ</Link>
                         </p>
                    </div>
               </div>
          </div>
     );
}
