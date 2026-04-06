package com.gl.gatewayService.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    @Value(value = "${jwt.secret.key}")
    public String SECRET_KEY;

    public Claims validateJwt(final String token){
        return Jwts.parser().verifyWith(getKey())
                .build().parseSignedClaims(token).getPayload();
    }

    public SecretKey getKey(){
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

}
