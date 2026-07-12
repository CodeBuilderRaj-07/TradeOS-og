package com.TradeOS.service;

import com.TradeOS.entity.BrokerCommand;
import com.TradeOS.entity.Trade;
import com.TradeOS.repository.BrokerCommandRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BrokerCommandService {

    private static final Logger log = LoggerFactory.getLogger(BrokerCommandService.class);

    @Autowired
    private BrokerCommandRepository repository;

    public List<BrokerCommand> getPendingCommands(String accountId) {
        return repository.findByAccountIdAndStatusOrderByCreatedAtAsc(accountId, "PENDING");
    }

    public void acknowledge(Long commandId, String status, String errorMessage) {
        BrokerCommand cmd = repository.findById(commandId).orElse(null);
        if (cmd == null) {
            log.warn("Command {} not found for ack", commandId);
            return;
        }
        cmd.setStatus(status);
        cmd.setExecutedAt(LocalDateTime.now());
        if (errorMessage != null) cmd.setErrorMessage(errorMessage);
        repository.save(cmd);
        log.info("Command {} acked as {}", commandId, status);
    }

    public BrokerCommand createCloseCommand(Trade trade, String broker, String accountId) {
        BrokerCommand cmd = new BrokerCommand();
        cmd.setAccountId(accountId);
        cmd.setBroker(broker);
        cmd.setTicket(trade.getMt5Ticket());
        cmd.setCommand("CLOSE");
        cmd.setParams("{}");
        cmd.setStatus("PENDING");
        cmd.setCreatedAt(LocalDateTime.now());
        repository.save(cmd);
        log.info("Created CLOSE command {} for trade {} (ticket={})", cmd.getId(), trade.getId(), trade.getMt5Ticket());
        return cmd;
    }

    public BrokerCommand createSlTpCommand(Trade trade, Double sl, Double tp, String broker, String accountId) {
        BrokerCommand cmd = new BrokerCommand();
        cmd.setAccountId(accountId);
        cmd.setBroker(broker);
        cmd.setTicket(trade.getMt5Ticket());
        cmd.setCommand(sl != null && tp != null ? "MODIFY_SL_TP" : sl != null ? "MODIFY_SL" : "MODIFY_TP");
        String params = "{";
        if (sl != null) params += "\"sl\":" + sl;
        if (sl != null && tp != null) params += ",";
        if (tp != null) params += "\"tp\":" + tp;
        params += "}";
        cmd.setParams(params);
        cmd.setStatus("PENDING");
        cmd.setCreatedAt(LocalDateTime.now());
        repository.save(cmd);
        log.info("Created {} command {} for trade {} (ticket={})", cmd.getCommand(), cmd.getId(), trade.getId(), trade.getMt5Ticket());
        return cmd;
    }

    public BrokerCommand createMoveToBeCommand(Trade trade, String broker, String accountId) {
        BrokerCommand cmd = new BrokerCommand();
        cmd.setAccountId(accountId);
        cmd.setBroker(broker);
        cmd.setTicket(trade.getMt5Ticket());
        cmd.setCommand("MOVE_BE");
        cmd.setParams("{\"sl\":" + trade.getEntryPrice() + "}");
        cmd.setStatus("PENDING");
        cmd.setCreatedAt(LocalDateTime.now());
        repository.save(cmd);
        log.info("Created MOVE_BE command {} for trade {} (ticket={})", cmd.getId(), trade.getId(), trade.getMt5Ticket());
        return cmd;
    }

    public BrokerCommand createPlaceOrderCommand(Trade trade, String broker, String accountId) {
        BrokerCommand cmd = new BrokerCommand();
        cmd.setAccountId(accountId);
        cmd.setBroker(broker);
        cmd.setTicket(trade.getMt5Ticket());
        cmd.setCommand("PLACE_ORDER");
        cmd.setParams(String.format(
            "{\"symbol\":\"%s\",\"type\":\"%s\",\"volume\":%s,\"price\":%s,\"sl\":%s,\"tp\":%s}",
            trade.getSymbol(), trade.getTradeType(), trade.getPositionSize(),
            trade.getEntryPrice(), trade.getStopLoss(), trade.getTakeProfit()
        ));
        cmd.setStatus("PENDING");
        cmd.setCreatedAt(LocalDateTime.now());
        repository.save(cmd);
        log.info("Created PLACE_ORDER command {} for trade {} (ticket={})", cmd.getId(), trade.getId(), trade.getMt5Ticket());
        return cmd;
    }
}
