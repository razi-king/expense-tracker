package com.example.expensetracker.expense;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

import com.example.expensetracker.auth.User;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "expenses", indexes = @Index(name = "idx_expenses_user_date", columnList = "user_id, spent_on"))
@Getter
@Setter
@NoArgsConstructor
public class Expense {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 60)
	private String title;

	/** BigDecimal, not double: money must not pick up floating-point rounding errors. */
	@Column(nullable = false, precision = 12, scale = 2)
	private BigDecimal amount;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private Category category;

	@Column(name = "spent_on", nullable = false)
	private LocalDate spentOn;

	@Column(length = 200)
	private String note;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	@Column(nullable = false, updatable = false)
	private Instant createdAt = Instant.now();
}
