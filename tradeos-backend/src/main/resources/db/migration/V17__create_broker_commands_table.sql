CREATE TABLE broker_commands (
    id BIGSERIAL PRIMARY KEY,
    account_id VARCHAR(255) NOT NULL,
    broker VARCHAR(50) NOT NULL,
    ticket VARCHAR(255) DEFAULT NULL,
    command VARCHAR(50) NOT NULL,
    params TEXT DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    error_message TEXT DEFAULT NULL,
    created_at TIMESTAMP NOT NULL,
    executed_at TIMESTAMP DEFAULT NULL
);
