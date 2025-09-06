package com.example.expensetracker.dtos;

import java.util.Date;

import com.example.expensetracker.entity.Users;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ExpenseDto {
	@NotBlank(message="Title Is Required")
	@Pattern(regexp="^[a-zA-Z\\s]+$",message="Title Can Only Contain Letter And Spaces")
	@Size(min=2,max=40,message="Title Length Must Be Greater Equal Than Two And Less Than Equal To Hundred")
	private String title;
	@NotNull(message="Amount Is Required")
	@Positive(message = "Amount must be greater than zero")
	@Digits(integer=10,fraction=2,message="Amount Must Be A Valid Currency")
	private double amount;
	@Valid
	@NotNull(message="User Is Required")
	private Users user;
	
}
