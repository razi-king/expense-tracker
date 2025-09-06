package com.example.expensetracker.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.expensetracker.dtos.ExpenseDto;
import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Users;
import com.example.expensetracker.repository.ExpenseRepository;
import com.example.expensetracker.repository.UsersRepository;
import com.example.expensetracker.service.ExpenseService;
@Service
public class ExpenseServiceImpl implements ExpenseService {
	@Autowired
	private ExpenseRepository expenseRepository;
	@Autowired
	private UsersRepository userRepository;
	

	@Override
	public Expense addExpense(ExpenseDto expenseDto) {
		Expense expense = new Expense();
		expense.setAmount(expenseDto.getAmount());
		expense.setDate(new Date());
		expense.setTitle(expenseDto.getTitle());
		Users u = userRepository.findById(expenseDto.getUser().getId()).orElse(null);
		expense.setUser(u);
//		expenseRepository.save(expense);
//		List<Expense> exp= expenseRepository.findByUser(u);
//		exp.add(expense);
//		u.setExpense(exp);
		return expenseRepository.save(expense);
	}


	@Override
	public ArrayList<Expense> getAllExpense() {
		return (ArrayList<Expense>) expenseRepository.findAll();
	}
}
