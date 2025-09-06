package com.example.expensetracker.service.impl;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.expensetracker.dtos.UsersDto;
import com.example.expensetracker.entity.Users;
import com.example.expensetracker.repository.UsersRepository;
import com.example.expensetracker.service.JwtService;
import com.example.expensetracker.service.UsersService;

@Service
public class UsersServiceImpl implements UsersService {
	@Autowired
	private UsersRepository usersRepository;
	@Autowired
	private JwtService jwtService;
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private PasswordEncoder passwordEncoder;
	@Override
	public Users saveUser(UsersDto userDto) {
		Users u = new Users();
		u.setName(userDto.getName());
		u.setEmail(userDto.getEmail());
		u.setPassword(passwordEncoder.encode(userDto.getPassword()));
		u.setRoles(userDto.getRoles());
		return usersRepository.save(u);
	}

	@Override
	public String verify(Users u) {
		Authentication authenticate = authenticationManager
										.authenticate(
												new UsernamePasswordAuthenticationToken(
														u.getName(), u.getPassword()));
		if(authenticate.isAuthenticated()) {
			return jwtService.generateToken(u);
		}
		return "Wrong Credentials";
	}

	@Override
	public ArrayList<Users> getAllUsers() {
		return (ArrayList<Users>)usersRepository.findAll();
	}

}
