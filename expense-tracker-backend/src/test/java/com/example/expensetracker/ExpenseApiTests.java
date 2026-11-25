package com.example.expensetracker;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/** End-to-end API tests against a real database (Postgres in CI). */
@SpringBootTest
@AutoConfigureMockMvc
class ExpenseApiTests {
	@Autowired
	MockMvc mvc;
	@Autowired
	ObjectMapper json;

	private String register(String name) throws Exception {
		String body = """
				{"name":"%s","email":"%s@example.com","password":"s3cret-pass"}""".formatted(name, name);
		String res = mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.user.name").value(name))
				.andExpect(jsonPath("$.user.password").doesNotExist())
				.andReturn().getResponse().getContentAsString();
		return json.readTree(res).get("token").asText();
	}

	private static String uniq() {
		return "u" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
	}

	private String expense(String title, String amount, String category, LocalDate date) {
		return """
				{"title":"%s","amount":%s,"category":"%s","date":"%s","note":"test"}""".formatted(title, amount, category, date);
	}

	@Test
	void protectedEndpointsNeedAToken() throws Exception {
		mvc.perform(get("/api/expenses")).andExpect(status().isUnauthorized());
		mvc.perform(get("/api/expenses").header("Authorization", "Bearer not-a-jwt")).andExpect(status().isUnauthorized());
	}

	@Test
	void registerRejectsDuplicatesAndIgnoresRoles() throws Exception {
		String name = uniq();
		register(name);
		mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content("""
				{"name":"%s","email":"other-%s@example.com","password":"s3cret-pass","roles":["ADMIN"]}""".formatted(name, name)))
				.andExpect(status().isConflict());
	}

	@Test
	void loginWorksAndWrongPasswordIs401() throws Exception {
		String name = uniq();
		register(name);
		mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"%s\",\"password\":\"s3cret-pass\"}".formatted(name)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.token", not(emptyString())));
		mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"%s\",\"password\":\"wrong-pass\"}".formatted(name)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void validationErrorsListEachField() throws Exception {
		String token = register(uniq());
		mvc.perform(post("/api/expenses").header("Authorization", "Bearer " + token)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"title\":\"\",\"amount\":-5,\"category\":\"FOOD\",\"date\":\"2999-01-01\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.fields.title").exists())
				.andExpect(jsonPath("$.fields.amount").exists())
				.andExpect(jsonPath("$.fields.date").exists());
	}

	@Test
	void fullCrudAndSummary() throws Exception {
		String token = register(uniq());
		String auth = "Bearer " + token;
		LocalDate today = LocalDate.now();
		String month = YearMonth.from(today).toString();

		String created = mvc.perform(post("/api/expenses").header("Authorization", auth)
				.contentType(MediaType.APPLICATION_JSON).content(expense("Groceries", "1200.50", "FOOD", today)))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		long id = json.readTree(created).get("id").asLong();
		mvc.perform(post("/api/expenses").header("Authorization", auth)
				.contentType(MediaType.APPLICATION_JSON).content(expense("Metro card", "300", "TRANSPORT", today)))
				.andExpect(status().isCreated());

		mvc.perform(get("/api/expenses").param("month", month).header("Authorization", auth))
				.andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(2)));
		mvc.perform(get("/api/expenses").param("month", month).param("category", "FOOD").header("Authorization", auth))
				.andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].title").value("Groceries"));

		mvc.perform(put("/api/expenses/" + id).header("Authorization", auth)
				.contentType(MediaType.APPLICATION_JSON).content(expense("Groceries", "1500", "FOOD", today)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(1500));

		JsonNode summary = json.readTree(mvc.perform(get("/api/expenses/summary").param("month", month)
				.header("Authorization", auth)).andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
		org.junit.jupiter.api.Assertions.assertEquals(0, summary.get("total").decimalValue().compareTo(new java.math.BigDecimal("1800")));
		org.junit.jupiter.api.Assertions.assertEquals("FOOD", summary.get("topCategory").get("category").asText());
		org.junit.jupiter.api.Assertions.assertEquals(6, summary.get("lastSixMonths").size());

		mvc.perform(delete("/api/expenses/" + id).header("Authorization", auth)).andExpect(status().isNoContent());
		mvc.perform(get("/api/expenses").param("month", month).header("Authorization", auth))
				.andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	void usersCannotTouchEachOthersExpenses() throws Exception {
		String alice = "Bearer " + register(uniq());
		String bob = "Bearer " + register(uniq());
		String created = mvc.perform(post("/api/expenses").header("Authorization", alice)
				.contentType(MediaType.APPLICATION_JSON).content(expense("Rent", "15000", "BILLS", LocalDate.now())))
				.andReturn().getResponse().getContentAsString();
		long id = json.readTree(created).get("id").asLong();

		mvc.perform(get("/api/expenses").header("Authorization", bob)).andExpect(jsonPath("$", hasSize(0)));
		mvc.perform(put("/api/expenses/" + id).header("Authorization", bob).contentType(MediaType.APPLICATION_JSON)
				.content(expense("Hacked", "1", "OTHER", LocalDate.now()))).andExpect(status().isNotFound());
		mvc.perform(delete("/api/expenses/" + id).header("Authorization", bob)).andExpect(status().isNotFound());
	}
}
