package com.example.expensetracker.dtos;

import java.util.HashSet;
import java.util.Set;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UsersDto {
	@NotBlank(message="Name IS Required")
	@Pattern(regexp="^[a-zA-Z\\s]+$",message="Name Can Only Contain Letter And Spaces")
	private String name;
	@NotBlank(message="Email Is Required")
	@Email(message="Invalid Email Format")
	private String email;
	@NotBlank(message="Password Is Required")
	@Pattern(regexp="^\\d{8}$",message="Password Must Be OF Exactly Eight Digits")
	private String password;
	private Set<String> roles = new HashSet<>();
}
