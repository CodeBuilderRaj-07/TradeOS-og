CREATE TABLE broker_commands (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    broker VARCHAR(50) NOT NULL,
    ticket VARCHAR(255) DEFAULT NULL,
    command VARCHAR(50) NOT NULL,
    params TEXT DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message TEXT DEFAULT NULL,
    created_at DATETIME NOT NULL,
    executed_at DATETIME DEFAULT NULL
);
