package EduConnect.Service;

import EduConnect.Domain.Response.UserDTO;
import EduConnect.Domain.User;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {
    private final RedisTemplate<String, String> redisTemplate;
    private final RedisTemplate<String, UserDTO> userDTORedisTemplate;
    public RedisService(RedisTemplate<String, String> redisTemplate, RedisTemplate<String, UserDTO> userDTORedisTemplate ) {
        this.redisTemplate = redisTemplate;
        this.userDTORedisTemplate = userDTORedisTemplate;
    }
    public UserDTO getUserDTO(String key) {
        return userDTORedisTemplate.opsForValue().get(key);
    }

    public void addUserDTO(String key, UserDTO userDTO, long ttlSeconds) {
        userDTORedisTemplate.opsForValue().set(key, userDTO);
        userDTORedisTemplate.expire(key, ttlSeconds, TimeUnit.SECONDS);
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
    public void sendEmail(String message) {
        redisTemplate.convertAndSend("send-email", message);
        System.out.println("Published message to channel " + "gui email to" + ": " + message);
    }
}
