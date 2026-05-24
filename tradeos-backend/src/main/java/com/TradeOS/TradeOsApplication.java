package com.TradeOS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TradeOsApplication {

	public static void main(String[] args) {

		SpringApplication.run(
				TradeOsApplication.class,
				args
		);
	}
}