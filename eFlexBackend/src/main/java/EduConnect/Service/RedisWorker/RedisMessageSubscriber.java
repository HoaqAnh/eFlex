package EduConnect.Service.RedisWorker;

import EduConnect.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
public class RedisMessageSubscriber implements MessageListener {
    private final EmailService emailService;
    public RedisMessageSubscriber(EmailService emailService) {
        this.emailService = emailService;
    }
    @Override
    public void onMessage(Message message, byte[] pattern) {
        String msg = new String(message.getBody());
        String channel = new String(message.getChannel());
        if(channel.equals("send-email")) {
            this.emailService.sendLinkVerify(msg,"USER");
        }

    }
}