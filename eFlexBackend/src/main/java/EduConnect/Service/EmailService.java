package EduConnect.Service;

import EduConnect.Domain.User;
import EduConnect.Repository.UserRepository;
import EduConnect.Util.SecurityUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;

@Service
public class EmailService {
    private final UserRepository userRepository;
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;
    private final SecurityUtil securityUtil;

public EmailService(UserRepository userRepository,
                    JavaMailSender javaMailSender,
                    SpringTemplateEngine templateEngine,
                    SecurityUtil securityUtil){
    this.userRepository = userRepository;
    this.javaMailSender = javaMailSender;
    this.templateEngine = templateEngine;
    this.securityUtil = securityUtil;

}
    public void sendEmailSync(String to, String subject, String content
            , boolean isMultipart, boolean isHtml) {
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage,
                    isMultipart, StandardCharsets.UTF_8.name());
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);
            this.javaMailSender.send(mimeMessage);
        } catch (MailException | MessagingException e) {
            System.out.println("ERROR SEND EMAIL: " + e);
        }
    }
    public void sendEmailFromTemplateSync(String to, String subject, String templateName,String username,Object value)
    {
        Context context=new Context();
        context.setVariable("name", username);
        context.setVariable("value", value);

        //html to string
        String content=templateEngine.process(templateName, context);
        this.sendEmailSync(to, subject, content, false, true);
    }

    @Async
    public void sendLinkReset(String email)
    {
        User user=this.userRepository.findByEmail(email);
        String token=this.securityUtil.generateResetPasswordLink(user.getEmail(), 9000000);
        String resetLink="http://localhost:3000/register/verify?token="+token;

        this.sendEmailFromTemplateSync(user.getEmail(), "Forget Password", "forgetpassword", user.getFullname(), resetLink);
    }

    public void sendLinkVerify(String email,String fullName)
    {
        String token=this.securityUtil.generateResetPasswordLink(email, 9000000);
        String resetLink="http://localhost:3000/register/verify?token="+token;
        this.sendEmailFromTemplateSync(email, "Verify Email", "verify", fullName, resetLink);
    }
}
