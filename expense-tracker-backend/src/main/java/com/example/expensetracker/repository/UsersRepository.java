package com.example.expensetracker.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.expensetracker.entity.Users;

public interface UsersRepository extends CrudRepository<Users, Integer> {

	Users findByName(String username);

}
