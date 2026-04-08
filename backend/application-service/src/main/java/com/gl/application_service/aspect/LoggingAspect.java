package com.gl.application_service.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    @Pointcut("execution(* com.gl.application_service.service..*(..))")
    public void serviceLayer() {}
    @Before("serviceLayer()")
    public void logBefore(JoinPoint joinPoint) {
        log.info("➡️ Entering:{} Arguments: {} " ,joinPoint.getSignature().getName(),Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(value = "serviceLayer()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        log.info("✅ Completed:{}, Result:{}" ,joinPoint.getSignature().getName(),result);
    }

    @AfterThrowing(value = "serviceLayer()", throwing = "ex")
    public void logException(JoinPoint joinPoint, Exception ex) {
        log.error("❌ Exception in: {} Message: {}" , joinPoint.getSignature().getName(),ex.getMessage());
    }
}