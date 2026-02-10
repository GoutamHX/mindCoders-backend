import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async ({ email, subject, html }) => {
  try {
    console.log('Attempting to send email to:', email);
    console.log('SMTP Config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      hasPassword: !!process.env.EMAIL_PASS
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 10000
    });

    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log("SMTP server is ready");

    const info = await transporter.sendMail({
      from: `"MindCoders Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html,
    });

    console.log("Email sent successfully");
    console.log("To:", email);
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);

    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error; 
  }
};



const emailTemplates = {
  resetPassword: (resetUrl) => ({
    subject: "Reset your MindCoders password",
    html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Logo -->
                <div style="width: 80px; height: 80px; border: 2px solid #2546bd; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto; text-align: center; line-height: 80px;">
                    <span style="color: #333; font-size: 16px;">Logo</span>
                </div>
                
                <!-- Company Name -->
                <h1 style="color: #222; font-size: 24px; font-weight: bold; margin: 0 0 30px 0; text-align: center;">MindCoders</h1>
                
                <!-- Content -->
           <p style="color: #555; font-size: 16px; line-height: 1.5; margin: 0 0 16px 0;">
    You have recently requested to reset your MindCoders password.<br>
    Click the button below to reset your password.
</p>

<p style="color: #b91c1c; font-size: 14px; margin: 0 0 20px 0; font-weight: 600;">
    ⏱ This reset link will expire in <strong>3 minutes</strong> for security reasons.
</p>

                    
                    <!-- Button -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #1a45b8; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">Reset your password</a>
                    </div>
                </div>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #1a45b8; color: white; padding: 40px 20px; text-align: center;">
                <p style="color: white; margin: 0 0 10px 0; font-size: 14px;">
                    wwwmindcoderscom
                </p>
                <p style="color: white; margin: 0 0 20px 0; font-size: 14px;">
                    mindcoders@gmaicom
                </p>
                <p style="color: white; margin: 0 0 30px 0; font-size: 14px;">
                    +37455555555
                </p>
                
                <!-- Social Icons (Placeholders) -->
                <div>
                    <span style="display: inline-block; width: 30px; height: 30px; background-color: white; border-radius: 50%; margin: 0 10px; line-height: 30px; color: #1a45b8; font-weight: bold;">f</span>
                    <span style="display: inline-block; width: 30px; height: 30px; background-color: white; border-radius: 50%; margin: 0 10px; line-height: 30px; color: #1a45b8; font-weight: bold;">in</span>
                    <span style="display: inline-block; width: 30px; height: 30px; background-color: white; border-radius: 50%; margin: 0 10px; line-height: 30px; color: #1a45b8; font-weight: bold;">t</span>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
  }),
};

export { sendEmail, emailTemplates };
