package com.example.expensetracker.common;

public class ConflictException extends RuntimeException {
	public ConflictException(String message) {
		super(message);
	}
}
