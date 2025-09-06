package com.example.expensetracker.service.impl;

import java.security.Key;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.expensetracker.entity.Users;
import com.example.expensetracker.repository.UsersRepository;
import com.example.expensetracker.service.JwtService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
@Service
public class JwtServiceImpl implements JwtService{
	@Autowired
	UsersRepository usersRepository;
	String secKey ="";
	public JwtServiceImpl(@Value("${secretKey}") String secKey) {
		this.secKey = secKey;
	}
	@Override
	public String generateToken(Users users) {
		Map<String, Object> claims = new HashMap<>();
		Users u = usersRepository.findByName(users.getName());
		if(u==null) {
			throw new UsernameNotFoundException("Invalid User Name");
		}
		claims.put("roles", u.getRoles());
		return Jwts.builder()
				.claims()
				.add(claims)
				.and()
				.subject(u.getName())
				.issuer("Razi")
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis()+1000*60*120))
				.signWith(generateKey())
				.compact();
	}
	private SecretKey generateKey() {
		byte[] decode = Decoders.BASE64.decode(secKey);
		return Keys.hmacShaKeyFor(decode);
	}
	@Override
	public String extractUsername(String jwt) {
		return extractClaims(jwt,Claims::getSubject);
	}
	private <T> T extractClaims(String jwt, Function<Claims,T> claimResolver) {
		Claims claims = extractClaims(jwt);
		return claimResolver.apply(claims);
	}
	private Claims extractClaims(String jwt) {
		return Jwts
				.parser()
				.verifyWith(generateKey())
				.build()
				.parseSignedClaims(jwt)
				.getPayload();
	}
	@Override
	public boolean isTokenValid(String jwt, UserDetails userDetails) {
		String username = extractUsername(jwt);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(jwt));
	}
	private boolean isTokenExpired(String jwt) {
		
		return extractExpiration(jwt).before(new Date());
	}
	private Date extractExpiration(String jwt) {
		
		return extractClaims(jwt,Claims::getExpiration);
	}
	@Override
	public Set<String> extractRoles(String jwt) {
		Object raw = extractClaims(jwt).get("roles");
		if(raw instanceof Collection<?>c) {
			Set<String> l = new HashSet<>();
			for(Object o:c) {
				l.add(String.valueOf(o));
				
			}
			return l;
		}
		return Set.of();
	}
	
}
