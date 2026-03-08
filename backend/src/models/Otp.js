const db = require('../config/database');

class Otp {
     // Tạo OTP mới
     static async create(otpData) {
          const { userId = null, email, otp, type = 'VERIFY_EMAIL', expiresAt } = otpData;
          const [result] = await db.query(`
               INSERT INTO otps (user_id, email, otp, type, expires_at, is_used, created_at)
               VALUES (?, ?, ?, ?, ?, 0, NOW())`,
               [userId, email, otp, type, expiresAt]
          );

          return result.insertId;
     }

     // Tìm OTP hợp lệ theo email, mã OTP và loại
     static async findValidOtp(otpData) {
          const { email, otp, type = 'VERIFY_EMAIL' } = otpData;
          const [rows] = await db.query(`
               SELECT *
               FROM otps
               WHERE email = ?
                    AND otp = ?
                    AND type = ?
                    AND is_used = 0
                    AND expires_at > NOW()
               ORDER BY id DESC
               LIMIT 1`,
               [email, otp, type]
          );

          return rows[0];
     }

     // Đánh dấu OTP đã sử dụng
     static async markUsed(id) {
          const [result] = await db.query('UPDATE otps SET is_used = 1 WHERE id = ?', [id]);
          return result.affectedRows > 0;
     }

     // Vô hiệu hóa tất cả OTP chưa sử dụng cho email và loại nhất định (ví dụ: khi tạo OTP mới hoặc sau khi xác thực thành công)
     static async invalidateByEmail(email, type = 'VERIFY_EMAIL') {
          await db.query('UPDATE otps SET is_used = 1 WHERE email = ? AND type = ? AND is_used = 0', [email, type]);
     }
}

module.exports = Otp;
