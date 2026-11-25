package com.example.expensetracker.expense;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.expensetracker.auth.User;
import com.example.expensetracker.common.NotFoundException;
import com.example.expensetracker.expense.ExpenseDtos.CategoryTotal;
import com.example.expensetracker.expense.ExpenseDtos.ExpenseRequest;
import com.example.expensetracker.expense.ExpenseDtos.ExpenseResponse;
import com.example.expensetracker.expense.ExpenseDtos.MonthTotal;
import com.example.expensetracker.expense.ExpenseDtos.Summary;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExpenseService {
	private final ExpenseRepository expenses;

	@Transactional(readOnly = true)
	public List<ExpenseResponse> list(User user, YearMonth month, Category category) {
		return expenses.search(user.getId(), month.atDay(1), month.atEndOfMonth(), category)
				.stream().map(ExpenseResponse::of).toList();
	}

	@Transactional
	public ExpenseResponse create(User user, ExpenseRequest req) {
		Expense e = new Expense();
		e.setUser(user);
		apply(e, req);
		return ExpenseResponse.of(expenses.save(e));
	}

	@Transactional
	public ExpenseResponse update(User user, Long id, ExpenseRequest req) {
		Expense e = owned(user, id);
		apply(e, req);
		return ExpenseResponse.of(e);
	}

	@Transactional
	public void delete(User user, Long id) {
		expenses.delete(owned(user, id));
	}

	@Transactional(readOnly = true)
	public Summary summary(User user, YearMonth month) {
		LocalDate from = month.atDay(1);
		LocalDate to = month.atEndOfMonth();

		List<CategoryTotal> byCategory = expenses.totalsByCategory(user.getId(), from, to).stream()
				.map(t -> new CategoryTotal(t.getCategory(), t.getTotal()))
				.toList();
		BigDecimal total = byCategory.stream().map(CategoryTotal::total).reduce(BigDecimal.ZERO, BigDecimal::add);
		int count = expenses.search(user.getId(), from, to, null).size();

		// Average over the days that have passed (the whole month for past months).
		LocalDate today = LocalDate.now();
		int days = month.equals(YearMonth.from(today)) ? today.getDayOfMonth() : month.lengthOfMonth();
		BigDecimal dailyAverage = total.divide(BigDecimal.valueOf(days), 2, RoundingMode.HALF_UP);

		// Six-month trend, zero-filled so the chart has no gaps.
		YearMonth first = month.minusMonths(5);
		Map<YearMonth, BigDecimal> trend = new LinkedHashMap<>();
		for (int i = 0; i < 6; i++) {
			trend.put(first.plusMonths(i), BigDecimal.ZERO);
		}
		for (var a : expenses.amountsBetween(user.getId(), first.atDay(1), to)) {
			trend.merge(YearMonth.from(a.getSpentOn()), a.getAmount(), BigDecimal::add);
		}
		List<MonthTotal> lastSix = new ArrayList<>();
		trend.forEach((m, t) -> lastSix.add(new MonthTotal(m.toString(), t)));

		return new Summary(month.toString(), total, count, dailyAverage,
				byCategory.isEmpty() ? null : byCategory.get(0), byCategory, lastSix);
	}

	private Expense owned(User user, Long id) {
		// Same 404 whether the expense is missing or someone else's, so ids can't be probed.
		return expenses.findByIdAndUserId(id, user.getId())
				.orElseThrow(() -> new NotFoundException("Expense not found"));
	}

	private static void apply(Expense e, ExpenseRequest req) {
		e.setTitle(req.title().trim());
		e.setAmount(req.amount());
		e.setCategory(req.category());
		e.setSpentOn(req.date());
		e.setNote(req.note() == null || req.note().isBlank() ? null : req.note().trim());
	}
}
