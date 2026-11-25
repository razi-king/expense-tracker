package com.example.expensetracker.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Authenticates requests that carry "Authorization: Bearer <jwt>".
 * Requests without a token pass through untouched (public endpoints still work);
 * a bad or expired token leaves the request unauthenticated, so protected
 * endpoints answer 401 instead of crashing with a 500.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	private final JwtService jwtService;
	private final AppUserDetailsService userDetailsService;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")
				|| SecurityContextHolder.getContext().getAuthentication() != null) {
			chain.doFilter(request, response);
			return;
		}
		try {
			String username = jwtService.validateAndGetUsername(header.substring(7));
			var user = userDetailsService.loadUserByUsername(username);
			var auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
			auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
			SecurityContextHolder.getContext().setAuthentication(auth);
		} catch (JwtException | IllegalArgumentException | UsernameNotFoundException e) {
			SecurityContextHolder.clearContext();
		}
		chain.doFilter(request, response);
	}
}
