package com.TradeOS.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "broker_commands")
public class BrokerCommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountId;
    private String broker;
    private String ticket;
    private String command;     // CLOSE, MODIFY_SL, MODIFY_TP, MOVE_BE, PLACE_ORDER
    private String params;      // JSON string with command-specific params (SL, TP, symbol, type, volume, etc.)
    private String status;      // PENDING, EXECUTING, DONE, FAILED
    private String errorMessage;
    private LocalDateTime createdAt;
    private LocalDateTime executedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountId() { return accountId; }
    public void setAccountId(String accountId) { this.accountId = accountId; }

    public String getBroker() { return broker; }
    public void setBroker(String broker) { this.broker = broker; }

    public String getTicket() { return ticket; }
    public void setTicket(String ticket) { this.ticket = ticket; }

    public String getCommand() { return command; }
    public void setCommand(String command) { this.command = command; }

    public String getParams() { return params; }
    public void setParams(String params) { this.params = params; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getExecutedAt() { return executedAt; }
    public void setExecutedAt(LocalDateTime executedAt) { this.executedAt = executedAt; }
}
