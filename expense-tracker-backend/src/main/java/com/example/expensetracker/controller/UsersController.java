package com.example.expensetracker.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.expensetracker.dtos.Response;
import com.example.expensetracker.dtos.UsersDto;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Users;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.UsersService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UsersController {
	@Autowired
	private UsersService usersService;
	@Autowired
	private ExpenseService expenseService;
	@GetMapping("/allUsers")
	public ArrayList<Users> getAllUsers(){
		return usersService.getAllUsers();
	}
	@PostMapping("/register")
	public ResponseEntity<Response> addUser(@Valid @RequestBody UsersDto user,BindingResult result) {
		if(result.hasErrors()) {
			String errors = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining(", "));
			Response response = new Response();
			response.setSuccess(false);
			response.setData(null);
			response.setMessage(errors);
			return ResponseEntity.badRequest().body(response);
		}
		usersService.saveUser(user);
		Response response = new Response();
//		List<Expense> expenseList = expenseService.findExpenseBasedOnUserId();
		response.setData(user);
		response.setSuccess(true);
		return ResponseEntity.ok(response);
	}
	@PostMapping("/login")
	public String loginUser(@RequestBody Users u) {
		return usersService.verify(u);
	}
	
}
