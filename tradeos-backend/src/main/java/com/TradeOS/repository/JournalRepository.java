package com.TradeOS.repository;

import com.TradeOS.entity.Journal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JournalRepository
        extends JpaRepository<Journal, Long> {

    List<Journal> findByUserEmailOrderByCreatedAtDesc(
            String userEmail
    );
}