package com.cherry.finance.controller;

import com.cherry.finance.dto.TransactionResponseDTO;
import com.cherry.finance.model.Transaction;
import com.cherry.finance.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        HttpHeaders  headers = new HttpHeaders();
        headers.set("Allow-Origin", "*");
        return new ResponseEntity<>(transactionService.createTransaction(transaction), headers, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByUserId(@PathVariable UUID userId) {
        List<TransactionResponseDTO> transactionDTOs = transactionService.getTransactionDTOsByUserId(userId);
        return new ResponseEntity<>(transactionDTOs, HttpStatus.OK);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable UUID transactionId) {
        Optional<Transaction> transaction = transactionService.getTransactionById(transactionId);
        return transaction.map(value -> new ResponseEntity<>(value, HttpStatus.OK)).orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @DeleteMapping("/{transactionId}")
    public ResponseEntity<Void> deleteTransactionById(@PathVariable UUID transactionId) {
        transactionService.deleteTransactionById(transactionId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
