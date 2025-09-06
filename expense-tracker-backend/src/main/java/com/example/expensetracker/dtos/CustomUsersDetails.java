package com.example.expensetracker.dtos;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.expensetracker.entity.Users;

public class CustomUsersDetails implements UserDetails {
	private Users users;
	public CustomUsersDetails(Users users) {
		this.users = users;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		Set<String> roles = users.getRoles();
		return roles
				.stream()
				.map(r -> r.startsWith("ROLE_")? r:"ROLE_"+r)
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toSet());
	}

	@Override
	public String getPassword() {
		return users.getPassword();
	}

	@Override
	public String getUsername() {
		return users.getName();
	}
}
