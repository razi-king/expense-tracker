package com.example.expensetracker.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.example.expensetracker.auth.User;
import com.example.expensetracker.auth.UserRepository;
import com.example.expensetracker.common.UnauthorizedException;

import lombok.RequiredArgsConstructor;

/** Resolves the logged-in user from the JWT, never from the request body. */
@Component
@RequiredArgsConstructor
public class CurrentUser {
	private final UserRepository users;

	public User get() {
		var auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated()) {
			throw new UnauthorizedException("Not logged in");
		}
		return users.findByName(auth.getName()).orElseThrow(() -> new UnauthorizedException("Account no longer exists"));
	}
}
