package com.example.expensetracker.common;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import lombok.extern.slf4j.Slf4j;

/** One error shape for the whole API: {status, error, message, fields?}. */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

	public record ApiError(int status, String error, String message, Map<String, String> fields) {
	}

	private static ResponseEntity<ApiError> of(HttpStatus s, String code, String msg, Map<String, String> fields) {
		return ResponseEntity.status(s).body(new ApiError(s.value(), code, msg, fields));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex) {
		Map<String, String> fields = new LinkedHashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(f -> fields.putIfAbsent(f.getField(), f.getDefaultMessage()));
		return of(HttpStatus.BAD_REQUEST, "validation_failed", "Please fix the highlighted fields.", fields);
	}

	@ExceptionHandler({ HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class })
	ResponseEntity<ApiError> badRequest(Exception ex) {
		return of(HttpStatus.BAD_REQUEST, "bad_request", "The request could not be read. Check the values you sent.", null);
	}

	@ExceptionHandler(BadCredentialsException.class)
	ResponseEntity<ApiError> badCredentials() {
		return of(HttpStatus.UNAUTHORIZED, "invalid_credentials", "Wrong username or password.", null);
	}

	@ExceptionHandler(UnauthorizedException.class)
	ResponseEntity<ApiError> unauthorized(UnauthorizedException ex) {
		return of(HttpStatus.UNAUTHORIZED, "unauthorized", ex.getMessage(), null);
	}

	@ExceptionHandler(NotFoundException.class)
	ResponseEntity<ApiError> notFound(NotFoundException ex) {
		return of(HttpStatus.NOT_FOUND, "not_found", ex.getMessage(), null);
	}

	@ExceptionHandler(ConflictException.class)
	ResponseEntity<ApiError> conflict(ConflictException ex) {
		return of(HttpStatus.CONFLICT, "conflict", ex.getMessage(), null);
	}

	@ExceptionHandler(NoResourceFoundException.class)
	ResponseEntity<ApiError> noRoute() {
		return of(HttpStatus.NOT_FOUND, "not_found", "No such endpoint.", null);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	ResponseEntity<ApiError> wrongMethod() {
		return of(HttpStatus.METHOD_NOT_ALLOWED, "method_not_allowed", "That HTTP method is not supported here.", null);
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<ApiError> unexpected(Exception ex) {
		log.error("Unhandled error", ex);
		return of(HttpStatus.INTERNAL_SERVER_ERROR, "internal", "Something went wrong. Please try again.", null);
	}
}
