package com.gl.userService;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"eureka.client.enabled=false",
		"spring.cloud.discovery.enabled=false",
		"spring.datasource.url=jdbc:postgresql://localhost:5432/user-service"
})
class UserServiceApplicationTests {
	@Test
	void contextLoads() {}
}