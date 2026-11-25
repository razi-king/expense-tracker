package com.example.expensetracker.auth;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByName(String name);

	boolean existsByNameIgnoreCase(String name);

	boolean existsByEmailIgnoreCase(String email);
}
