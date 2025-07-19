const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(user) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to SRR Farms! 🌾',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; margin: 0; font-size: 28px;">🌾 SRR FARMS</h1>
              <p style="color: #666; margin: 5px 0;">Premium Organic Products</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${user.fullName}! 🎉</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining our SRR Farms family! We're excited to have you on board.
            </p>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #d97706; margin: 0 0 10px 0;">Account Details:</h3>
              <p style="margin: 5px 0; color: #555;"><strong>Name:</strong> ${user.fullName}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Email:</strong> ${user.email}</p>
              <p style="margin: 5px 0; color: #555;"><strong>Phone:</strong> ${user.phone}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              You can now explore our premium organic products and enjoy a seamless shopping experience.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Start Shopping 🛒
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                Best regards,<br>
                The SRR Farms Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Welcome email sent successfully to:', user.email);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
    }
  }

  async sendPasswordResetEmail(user, newPassword) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your New Password - SRR Farms 🔑',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; margin: 0; font-size: 28px;">🌾 SRR FARMS</h1>
              <p style="color: #666; margin: 5px 0;">Premium Organic Products</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request Approved 🔑</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.fullName},
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Your password reset request has been approved by our admin team. Here is your new temporary password:
            </p>
            
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #d97706; margin: 0 0 10px 0;">New Password:</h3>
              <p style="font-family: 'Courier New', monospace; font-size: 20px; font-weight: bold; color: #333; margin: 0; background-color: white; padding: 15px; border-radius: 5px; border: 2px dashed #d97706;">
                ${newPassword}
              </p>
            </div>
            
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <p style="color: #dc2626; margin: 0; font-weight: bold;">Security Notice:</p>
              <p style="color: #991b1b; margin: 5px 0 0 0; font-size: 14px;">
                Please login with this temporary password and change it immediately for security purposes.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="background-color: #d97706; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                Login Now 🔐
              </a>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't request this password reset, please contact our support team immediately.<br><br>
                Best regards,<br>
                The SRR Farms Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset email sent successfully to:', user.email);
      return true;
    } catch (error) {
      console.error('❌ Error sending password reset email:', error);
      return false;
    }
  }

  async sendPasswordResetNotification(user) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request Received - SRR Farms 📝',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #d97706; margin: 0; font-size: 28px;">🌾 SRR FARMS</h1>
              <p style="color: #666; margin: 5px 0;">Premium Organic Products</p>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request Received 📝</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Hello ${user.fullName},
            </p>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We have received your password reset request. Our admin team will review and process your request shortly.
            </p>
            
            <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0277bd; margin: 0 0 10px 0;">What happens next?</h3>
              <ul style="color: #555; margin: 10px 0; padding-left: 20px;">
                <li>Our admin team will verify your identity</li>
                <li>A new temporary password will be generated</li>
                <li>You'll receive an email with your new password</li>
                <li>You can then login and change your password</li>
              </ul>
            </div>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              This process typically takes 24-48 hours during business days.
            </p>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 14px; margin: 0;">
                If you didn't request this password reset, please ignore this email.<br><br>
                Best regards,<br>
                The SRR Farms Team
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('✅ Password reset notification sent successfully to:', user.email);
    } catch (error) {
      console.error('❌ Error sending password reset notification:', error);
    }
  }
}

module.exports = new EmailService();
