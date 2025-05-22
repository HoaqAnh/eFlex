package EduConnect.Util;

import EduConnect.Domain.Response.ResLoginDTO;
import com.nimbusds.jose.util.Base64;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class SecurityUtil {
    public static final MacAlgorithm JWT_ALGORITH=MacAlgorithm.HS256;

    private final JwtEncoder jwtEncoder;

    @Value("${imthang.jwt.base64-secret}")
    private String jwtKey;

    @Value("${imthang.jwt.access-token-validity-in-seconds}")
    private long accessTokenExpiration;

    @Value("${imthang.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenExpiration;

    public SecurityUtil(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String createAcessToken(String email, ResLoginDTO dto)
    {
        ResLoginDTO.UserInsideToken userInsideToken=new ResLoginDTO.UserInsideToken();
        userInsideToken.setId(dto.getUserLogin().getId());
        userInsideToken.setEmail(dto.getUserLogin().getEmail());
        userInsideToken.setName(dto.getUserLogin().getName());
        Instant now = Instant.now();
        Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

        //hardcode permission
        List<String> listAuthority=new ArrayList<>();
        listAuthority.add("ROLE_USER_CREATE");
        listAuthority.add("ROLE_USER_UPDATE");
//Body
// @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userInsideToken)
                .claim("permission", listAuthority)
                .build();
        //header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITH).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
                claims)).getTokenValue();
    }

    public String createRefreshToken(String email,ResLoginDTO dto)
    {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        ResLoginDTO.UserInsideToken userInsideToken=new ResLoginDTO.UserInsideToken();
        userInsideToken.setId(dto.getUserLogin().getId());
        userInsideToken.setEmail(dto.getUserLogin().getEmail());
        userInsideToken.setName(dto.getUserLogin().getName());
//Body
// @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("user", userInsideToken)
                .build();
        //header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITH).build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader,
                claims)).getTokenValue();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITH.getName());
    }
    public Jwt checkValidRefreshToken(String token)
    {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(SecurityUtil.JWT_ALGORITH).build();
        try{
            return jwtDecoder.decode(token);
        }catch (Exception e)
        {
            System.out.println(">>> Refresh Token error: "+e.getMessage());
            throw e;
        }
    }


    public String generateResetPasswordLink(String email, long expirationMillis) {
        Instant now = Instant.now();
        Instant validity = now.plusMillis(expirationMillis);

        // Tạo JWT ClaimsSet
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)  // Thời gian phát hành token
                .expiresAt(validity)  // Thời gian hết hạn token
                .subject(email)  // Thông tin người dùng (email)
                .build();

        // Tạo header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITH).build();

        // Mã hóa JWT
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }



}