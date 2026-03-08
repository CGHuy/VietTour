const User = require('../models/User');
const Otp = require('../models/Otp');
const sendMail = require('../utils/mailService').sendVerificationOtpEmail;
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (user) => {
     return jwt.sign(
          {
               id: user.id,
               email: user.email,
               role: user.role,
               is_verified: user.is_verified
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' } // Token hết hạn sau 7 ngày
     );
};

// Đăng ký user mới
exports.register = async (req, res) => {
     try {
          const { fullname, phone, email, password } = req.body;

          // 1️ check mail
          const existingUser = await User.findByEmail(email);
          if (existingUser) {
               return res.status(409).json({
                    success: false,
                    message: 'Email đã được sử dụng!'
               });
          }

          // 2 check phone
          const existingPhone = await User.findByPhone(phone);
          if (existingPhone) {
               return res.status(409).json({
                    success: false,
                    message: 'Số điện thoại đã được sử dụng!'
               });
          }

          // 3️ tạo user mới (chưa verified)
          const userId = await User.create({
               fullname,
               phone,
               email,
               password,
               role: 'customer',
               is_verified: false
          });

          const newUser = await User.findById(userId);

          // 4 tạo OTP
          const otpCode = Math.floor(100000 + Math.random() * 900000);

          // 5 lưu OTP vào database
          await Otp.create({
               userId,
               email,
               otp: otpCode,
               type: 'VERIFY_EMAIL',
               expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 phút
          });

          // 6 gửi OTP qua email
          await sendMail({ email, otp: otpCode });

          // 7 tạo lại token
          const token = generateToken(newUser);

          res.status(201).json({
               success: true,
               message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.',
               data: {
                    user: {
                         id: newUser.id,
                         fullname: newUser.fullname,
                         phone: newUser.phone,
                         email: newUser.email,
                         role: newUser.role,
                         is_verified: newUser.is_verified
                    },
                    token
               }
          });

     } catch (error) {
          console.error('Register error:', error);
          res.status(500).json({
               success: false,
               message: 'Lỗi khi đăng ký',
               error: error.message
          });
     }
};

// Đăng nhập
exports.login = async (req, res) => {
     try {
          const {username, password } = req.body;

          // Tìm user theo email hoặc số điện thoại
          const user = await User.findByEmailOrPhone(username);
          if (!user) {
               return res.status(401).json({
               success: false,
               message: 'Email hoặc số điện thoại không đúng!'
               });
          }

          // Kiểm tra password
          const isPasswordValid = await User.comparePassword(password, user.password);
          if (!isPasswordValid) {
               return res.status(401).json({
               success: false,
               message: 'Mật khẩu không đúng!'
               });
          }

          // Tạo token
          const token = generateToken(user);

          res.json({
               success: true,
               message: 'Đăng nhập thành công! Đang chuyển hướng...',
               data: {
               user: {
                    id: user.id,
                    fullname: user.fullname,
                    phone: user.phone,
                    email: user.email,
                    role: user.role
               },
               token
               }
          });
     } catch (error) {
          console.error('Login error:', error);
          res.status(500).json({
               success: false,
               message: 'Lỗi khi đăng nhập',
               error: error.message
          });
     }
};

// Lấy thông tin user hiện tại (profile)
exports.getProfile = async (req, res) => {
     try {
          // req.user được set bởi verifyToken middleware
          const user = await User.findById(req.user.id);

          if (!user) {
               return res.status(404).json({
               success: false,
               message: 'Không tìm thấy user'
               });
          }

          res.json({
               success: true,
               data: {
               id: user.id,
               fullname: user.fullname,
               phone: user.phone,
               email: user.email,
               role: user.role,
               created_at: user.created_at
               }
          });
     } catch (error) {
          console.error('Get profile error:', error);
          res.status(500).json({
               success: false,
               message: 'Lỗi khi lấy thông tin profile',
               error: error.message
          });
     }
};

// Cập nhật profile
exports.updateProfile = async (req, res) => {
     try {
          const { fullname, phone, email } = req.body;
          const userId = req.user.id;

          // Kiểm tra email mới có bị trùng không (nếu thay đổi email)
          if (email && email !== req.user.email) {
               const existingUser = await User.findByEmail(email);
               if (existingUser && existingUser.id !== userId) {
                    return res.status(409).json({
                         success: false,
                         message: 'Email đã được sử dụng bởi user khác!'
                    });
               }
          }

          // Cập nhật thông tin
          const updated = await User.update(userId, {
               fullname: fullname || req.user.fullname,
               phone: phone || req.user.phone,
               email: email || req.user.email,
               role: req.user.role // Giữ nguyên role
          });

          if (!updated) {
               return res.status(404).json({
               success: false,
               message: 'Không tìm thấy user'
               });
          }

          // Lấy thông tin user sau khi update
          const updatedUser = await User.findById(userId);

          res.json({
               success: true,
               message: 'Cập nhật profile thành công!',
               data: {
               id: updatedUser.id,
               fullname: updatedUser.fullname,
               phone: updatedUser.phone,
               email: updatedUser.email,
               role: updatedUser.role
               }
          });
     } catch (error) {
          console.error('Update profile error:', error);
          res.status(500).json({
               success: false,
               message: 'Lỗi khi cập nhật profile',
               error: error.message
          });
     }
};

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
     try {
          const { currentPassword, newPassword } = req.body;
          const userId = req.user.id;

          // Validate input
          if (!currentPassword || !newPassword) {
               return res.status(400).json({
               success: false,
               message: 'Vui lòng điền đầy đủ thông tin'
               });
          }

          if (newPassword.length < 6) {
               return res.status(400).json({
               success: false,
               message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
               });
          }

          // Lấy user (bao gồm password)
          const user = await User.findByEmail(req.user.email);

          // Kiểm tra mật khẩu hiện tại
          const isPasswordValid = await User.comparePassword(currentPassword, user.password);
          if (!isPasswordValid) {
               return res.status(401).json({
               success: false,
               message: 'Mật khẩu hiện tại không đúng!'
               });
          }

          // Cập nhật mật khẩu mới
          await User.updatePassword(userId, newPassword);

          res.json({
               success: true,
               message: 'Đổi mật khẩu thành công!'
          });
     } catch (error) {
          console.error('Change password error:', error);
          res.status(500).json({
               success: false,
               message: 'Lỗi khi đổi mật khẩu',
               error: error.message
          });
     }
};

// Đăng xuất (client sẽ xóa token)
exports.logout = (req, res) => {
     res.json({
     success: true,
     message: 'Đăng xuất thành công!'
     });
};

// Verify token (kiểm tra token còn hợp lệ không)
exports.verifyToken = (req, res) => {
     // Nếu đến đây nghĩa là token hợp lệ (đã qua verifyToken middleware)
     res.json({
     success: true,
     message: 'Token hợp lệ',
     data: {
          user: req.user
     }
     });
};