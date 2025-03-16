package EduConnect.Service.RedisWorker;

import EduConnect.Service.EmailService;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class TaskWorker {
    private static final String QUEUE_REGISTER ="register";
    private final RedisTemplate<String,String > redisTemplate;
    private final EmailService emailService;

    public TaskWorker(RedisTemplate<String,String > redisTemplate, EmailService emailService) {
        this.redisTemplate = redisTemplate;
        this.emailService = emailService;
    }

    @Scheduled(fixedDelay = 5000)
    public void tashRegister(){
        String task = redisTemplate.opsForList().rightPop(QUEUE_REGISTER);
        if (task != null) {
            System.out.println("Processing task: " + task);
            this.emailService.sendLinkVerify(task,task);
            executeTask(task);
        }
    }

    private void executeTask(String task) {
        try {
            Thread.sleep(2000);
            System.out.println("Task completed: " + task);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
