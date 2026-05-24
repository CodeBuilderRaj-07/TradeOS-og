package com.TradeOS.service;

import com.TradeOS.entity.Journal;
import com.TradeOS.repository.JournalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {

    @Autowired
    private JournalRepository journalRepository;

    public Journal createJournal(
            Journal journal,
            String email
    ) {

        journal.setUserEmail(email);

        return journalRepository.save(journal);
    }

    public List<Journal> getUserJournals(
            String email
    ) {

        return journalRepository
                .findByUserEmailOrderByCreatedAtDesc(
                        email
                );
    }
}