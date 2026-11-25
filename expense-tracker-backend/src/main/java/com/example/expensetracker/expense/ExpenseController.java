package com.example.expensetracker.expense;

import java.time.YearMonth;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.expensetracker.expense.ExpenseDtos.ExpenseRequest;
import com.example.expensetracker.expense.ExpenseDtos.ExpenseResponse;
import com.example.expensetracker.expense.ExpenseDtos.Summary;
import com.example.expensetracker.security.CurrentUser;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/** Every endpoint works only on the logged-in user's own expenses. */
@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {
	private final ExpenseService service;
	private final CurrentUser currentUser;

	@GetMapping
	public List<ExpenseResponse> list(@RequestParam(required = false) YearMonth month,
			@RequestParam(required = false) Category category) {
		return service.list(currentUser.get(), month != null ? month : YearMonth.now(), category);
	}

	@GetMapping("/summary")
	public Summary summary(@RequestParam(required = false) YearMonth month) {
		return service.summary(currentUser.get(), month != null ? month : YearMonth.now());
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ExpenseResponse create(@Valid @RequestBody ExpenseRequest req) {
		return service.create(currentUser.get(), req);
	}

	@PutMapping("/{id}")
	public ExpenseResponse update(@PathVariable Long id, @Valid @RequestBody ExpenseRequest req) {
		return service.update(currentUser.get(), id, req);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		service.delete(currentUser.get(), id);
	}
}
