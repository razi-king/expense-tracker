package com.example.expensetracker.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.expensetracker.auth.AuthDtos.AuthResponse;
import com.example.expensetracker.auth.AuthDtos.LoginRequest;
import com.example.expensetracker.auth.AuthDtos.RegisterRequest;
import com.example.expensetracker.auth.AuthDtos.UserResponse;
import com.example.expensetracker.security.CurrentUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;
	private final CurrentUser currentUser;

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
		return authService.register(req);
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody LoginRequest req) {
		return authService.login(req);
	}

	@GetMapping("/me")
	public UserResponse me() {
		return UserResponse.of(currentUser.get());
	}
}
