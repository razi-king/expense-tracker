package com.example.expensetracker.service;

import java.util.ArrayList;

import com.example.expensetracker.dtos.UsersDto;
import com.example.expensetracker.entity.Users;

public interface UsersService {
	Users saveUser(UsersDto userDto);

	String verify(Users u);

	ArrayList<Users> getAllUsers();
}
