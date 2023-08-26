package com.cherry.finance.repository;

import com.cherry.finance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUserId(UUID userId);
    List<User> findAllByEnabledIsTrue();
}