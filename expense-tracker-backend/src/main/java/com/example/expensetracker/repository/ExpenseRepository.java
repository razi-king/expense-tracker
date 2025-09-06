package com.example.expensetracker.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.example.expensetracker.entity.Expense;
import com.example.expensetracker.entity.Users;

public interface ExpenseRepository extends CrudRepository<Expense, Integer>{
	List<Expense> findByUser(Users u);
}
