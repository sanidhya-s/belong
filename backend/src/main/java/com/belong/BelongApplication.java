package com.belong;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class BelongApplication {
    public static void main(String[] args) {
        SpringApplication.run(BelongApplication.class, args);
    }
}
