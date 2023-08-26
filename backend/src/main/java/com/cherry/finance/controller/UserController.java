package com.cherry.finance.controller;

import com.cherry.finance.model.User;
import com.cherry.finance.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {
    HttpHeaders headers = new HttpHeaders();

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
        headers.set("Allow-Origin", "*");
    }

    @GetMapping("/healthCheck")
    public ResponseEntity<String> healthCheck() {
        return new ResponseEntity<>("Server up and running", headers, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), headers, HttpStatus.OK);
    }

    @GetMapping("/enabled")
    public ResponseEntity<List<User>> getAllEnabledUsers() {
        return new ResponseEntity<>(userService.getAllEnabledUsers(), headers, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserByUserId(@PathVariable UUID userId) {
        return new ResponseEntity<>(userService.getUserByUserId(userId), headers, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return new ResponseEntity<>(userService.createUser(user), headers, HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUserAndTransactions(@PathVariable UUID userId) {
        userService.deleteUserAndTransactions(userId);
        return ResponseEntity.ok("User and associated transactions deleted successfully.");
    }
}
