package com.example.expensetracker.config;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.expensetracker.service.CustomUserDetailsService;
import com.example.expensetracker.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
	@Autowired
	JwtService jwtService;
	@Autowired
	CustomUserDetailsService customUserDetailsService;
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");
		
		if(authHeader==null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
		}
//		 String path = request.getServletPath();
//
//		    // Skip JWT validation for public endpoints
//		    if (path.equals("/users/login") || path.equals("/users/register")) {
//		        filterChain.doFilter(request, response);
//		        return;
//		    }
		String jwt = authHeader.substring(7) ;
		String username = jwtService.extractUsername(jwt);
		Authentication currentAuth = SecurityContextHolder.getContext().getAuthentication();
		
		if(username!=null && currentAuth== null) {
			UserDetails userDetails = customUserDetailsService
										.loadUserByUsername(username);
			if(jwtService.isTokenValid(jwt,userDetails)) {
				Set<String> rolesFromJwt = jwtService.extractRoles(jwt);
				var authorities = rolesFromJwt!=null && !rolesFromJwt.isEmpty()
									? rolesFromJwt.stream()
												  .map(r-> r.startsWith("ROLE_") ? r:"ROLE_"+r)
												  .map(SimpleGrantedAuthority::new)
												  .collect(Collectors.toSet())
												  :userDetails.getAuthorities();
				UsernamePasswordAuthenticationToken authenticationToken = 
						new UsernamePasswordAuthenticationToken(
								userDetails,
								null,
								authorities
								);
				authenticationToken.setDetails(
						new WebAuthenticationDetailsSource().buildDetails(request)
						);
				SecurityContextHolder.getContext().setAuthentication(authenticationToken);
			}
		}
		filterChain.doFilter(request, response);
	}

}
