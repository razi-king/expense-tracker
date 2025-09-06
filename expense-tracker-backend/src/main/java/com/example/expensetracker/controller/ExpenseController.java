package com.example.expensetracker.controller;

import java.util.ArrayList;
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

import com.example.expensetracker.dtos.ExpenseDto;
import com.example.expensetracker.dtos.Response;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Users;
import com.example.expensetracker.repository.UsersRepository;
import com.example.expensetracker.service.ExpenseService;
import com.example.expensetracker.service.UsersService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("Expense")
public class ExpenseController {
	@Autowired
	private ExpenseService expenseService;
	@Autowired
	private UsersRepository userRepository;
	@PostMapping
	public ResponseEntity<Response> addUserExpense(@Valid @RequestBody ExpenseDto expenseDto,BindingResult result){
		if(result.hasErrors()) {
			//String errors = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining(", "));

			String errors = result.getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining(", "));
			Response response = new Response();
			response.setData(null);
			response.setMessage(errors);
			response.setSuccess(false);
			return ResponseEntity.badRequest().body(response);
		}
		Expense ep = expenseService.addExpense(expenseDto);
	
		Response response = new Response();
		response.setData(ep);
		response.setSuccess(true);
		return ResponseEntity.ok(response);
	}
	@GetMapping
	public ArrayList<Expense> getAllExpense(){
		return expenseService.getAllExpense();
	}
}
