package com.example.Full_Stack_Food_Delivery_App.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendOtp(String email, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(email);
            helper.setSubject("Login OTP – Restaurant Ordering");

            String htmlContent =
                    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #eaeaea;'>" +

                            "<h2 style='color: #2c3e50; margin-bottom: 5px;'>Restaurant Ordering & Kitchen Display System</h2>" +
                            "<p style='color: #555; margin-top: 0;'>Secure Login Verification</p>" +

                            "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'/>" +

                            "<p>Hello,</p>" +
                            "<p>We received a request to log in to your account on the <b>Restaurant Ordering & Kitchen Display System</b>.</p>" +

                            "<p style='margin-top: 20px;'>Please use the One-Time Password (OTP) below to continue:</p>" +

                            "<div style='margin: 20px 0; padding: 15px; text-align: center; " +
                            "font-size: 26px; font-weight: bold; letter-spacing: 4px; " +
                            "background-color: #f8f9fa; border: 1px dashed #2c3e50;'>" +
                            otp +
                            "</div>" +

                            "<p><b>Validity:</b> This OTP is valid for <b>5 minutes</b>.</p>" +

                            "<p style='color: #c0392b;'><b>Security Notice:</b> Do not share this OTP with anyone. " +
                            "Our team will never ask for your OTP.</p>" +

                            "<p>If you did not request this login, you can safely ignore this email.</p>" +

                            "<br/>" +
                            "<p>Regards,<br/>" +
                            "<b>Restaurant Automation System Team</b></p>" +

                            "<hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'/>" +

                            "<p style='font-size: 12px; color: #888;'>" +
                            "This is an automated message. Please do not reply to this email." +
                            "</p>" +
                            "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send OTP email");
        }
    }

}
