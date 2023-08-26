package com.cherry.finance.service;

import com.cherry.finance.dto.TransactionResponseDTO;
import com.cherry.finance.helper.DateFormatHelper;
import com.cherry.finance.model.Transaction;
import com.cherry.finance.model.User;
import com.cherry.finance.repository.TransactionRepository;
import com.cherry.finance.repository.UserRepository;
import com.cherry.finance.settings.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository, UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Transaction createTransaction(Transaction transaction) {
        String userComment = transaction.getComment().equalsIgnoreCase("")
                ? "Payment Received" : transaction.getComment();

        User user = userRepository.findByUserId(transaction.getUser().getUserId());
        float  balance = user.getBalance() - transaction.getAmountPaid();
        float interest = user.getInterest() + transaction.getAmountPaid() * Constants.INTEREST_RATE;
        boolean enabled = balance > 0;

        user.setBalance(balance);
        user.setInterest(interest);
        user.setEnabled(enabled);

        transaction.setTransactionDate(LocalDateTime.now().format(DateFormatHelper.DATE_TIME_FORMATTER));
        transaction.setAmountPaid(transaction.getAmountPaid());
        transaction.setBalance(balance);
        transaction.setUser(user);
        transaction.setComment(userComment);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByUserId(UUID userId) {
        return transactionRepository.findByUserUserId(userId);
    }

    public List<TransactionResponseDTO> getTransactionDTOsByUserId(UUID userId) {
        List<Transaction> transactions = transactionRepository.findByUserUserId(userId);

        // Map transactions to TransactionResponseDTO
        return transactions.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper method to map Transaction to TransactionResponseDTO
    private TransactionResponseDTO mapToDTO(Transaction transaction) {
        return new TransactionResponseDTO(
                transaction.getTransactionId(),
                transaction.getTransactionDate(),
                transaction.getComment(),
                transaction.getAmountPaid(),
                transaction.getBalance()
        );
    }

    public Optional<Transaction> getTransactionById(UUID transactionId) {
        return transactionRepository.findById(transactionId);
    }

    public void deleteTransactionById(UUID transactionId) {
        transactionRepository.deleteById(transactionId);
    }
}


