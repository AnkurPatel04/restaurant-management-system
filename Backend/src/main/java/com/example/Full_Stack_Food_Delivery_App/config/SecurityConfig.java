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
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {

    private final AppUserDetailsService appUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(crfc->crfc.disable())

                .authorizeHttpRequests(auth -> auth

                        // Public APIs
                        .requestMatchers(
                                "/api/login",
                                "/api/register",
                                "/api/send-otp",
                                "/api/change-password",
                                "/api/reset-password",
                                "/api/verify-otp",
                                "/images/view/**",
                                "/api/foods/getAll",
                                "/api/foods/*",
                                "/api/foods/add",
                                "/api/payment/**",
                                "/api/coupons/**"
                        ).permitAll()
                                .requestMatchers("/api/orders/**").authenticated()

                        // Admin Only
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                        .requestMatchers("/api/tables/available").permitAll()
//
//                        .requestMatchers(HttpMethod.PUT, "/api/tables/occupy/**")
//                        .hasAnyRole("USER","ADMIN")
//
//                        // Food Management (Admin only)
//                        .requestMatchers(
//                                "/api/foods/update/**",
//                                "/api/foods/delete/**",
//                                "/api/foods/status/**")
//                        .hasRole("RESTAURANT_ADMIN")
//
//                                .requestMatchers("/api/restaurants/**").hasRole("MAIN_ADMIN")
//                                .requestMatchers("/api/admin/**").hasRole("MAIN_ADMIN")
//                        // Orders
////                        .requestMatchers("/api/orders/kitchen").hasAnyRole("ADMIN","CHEF")
////                                .requestMatchers("/api/orders/table/**")
////                                .hasAnyRole("ADMIN","USER")
////                                .requestMatchers("/api/orders").hasAnyRole("ADMIN","USER")
////                        .requestMatchers("/api/orders/**").hasAnyRole("ADMIN","USER")
////                        .requestMatchers("/api/orders/**").authenticated()
////                                .requestMatchers("/api/orders/table/**").permitAll()
//
//                        // Cart & Bookings → USER only
//                        .requestMatchers("/api/cart/**").hasAnyRole("USER","ADMIN")
//                        .requestMatchers("/api/bookings/**").hasAnyRole("USER","ADMIN")
//
//                        .requestMatchers("/ws/**").permitAll()
//
//                                // Orders
//                                .requestMatchers("/api/orders/kitchen")
//                                .hasAnyRole("ADMIN","CHEF")
//
//                                .requestMatchers("/api/orders/**")
//                                .hasAnyRole("ADMIN","USER")
//
//                                // Everything else
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
    public CorsFilter corsFilter(){
        return new CorsFilter(corsConfigurationSource());
    }

    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173","http://localhost:5174","http://10.27.245.203:5173","http://192.168.1.68:5173","https://dhruvil-restaurant-system.netlify.app/","https://restaurant-ordering-system-phi.vercel.app/"));
        configuration.setAllowedMethods(List.of("GET","POST","DELETE","PUT","OPTIONS","PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization","Content-Type"));
        configuration.setAllowCredentials(true );

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**",configuration);
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
