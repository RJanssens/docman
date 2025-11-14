package com.docman.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @GetMapping("/user")
    public ResponseEntity<UserInfo> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            return ResponseEntity.status(401).build();
        }

        UserInfo userInfo = new UserInfo();
        userInfo.setId(jwt.getSubject());
        userInfo.setUsername(jwt.getClaimAsString("preferred_username"));
        userInfo.setEmail(jwt.getClaimAsString("email"));
        userInfo.setName(jwt.getClaimAsString("name"));

        return ResponseEntity.ok(userInfo);
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String username;
        private String email;
        private String name;
    }
}
