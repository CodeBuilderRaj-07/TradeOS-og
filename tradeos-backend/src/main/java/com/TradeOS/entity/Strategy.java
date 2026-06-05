package com.TradeOS.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "strategies")
public class Strategy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String type;

    private double winRate;

    private String status;

    private String userEmail;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String rules;

    @Column(columnDefinition = "TEXT")
    private String checklist;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getWinRate() {
        return winRate;
    }

    public void setWinRate(double winRate) {
        this.winRate = winRate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }

    public String getChecklist() { return checklist; }
    public void setChecklist(String checklist) { this.checklist = checklist; }
}
