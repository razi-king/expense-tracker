package com.example.expensetracker.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
public class Response {
	@Schema(
		description ="Status Of The API Call",
		type = "boolean",
		example = "true"
	)
	private Boolean success;
	@Schema(
	description="Any Object Or List Of Object Returned On Successful API Calls",
	example = "{....}"
	)
	private Object data;
	@Schema(
		description="API Response Message",
		type="string",
		example="Operation Successful"
	)
	private String message;
	
	
	  public void fail() {
	        this.setSuccess(Boolean.FALSE);
	    }

	    public void succeed() {
	        this.setSuccess(Boolean.TRUE);
	    }
}
