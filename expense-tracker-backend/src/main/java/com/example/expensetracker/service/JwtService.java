package com.example.expensetracker.service;

import java.util.Set;

import org.springframework.security.core.userdetails.UserDetails;

import com.example.expensetracker.entity.Users;

public interface JwtService {

	String generateToken(Users u);

	String extractUsername(String jwt);

	boolean isTokenValid(String jwt, UserDetails userDetails);

	Set<String> extractRoles(String jwt);

}
