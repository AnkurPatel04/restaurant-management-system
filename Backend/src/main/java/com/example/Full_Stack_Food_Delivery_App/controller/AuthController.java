package com.example.Full_Stack_Food_Delivery_App.controller;

import com.example.Full_Stack_Food_Delivery_App.entity.UserEntity;
import com.example.Full_Stack_Food_Delivery_App.io.*;
import com.example.Full_Stack_Food_Delivery_App.repository.UserRepository;
import com.example.Full_Stack_Food_Delivery_App.service.AppUserDetailsService;
import com.example.Full_Stack_Food_Delivery_App.service.EmailService;
import com.example.Full_Stack_Food_Delivery_App.service.EmailServiceImpl;
import com.example.Full_Stack_Food_Delivery_App.util.JwtUtil;
import com.example.Full_Stack_Food_Delivery_App.util.OtpUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class AuthController {



    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final AppUserDetailsService appUserDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;



    @PostMapping("/login")
    public AuthenticationResponse login(@RequestBody AuthenticationRequest request){

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }


        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = appUserDetailsService.loadUserByUsername(user.getEmail());
        final String jwtToken = jwtUtil.generateToken(userDetails);
        return AuthenticationResponse.builder()
                .userId(user.getId())     // ✅ SEND MONGO _id
                .email(user.getEmail())
                .token(jwtToken)
                .restaurantId(user.getRestaurantId())
                .role(user.getRole().name())
                .build();

    }

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {


        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not registered. Please sign up first."
                ));
        String otp = OtpUtil.generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendOtp(user.getEmail(), otp);

        return ResponseEntity.ok("OTP sent to email");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthenticationResponse> verifyOtp(
            @RequestBody OtpVerifyRequest request) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate OTP
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        // Check expiry
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        // Clear OTP after successful verification
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        // Load user details & generate JWT
        UserDetails userDetails =
                appUserDetailsService.loadUserByUsername(user.getEmail());

        String jwtToken = jwtUtil.generateToken(userDetails);

//        return new AuthenticationResponse(request.getEmail(),jwtToken,"USER");


        return ResponseEntity.ok(
                AuthenticationResponse.builder()
                        .email(user.getEmail())
                        .token(jwtToken)
                        .role(user.getRole().name())
                        .build()
        );
    }


    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // check current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Current password is incorrect");
        }

        // update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // check OTP
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid OTP");
        }

        // check OTP expiry
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("OTP expired");
        }

        // update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // clear OTP after use
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok("Password reset successful");
    }
}
