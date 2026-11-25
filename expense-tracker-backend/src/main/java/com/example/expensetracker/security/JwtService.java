package com.example.expensetracker.security;

import java.time.Duration;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.expensetracker.auth.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private static final Duration TTL = Duration.ofHours(12);
	private final SecretKey key;

	public JwtService(@Value("${secretKey}") String base64Secret) {
		this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(base64Secret));
	}

	public String generateToken(User user) {
		Date now = new Date();
		return Jwts.builder()
				.subject(user.getName())
				.claim("roles", user.getRoles())
				.issuer("expense-tracker")
				.issuedAt(now)
				.expiration(new Date(now.getTime() + TTL.toMillis()))
				.signWith(key)
				.compact();
	}

	/** Returns the username, or throws JwtException if the token is invalid or expired. */
	public String validateAndGetUsername(String token) throws JwtException {
		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
		return claims.getSubject();
	}
}
