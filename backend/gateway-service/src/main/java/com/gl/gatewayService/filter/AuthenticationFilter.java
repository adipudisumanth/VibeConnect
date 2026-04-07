package com.gl.gatewayService.filter;

import com.gl.gatewayService.util.JwtUtil;
import com.gl.gatewayService.util.RouteValidator;
import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config>{

    public final RouteValidator validator;
    public final JwtUtil jwtUtil;

    public AuthenticationFilter(RouteValidator validator, JwtUtil jwtUtil){
        super(Config.class);
        this.validator = validator;
        this.jwtUtil = jwtUtil;
    }


    @Override
    public GatewayFilter apply(Config config) {
        return ((exchange, chain)->{

            if(validator.isSecured.test(exchange.getRequest())){
                if(!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION))
                    return onError(exchange, "Unauthorized", HttpStatus.UNAUTHORIZED);

                String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

                if(authHeader!=null && authHeader.startsWith("Bearer ")){
                    authHeader = authHeader.substring(7);
                }
                try{
                    Claims claims = jwtUtil.validateJwt(authHeader);
                    List<String> rolesList = claims.get("roles", List.class);
                    String roles = (rolesList != null) ? String.join(",", rolesList) : "";

                    ServerHttpRequest mutatedRequest = exchange.getRequest()
                            .mutate()
                            .headers(httpHeaders -> {
                                httpHeaders.remove(HttpHeaders.AUTHORIZATION);
                                httpHeaders.remove("X-User-Id");    // Safety: remove if user sent it
                                httpHeaders.remove("X-User-Roles"); // Safety: remove if user sent it
                            })
                            .header("X-User-Id",claims.getSubject())
                            .header("X-User-Roles", roles)
                            .build();
                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                }catch(Exception e){
                    return onError(exchange, "Invalid Token or Token Expired", HttpStatus.UNAUTHORIZED);
                }
            }

            return chain.filter(exchange);
        });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);

        response.getHeaders().add(HttpHeaders.CONTENT_TYPE, "application/json");

        String errorMessage = String.format("{\"status\": %d, \"message\": \"%s\"}",
                httpStatus.value(), err);

        DataBuffer buffer = response.bufferFactory().wrap(errorMessage.getBytes());

        return response.writeWith(Mono.just(buffer));
    }
    public static class Config{

    }

}
