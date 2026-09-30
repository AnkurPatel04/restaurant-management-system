package com.example.Full_Stack_Food_Delivery_App.config;


import com.example.Full_Stack_Food_Delivery_App.filter.JwtAuthenticationFilter;
import com.example.Full_Stack_Food_Delivery_App.service.AppUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService appUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)

                .authorizeHttpRequests(auth -> auth
                        // 1. Allow all CORS pre-flight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Public Authentication & Account Recovery & Error Handling
                        .requestMatchers(
                                "/error",
                                "/api/login",
                                "/api/register",
                                "/api/send-otp",
                                "/api/verify-otp",
                                "/api/reset-password",
                                "/api/change-password"
                        ).permitAll()

                        // 3. WebSockets (STOMP connection endpoint)
                        .requestMatchers("/ws/**").permitAll()

                        // 4. Public Browsing (Menu items, restaurants, public images)
                        .requestMatchers(HttpMethod.GET, "/api/restaurants/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/foods/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/images/**").permitAll()

                        // 5. Public Table Availability & Payment
                        .requestMatchers(HttpMethod.GET, "/api/tables/available/**").permitAll()
                        .requestMatchers("/api/payment/**").permitAll()

                        // 6. Main Admin Endpoints (Multi-tenant restaurant onboarding)
                        .requestMatchers("/api/main-admin/**").hasRole("MAIN_ADMIN")

                        // 7. Restaurant Admin - Staff Management
                        .requestMatchers("/api/admin/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // 8. Food & Menu Management (Admin Only)
                        .requestMatchers(HttpMethod.POST, "/api/foods/add").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/foods/update/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/foods/delete/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/foods/status/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.POST, "/images/upload").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // 9. Coupon Management (Admin Only)
                        .requestMatchers(HttpMethod.POST, "/api/coupons/create").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/coupons/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/coupons/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // 10. Coupon Usage (Public list, Authenticated apply)
                        .requestMatchers(HttpMethod.GET, "/api/coupons/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/coupons/apply").authenticated()

                        // 11. Table Structure Configuration (Admin Only)
                        .requestMatchers(HttpMethod.POST, "/api/tables").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/tables/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // 12. Table Occupancy (Dine-in customers, Waiters, Admins)
                        .requestMatchers(HttpMethod.PUT, "/api/tables/*/occupy/**", "/api/tables/**/occupy/**")
                        .hasAnyRole("USER", "WAITER", "CASHIER", "RESTAURANT_ADMIN", "ADMIN")

                        // Table Update (Capacity / specs - Admin Only)
                        .requestMatchers(HttpMethod.PUT, "/api/tables/**").hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // Table List for Restaurant (Admin, Waiter, Cashier)
                        .requestMatchers(HttpMethod.GET, "/api/tables/**")
                        .hasAnyRole("RESTAURANT_ADMIN", "ADMIN", "WAITER", "CASHIER")

                        // 13. Kitchen Display System (KDS - Chefs, Admins)
                        .requestMatchers(HttpMethod.GET, "/api/orders/kitchen/**")
                        .hasAnyRole("CHEF", "RESTAURANT_ADMIN", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/orders/*/status")
                        .hasAnyRole("CHEF", "WAITER", "RESTAURANT_ADMIN", "ADMIN")

                        // 14. Booking Analytics & Admin Reports
                        .requestMatchers(HttpMethod.GET, "/api/bookings/all", "/api/bookings/date/**")
                        .hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // 15. Customer Table Bookings
                        .requestMatchers("/api/bookings/**").authenticated()

                        // 16. Shopping Cart
                        .requestMatchers("/api/cart/**").hasAnyRole("USER", "RESTAURANT_ADMIN", "ADMIN")

                        // 17. Orders Management
                        // Restaurant-wide order monitoring & cancellation
                        .requestMatchers(HttpMethod.GET, "/api/orders/restaurant/**")
                        .hasAnyRole("RESTAURANT_ADMIN", "ADMIN", "CASHIER", "WAITER")
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**")
                        .hasAnyRole("RESTAURANT_ADMIN", "ADMIN")

                        // Customer & Table Orders (Placing orders, bill payment, view order, invoice)
                        .requestMatchers("/api/orders/**").authenticated()

                        // 18. All other requests require authentication
                        .anyRequest().authenticated()
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "DELETE", "PUT", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*", "Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(){
        DaoAuthenticationProvider authprovider = new DaoAuthenticationProvider();
        authprovider.setUserDetailsService(appUserDetailsService);
        authprovider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authprovider);

    }
}
