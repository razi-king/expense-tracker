package com.example.expensetracker.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.expensetracker.auth.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {
	private final UserRepository users;

	@Override
	public UserDetails loadUserByUsername(String username) {
		var u = users.findByName(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return org.springframework.security.core.userdetails.User.withUsername(u.getName())
				.password(u.getPassword())
				.authorities(u.getRoles().stream().map(r -> new SimpleGrantedAuthority("ROLE_" + r)).toList())
				.build();
	}
}
