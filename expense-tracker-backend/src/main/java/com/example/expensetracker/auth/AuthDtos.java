package com.example.expensetracker.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Request and response bodies for /api/auth. Records keep the API contract explicit. */
public final class AuthDtos {
	private AuthDtos() {
	}

	public record RegisterRequest(
			@NotBlank(message = "Username is required")
			@Size(min = 3, max = 40, message = "Username must be 3 to 40 characters")
			@Pattern(regexp = "^[A-Za-z0-9_]+$", message = "Username can only contain letters, numbers and underscores")
			String name,

			@NotBlank(message = "Email is required")
			@Email(message = "Email address is not valid")
			String email,

			@NotBlank(message = "Password is required")
			@Size(min = 8, max = 64, message = "Password must be 8 to 64 characters")
			String password) {
	}

	public record LoginRequest(
			@NotBlank(message = "Username is required") String name,
			@NotBlank(message = "Password is required") String password) {
	}

	public record UserResponse(Long id, String name, String email) {
		static UserResponse of(User u) {
			return new UserResponse(u.getId(), u.getName(), u.getEmail());
		}
	}

	public record AuthResponse(String token, UserResponse user) {
	}
}
