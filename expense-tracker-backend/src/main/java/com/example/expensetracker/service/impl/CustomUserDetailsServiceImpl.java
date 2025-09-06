package com.example.expensetracker.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.expensetracker.dtos.CustomUsersDetails;
import com.example.expensetracker.entity.Users;
import com.example.expensetracker.repository.UsersRepository;
import com.example.expensetracker.service.CustomUserDetailsService;
@Service
public class CustomUserDetailsServiceImpl implements CustomUserDetailsService {
	@Autowired
	private UsersRepository usersRepository;
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Users users = usersRepository.findByName(username);
		return new CustomUsersDetails(users);
	}

}
