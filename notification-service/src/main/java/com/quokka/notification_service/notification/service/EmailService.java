package com.quokka.notification_service.notification.service;

import jakarta.mail.internet.MimeMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.quokka.notification_service.notification.dto.request.SendEmailRequest;
import com.quokka.notification_service.notification.dto.response.EmailResponse;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmailService {
    JavaMailSender mailSender;

    public EmailResponse sendEmail(SendEmailRequest request) {

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(request.getTo().getEmail());
            helper.setSubject(request.getSubject());
            helper.setText(request.getHtmlContent(), true);

            // Nếu muốn hiển thị tên người nhận
            if (request.getTo().getName() != null) {
                mimeMessage.setRecipients(
                        MimeMessage.RecipientType.TO,
                        request.getTo().getName() + " <" + request.getTo().getEmail() + ">");
            }

            mailSender.send(mimeMessage);

            return new EmailResponse(true, "Email sent successfully!");

        } catch (Exception e) {
            return new EmailResponse(false, "Failed to send email: " + e.getMessage());
        }
    }
}
