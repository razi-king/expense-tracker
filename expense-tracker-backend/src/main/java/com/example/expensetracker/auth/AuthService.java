package com.example.expensetracker.auth;

import java.util.Set;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.auth.AuthDtos.AuthResponse;
import com.example.expensetracker.auth.AuthDtos.LoginRequest;
import com.example.expensetracker.auth.AuthDtos.RegisterRequest;
import com.example.expensetracker.auth.AuthDtos.UserResponse;
import com.example.expensetracker.common.ConflictException;
import com.example.expensetracker.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository users;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	/** New accounts always get the USER role; roles are never taken from the request. */
	@Transactional
	public AuthResponse register(RegisterRequest req) {
		String name = req.name().trim();
		String email = req.email().trim().toLowerCase();
		if (users.existsByNameIgnoreCase(name)) {
			throw new ConflictException("That username is already taken");
		}
		if (users.existsByEmailIgnoreCase(email)) {
			throw new ConflictException("An account with that email already exists");
		}
		User u = new User();
		u.setName(name);
		u.setEmail(email);
		u.setPassword(passwordEncoder.encode(req.password()));
		u.setRoles(Set.of("USER"));
		users.save(u);
		return new AuthResponse(jwtService.generateToken(u), UserResponse.of(u));
	}

	/** Throws BadCredentialsException (mapped to 401) when the credentials are wrong. */
	public AuthResponse login(LoginRequest req) {
		authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.name().trim(), req.password()));
		User u = users.findByName(req.name().trim()).orElseThrow();
		return new AuthResponse(jwtService.generateToken(u), UserResponse.of(u));
	}
}
