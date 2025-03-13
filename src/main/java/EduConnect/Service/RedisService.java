package EduConnect.Service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final RedisTemplate<String, String> redisTemplate;

    public RedisService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    private static final String QUEUE_REGISTER ="register";

    public void RegisterWorker(String email){
        this.redisTemplate.opsForList().leftPush(QUEUE_REGISTER,email);
    }
    public void saveRefreshToken(String email, String refreshToken, long expiration) {
        String key = "refresh_token:" + email;
        System.out.println("key: "+key);
        redisTemplate.opsForValue().set(key, refreshToken, expiration, TimeUnit.MILLISECONDS);
    }
    public long getTTL(String key) {
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        return ttl != null ? ttl : -2;
    }
    public String getRefreshToken(String userId) {
        String key = "refresh_token:" + userId;
        return (String) redisTemplate.opsForValue().get(key);
    }

    public void deleteRefreshToken(String userId) {
        String key = "refresh_token:" + userId;
        redisTemplate.delete(key);
    }
}
