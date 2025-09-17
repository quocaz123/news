package com.quokka.api_gateway.configuration;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.cloud.gateway.filter.ratelimit.RedisRateLimiter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import reactor.core.publisher.Mono;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@Configuration
@Slf4j
@RequiredArgsConstructor
public class RateLimiterConfig {

    private final ReactiveRedisConnectionFactory redisConnectionFactory;

    /**
     * Dùng IP của client làm key để rate limit
     */
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> {
            String ip = exchange.getRequest()
                    .getRemoteAddress()
                    .getAddress()
                    .getHostAddress();
            log.warn("Applying rate limit for IP: {}", ip);
            return Mono.just(ip);
        };
    }

    /**
     * Khai báo RedisRateLimiter với 10 request/giây, burst 20
     */
    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20); // replenishRate = 10, burstCapacity = 20
    }

    /**
     * Kiểm tra kết nối Redis khi app khởi động
     */

    @EventListener(ApplicationReadyEvent.class)
    public void checkRedisConnection() {
        redisConnectionFactory.getReactiveConnection()
                .ping()
                .doOnSubscribe(sub -> log.info("🔄 Checking Redis connection..."))
                .doOnNext(response -> log.info("✅ Redis connected successfully, PING response: {}", response))
                .doOnError(error -> log.error("❌ Cannot connect to Redis", error))
                .subscribe();
    }
}
