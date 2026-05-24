package com.TradeOS.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "journals")
public class Journal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userEmail;

    private String symbol;

    private String emotion;

    private String strategy;

    @Column(length = 3000)
    private String notes;

    private Double pnl;

    private LocalDateTime createdAt;

    public Journal() {

        this.createdAt =
                LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(
            String userEmail
    ) {
        this.userEmail = userEmail;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(
            String symbol
    ) {
        this.symbol = symbol;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(
            String emotion
    ) {
        this.emotion = emotion;
    }

    public String getStrategy() {
        return strategy;
    }

    public void setStrategy(
            String strategy
    ) {
        this.strategy = strategy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(
            String notes
    ) {
        this.notes = notes;
    }

    public Double getPnl() {
        return pnl;
    }

    public void setPnl(
            Double pnl
    ) {
        this.pnl = pnl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}