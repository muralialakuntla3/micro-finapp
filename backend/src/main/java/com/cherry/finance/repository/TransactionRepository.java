package com.cherry.finance.repository;

import com.cherry.finance.model.Transaction;
import com.cherry.finance.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    // You can add custom query methods here if needed
    void deleteByUser(User user);
    List<Transaction> findByUserUserId(UUID userId);
}
