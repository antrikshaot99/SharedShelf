const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  /**
   * Initialize transporter with environment variables
   */
  initializeTransporter() {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('⚠️ Email credentials not configured in .env file');
      return;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error.message);
    }
  }

  /**
   * Verify transporter connection
   */
  async verifyConnection() {
    if (!this.transporter) {
      throw new Error('Email service not configured');
    }
    try {
      await this.transporter.verify();
      console.log('✅ Email transporter verified');
      return true;
    } catch (error) {
      console.error('❌ Email transporter verification failed:', error.message);
      throw error;
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(userEmail, userName, order, orderItems) {
    const itemsHtml = orderItems
      .map(
        item =>
          `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #f0f0f0;">${item.book.title}</td>
            <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">₹${parseFloat(item.price).toFixed(2)}</td>
            <td style="padding: 12px; border-bottom: 1px solid #f0f0f0; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Order Confirmation - SharedShelf Order #${order.id}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 24px; margin-bottom: 5px; }
              .header p { font-size: 14px; opacity: 0.9; }
              .content { padding: 30px 20px; }
              .greeting { font-size: 16px; margin-bottom: 20px; line-height: 1.8; }
              .section { margin-bottom: 30px; }
              .section-title { font-size: 16px; font-weight: 600; color: #667eea; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #f0f0f0; }
              .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
              .info-label { font-weight: 500; color: #666; }
              .info-value { color: #333; }
              .badge { display: inline-block; padding: 6px 12px; background-color: #667eea; color: white; border-radius: 20px; font-size: 13px; font-weight: 500; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th { background-color: #f9f9f9; padding: 12px; text-align: left; font-weight: 600; color: #667eea; border-bottom: 2px solid #667eea; font-size: 13px; }
              td { padding: 12px; border-bottom: 1px solid #f0f0f0; }
              .total-row { font-weight: 600; background-color: #f9f9f9; border-bottom: 2px solid #667eea; }
              .total-row td { padding: 15px 12px; }
              .button-container { text-align: center; margin-top: 25px; }
              .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block; }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
              .divider { height: 1px; background-color: #f0f0f0; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>📚 Order Confirmed</h1>
                <p>Thank you for your order!</p>
              </div>
              <div class="content">
                <div class="greeting">
                  <p>Hi <strong>${userName}</strong>,</p>
                  <p>Your order has been successfully placed. We're thrilled to help you find your next favorite books!</p>
                </div>

                <div class="section">
                  <div class="section-title">Order Details</div>
                  <div class="info-row">
                    <span class="info-label">Order ID:</span>
                    <span class="info-value">#${order.id}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Order Date:</span>
                    <span class="info-value">${new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Order Type:</span>
                    <span class="info-value"><span class="badge">${order.orderType === 'rental' ? '🔄 Rental' : '📖 Purchase'}</span></span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value"><span class="badge">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></span>
                  </div>
                </div>

                <div class="section">
                  <div class="section-title">Order Items</div>
                  <table>
                    <tr>
                      <th>Book Title</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Unit Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td colspan="3" style="text-align: right;">Total Amount:</td>
                      <td style="text-align: right;">₹${parseFloat(order.totalAmount).toFixed(2)}</td>
                    </tr>
                  </table>
                </div>

                ${
                  order.orderType === 'rental'
                    ? `
                  <div class="section">
                    <div class="section-title">Rental Information</div>
                    <p style="margin-bottom: 10px;"><strong>Rental Period:</strong> 30 days from delivery</p>
                    <p><strong>Important:</strong> Please return books in good condition before the due date to avoid any late fees.</p>
                  </div>
                `
                    : ''
                }

                <div class="section">
                  <div class="section-title">What Happens Next?</div>
                  <p style="margin-bottom: 12px;">✓ We're processing your order right now</p>
                  <p style="margin-bottom: 12px;">✓ You'll receive a shipping confirmation email within 24 hours</p>
                  <p style="margin-bottom: 12px;">✓ Track your package with the tracking number we'll send you</p>
                </div>

                <div class="button-container">
                  <a href="http://localhost:5173/orders" class="button">View My Orders</a>
                </div>

                <div class="divider"></div>

                <p style="font-size: 13px; color: #666; margin-top: 20px;">
                  If you have any questions about your order, please don't hesitate to contact us. We're here to help!
                </p>
              </div>
              <div class="footer">
                <p>© 2026 SharedShelf. All rights reserved.</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    try {
      if (!this.transporter) {
        console.warn('⚠️ Email service not configured, skipping order confirmation email');
        return { success: false, message: 'Email service not configured' };
      }
      
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Order confirmation email sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send order confirmation email to ${userEmail}:`, error.message);
      throw error;
    }
  }

  /**
   * Send rental due reminder email
   */
  async sendRentalReminder(userEmail, userName, book, dueDate) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Rental Reminder - "${book.title}" Due Soon`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 24px; margin-bottom: 5px; }
              .content { padding: 30px 20px; }
              .alert-box { background-color: #fff5e6; border-left: 4px solid #f5576c; padding: 20px; margin: 20px 0; border-radius: 3px; }
              .alert-box strong { color: #f5576c; }
              .info-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; }
              .info-box p { margin: 8px 0; }
              .due-date { font-size: 20px; font-weight: 600; color: #f5576c; }
              .button-container { text-align: center; margin-top: 25px; }
              .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block; }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⏰ Rental Due Reminder</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${userName}</strong>,</p>
                <p style="margin-bottom: 20px;">This is a friendly reminder that your rental is coming up!</p>

                <div class="alert-box">
                  <p><strong>Book:</strong> ${book.title}</p>
                  <p><strong>Due Date:</strong></p>
                  <p class="due-date">${new Date(dueDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>

                <div class="info-box">
                  <p>📌 <strong>Important Reminder:</strong></p>
                  <p>Please return the book in good condition before the due date to avoid any late fees.</p>
                  <p style="margin-top: 10px;">You'll be charged a small late fee for each day the book is returned after the due date.</p>
                </div>

                <p style="margin-top: 20px;">If you'd like to extend your rental, visit your account dashboard or contact us - extensions may be available!</p>

                <div class="button-container">
                  <a href="http://localhost:5173/rentals" class="button">Manage My Rentals</a>
                </div>
              </div>
              <div class="footer">
                <p>© 2026 SharedShelf. All rights reserved.</p>
                <p>This is an automated reminder. Please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    try {
      if (!this.transporter) {
        console.warn('⚠️ Email service not configured, skipping rental reminder email');
        return { success: false, message: 'Email service not configured' };
      }
      
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Rental reminder email sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send rental reminder email to ${userEmail}:`, error.message);
      throw error;
    }
  }

  /**
   * Send rental completion email
   */
  async sendRentalCompleted(userEmail, userName, book) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Rental Completed - "${book.title}"`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; }
              .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
              .header h1 { font-size: 24px; margin-bottom: 5px; }
              .content { padding: 30px 20px; }
              .success-box { background-color: #f0f9ff; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 3px; }
              .book-info { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #e0e0e0; }
              .book-title { font-size: 18px; font-weight: 600; color: #333; }
              .button-container { text-align: center; margin-top: 25px; }
              .button { background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: 500; display: inline-block; }
              .recommendations { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
              .recommendations h3 { color: #667eea; margin-bottom: 10px; }
              .footer { background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Rental Completed</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${userName}</strong>,</p>
                <p style="margin-bottom: 20px;">Thank you for returning your rental!</p>

                <div class="success-box">
                  <p>We've successfully received and processed the return of:</p>
                  <div class="book-info">
                    <p class="book-title">"${book.title}"</p>
                  </div>
                </div>

                <p>Your rental has been completed and marked as returned in your account. Thank you for taking care of the book!</p>

                <div class="recommendations">
                  <h3>📚 Ready for More?</h3>
                  <p>Explore our collection and find your next favorite book. We have thousands of titles waiting for you!</p>
                </div>

                <div class="button-container">
                  <a href="http://localhost:5173/rentals" class="button">Browse More Books</a>
                </div>
              </div>
              <div class="footer">
                <p>© 2026 SharedShelf. All rights reserved.</p>
                <p>This is an automated message. Please do not reply directly to this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    try {
      if (!this.transporter) {
        console.warn('⚠️ Email service not configured, skipping rental completion email');
        return { success: false, message: 'Email service not configured' };
      }
      
      const result = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Rental completion email sent to ${userEmail}`);
      return result;
    } catch (error) {
      console.error(`❌ Failed to send rental completion email to ${userEmail}:`, error.message);
      throw error;
    }
  }
}

module.exports = new EmailService();
