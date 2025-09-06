package com.example.expensetracker.service;

import java.util.ArrayList;

import com.example.expensetracker.dtos.ExpenseDto;
import com.example.expensetracker.entity.Expense;

public interface ExpenseService {
	Expense addExpense(ExpenseDto expenseDto);

	ArrayList<Expense> getAllExpense();
}
