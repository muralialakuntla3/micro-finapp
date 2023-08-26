package com.cherry.finance.service;

import com.cherry.finance.helper.DateFormatHelper;
import com.cherry.finance.model.Transaction;
import com.cherry.finance.model.User;
import com.cherry.finance.repository.TransactionRepository;
import com.cherry.finance.repository.UserRepository;
import com.cherry.finance.settings.Constants;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.format.datetime.DateFormatter;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

import static com.cherry.finance.helper.DateFormatHelper.DATE_TIME_FORMATTER;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TransactionRepository  transactionRepository;

    @Autowired
    public UserService(UserRepository userRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public User createUser(User user) {
        User currentUser = setUser(user);
        User savedUser = userRepository.save(currentUser);
        createInitialTransaction(savedUser);
        return savedUser;
    }

    public User getUserByUserId(UUID userId) {
        return userRepository.findByUserId(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllEnabledUsers() {
        return userRepository.findAllByEnabledIsTrue();
    }

    private User setUser(User user) {

        DateTimeFormatter formatter = DATE_TIME_FORMATTER;
        LocalDateTime nextDate = LocalDateTime.parse(user.getStartDate(), formatter).plusDays(1);
        LocalDateTime endDate = nextDate.plusDays(Constants.NUM_OF_DAYS);
        float interest = user.getBalance() * Constants.INTEREST_RATE;
        user.setStartDate(nextDate.format(formatter));
        user.setEndDate(endDate.format(formatter));
        user.setInterest(interest);
        return user;
    }

    private void createInitialTransaction(User user) {
        Transaction transaction = new Transaction();
        LocalDateTime currentDate = LocalDateTime.parse(user.getStartDate(), DATE_TIME_FORMATTER).minusDays(1);
        transaction.setUser(user);
        transaction.setTransactionDate(currentDate.format(DATE_TIME_FORMATTER));
        transaction.setComment("Initial loan amount paid " + user.getBalance());
        transaction.setAmountPaid(0);
        transaction.setBalance(user.getBalance());
        transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteUserAndTransactions(UUID userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            transactionRepository.deleteByUser(user);
            userRepository.delete(user);
        }
    }
}
