package com.cherry.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {
    private UUID transactionId;
    private String transactionDate;
    private String comment;
    private float amountPaid;
    private float balance;
}
