package com.example.expensetracker.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import jakarta.validation.constraints.*;

public final class ExpenseDtos {
	private ExpenseDtos() {
	}

	public record ExpenseRequest(
			@NotBlank(message = "Title is required")
			@Size(max = 60, message = "Title must be at most 60 characters")
			String title,

			@NotNull(message = "Amount is required")
			@DecimalMin(value = "0.01", message = "Amount must be greater than zero")
			@Digits(integer = 10, fraction = 2, message = "Amount can have at most 2 decimal places")
			BigDecimal amount,

			@NotNull(message = "Category is required")
			Category category,

			@NotNull(message = "Date is required")
			@PastOrPresent(message = "Date cannot be in the future")
			LocalDate date,

			@Size(max = 200, message = "Note must be at most 200 characters")
			String note) {
	}

	public record ExpenseResponse(Long id, String title, BigDecimal amount, Category category, LocalDate date, String note) {
		static ExpenseResponse of(Expense e) {
			return new ExpenseResponse(e.getId(), e.getTitle(), e.getAmount(), e.getCategory(), e.getSpentOn(), e.getNote());
		}
	}

	public record CategoryTotal(Category category, BigDecimal total) {
	}

	public record MonthTotal(String month, BigDecimal total) {
	}

	/** Dashboard data for one month, plus the trend for the six months up to it. */
	public record Summary(String month, BigDecimal total, int count, BigDecimal dailyAverage, CategoryTotal topCategory,
			List<CategoryTotal> byCategory, List<MonthTotal> lastSixMonths) {
	}
}
