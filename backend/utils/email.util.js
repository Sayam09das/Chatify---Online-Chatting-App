const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

let smtpTransporter = null;
let sendGridInitialized = false;

const hasSendGridConfig = () => Boolean(process.env.SENDGRID_API_KEY);
const hasSmtpConfig = () => Boolean(
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

const getEmailProvider = () => {
  if (hasSendGridConfig()) return 'sendgrid';
  if (hasSmtpConfig()) return 'smtp';
  return null;
};

const initializeSendGrid = () => {
  if (!hasSendGridConfig()) return false;
  if (!sendGridInitialized) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendGridInitialized = true;
  }
  return true;
};

const getSmtpTransporter = () => {
  if (!hasSmtpConfig()) return null;
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return smtpTransporter;
};

const sendEmail = async ({ to, subject, text, html, templateId, dynamicTemplateData }) => {
  const provider = getEmailProvider();
  if (!provider) {
    throw new Error('Email service is not configured. Set SENDGRID_API_KEY or SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.');
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER || 'noreply@chatify.app';
  try {
    if (provider === 'sendgrid') {
      initializeSendGrid();
      await sgMail.send({
        to,
        from,
        subject,
        text,
        html,
        templateId,
        dynamicTemplateData,
      });
      return { success: true, provider: 'sendgrid' };
    }

    const transporter = getSmtpTransporter();
    if (!transporter) {
      throw new Error('SMTP transporter initialization failed.');
    }
    await transporter.sendMail({
      to,
      from,
      subject,
      text,
      html,
    });
    return { success: true, provider: 'smtp' };
  } catch (error) {
    const sendGridMessage = error?.response?.body?.errors?.[0]?.message;
    const message = sendGridMessage || error.message || 'Unknown email delivery error';
    throw new Error(`Failed to send email via ${provider}: ${message}`);
  }
};

// Generate verification token (JWT)
const generateVerificationToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'email_verification' },
    process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_SECRET,
    { expiresIn: '24h' }
  );
};

// Generate password reset token (JWT)
const generatePasswordResetToken = (userId, email) => {
  return jwt.sign(
    { userId, email, type: 'password_reset' },
    process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
  );
};

// Verify token and return payload
const verifyToken = (token, type = 'any') => {
  const secret = type === 'password_reset' 
    ? (process.env.JWT_RESET_SECRET || process.env.JWT_ACCESS_SECRET)
    : (process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_SECRET);
    
  return jwt.verify(token, secret);
};

// Send verification email
const sendVerificationEmail = async (user) => {
  const token = generateVerificationToken(user._id, user.email);
  const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 30px;">💬</span>
            </div>
            <h1 style="color: #111827; margin: 20px 0 10px; font-size: 24px;">Verify Your Email</h1>
            <p style="color: #6b7280; margin: 0;">Welcome to Chatify! Please verify your email address to get started.</p>
          </div>
          
          <!-- Content -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click the button below to verify your email address:
            </p>
            
            <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0;">
              Verify Email
            </a>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="color: #6b7280; word-break: break-all;">${verifyUrl}</span>
            </p>
          </div>
          
          <!-- Warning -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-top: 30px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              ⚠️ This link will expire in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Chatify. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Verify Your Email - Chatify',
    html,
  });
};

// Send password reset email
const sendPasswordResetEmail = async (user) => {
  const token = generatePasswordResetToken(user._id, user.email);
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #dc2626, #b91c1c); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 30px;">🔐</span>
            </div>
            <h1 style="color: #111827; margin: 20px 0 10px; font-size: 24px;">Reset Your Password</h1>
            <p style="color: #6b7280; margin: 0;">We received a request to reset your Chatify password.</p>
          </div>
          
          <!-- Content -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click the button below to reset your password:
            </p>
            
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 20px 0;">
              Reset Password
            </a>
            
            <p style="color: #9ca3af; font-size: 14px; margin-top: 20px;">
              Or copy and paste this link in your browser:<br>
              <span style="color: #6b7280; word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
          
          <!-- Warning -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-top: 30px;">
            <p style="color: #92400e; font-size: 14px; margin: 0;">
              ⚠️ This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Chatify. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Reset Your Password - Chatify',
    html,
  });
};

// Send welcome email (for Google sign-up)
const sendWelcomeEmail = async (user) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Logo -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #16a34a, #15803d); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 30px;">💬</span>
            </div>
            <h1 style="color: #111827; margin: 20px 0 10px; font-size: 24px;">Welcome to Chatify!</h1>
            <p style="color: #6b7280; margin: 0;">Your account has been created successfully.</p>
          </div>
          
          <!-- Content -->
          <div style="margin: 30px 0;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hi <strong>${user.username}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Welcome to Chatify! We're excited to have you on board. Start connecting with friends and family through secure, private messaging.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; background: linear-gradient(135deg, #16a34a, #15803d); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                Get Started
              </a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; color: #9ca3af; font-size: 12px;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Chatify. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: user.email,
    subject: 'Welcome to Chatify! 🎉',
    html,
  });
};

module.exports = {
  sendEmail,
  generateVerificationToken,
  generatePasswordResetToken,
  verifyToken,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  initializeSendGrid,
  getEmailProvider,
};
