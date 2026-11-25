package com.example.expensetracker.expense;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	/** Scoped by owner, so one user can never read or change another user's expense. */
	Optional<Expense> findByIdAndUserId(Long id, Long userId);

	@Query("""
			select e from Expense e
			where e.user.id = :userId
			  and e.spentOn between :from and :to
			  and (:category is null or e.category = :category)
			order by e.spentOn desc, e.id desc
			""")
	List<Expense> search(@Param("userId") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to,
			@Param("category") Category category);

	@Query("""
			select e.category as category, sum(e.amount) as total
			from Expense e
			where e.user.id = :userId and e.spentOn between :from and :to
			group by e.category
			order by sum(e.amount) desc
			""")
	List<CategoryTotal> totalsByCategory(@Param("userId") Long userId, @Param("from") LocalDate from,
			@Param("to") LocalDate to);

	@Query("""
			select e.spentOn as spentOn, e.amount as amount
			from Expense e
			where e.user.id = :userId and e.spentOn between :from and :to
			""")
	List<DatedAmount> amountsBetween(@Param("userId") Long userId, @Param("from") LocalDate from,
			@Param("to") LocalDate to);

	interface CategoryTotal {
		Category getCategory();

		BigDecimal getTotal();
	}

	interface DatedAmount {
		LocalDate getSpentOn();

		BigDecimal getAmount();
	}
}
