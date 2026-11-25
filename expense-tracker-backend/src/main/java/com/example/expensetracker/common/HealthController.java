package com.example.expensetracker.common;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {
	/** Used by Render's health check and to wake the free instance from the frontend. */
	@GetMapping("/healthz")
	public Map<String, String> health() {
		return Map.of("status", "ok");
	}
}
