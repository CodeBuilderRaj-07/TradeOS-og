CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'TRADER',
    reset_token VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS trades (
    id BIGSERIAL PRIMARY KEY,
    symbol VARCHAR(50) NOT NULL,
    trade_type VARCHAR(10) NOT NULL,
    entry_price DOUBLE PRECISION NOT NULL,
    exit_price DOUBLE PRECISION DEFAULT 0,
    stop_loss DOUBLE PRECISION NOT NULL,
    take_profit DOUBLE PRECISION NOT NULL,
    position_size DOUBLE PRECISION NOT NULL,
    pnl DOUBLE PRECISION DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN',
    notes TEXT,
    risk_pct DOUBLE PRECISION DEFAULT 0,
    session VARCHAR(50),
    strategy VARCHAR(255),
    timeframe VARCHAR(50),
    confidence VARCHAR(50),
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS strategies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    win_rate DOUBLE PRECISION DEFAULT 0,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    user_email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS journals (
    id BIGSERIAL PRIMARY KEY,
    user_email VARCHAR(255),
    symbol VARCHAR(50),
    emotion VARCHAR(255),
    strategy VARCHAR(255),
    notes VARCHAR(3000),
    pnl DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trading_accounts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    broker VARCHAR(255),
    type VARCHAR(50),
    api_key VARCHAR(512),
    api_secret VARCHAR(512),
    currency VARCHAR(10) DEFAULT 'USD',
    leverage VARCHAR(50),
    initial_balance DOUBLE PRECISION DEFAULT 0,
    current_balance DOUBLE PRECISION DEFAULT 0,
    max_daily_loss DOUBLE PRECISION DEFAULT 0,
    max_trades_per_day INT DEFAULT 0,
    default_risk DOUBLE PRECISION DEFAULT 1,
    active BOOLEAN DEFAULT false,
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS algo_strategies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    symbol VARCHAR(50),
    trade_direction VARCHAR(10),
    entry_trigger VARCHAR(50),
    entry_value DOUBLE PRECISION DEFAULT 0,
    stop_loss DOUBLE PRECISION DEFAULT 0,
    take_profit DOUBLE PRECISION DEFAULT 0,
    position_size DOUBLE PRECISION DEFAULT 0,
    max_active_trades INT DEFAULT 1,
    max_daily_loss DOUBLE PRECISION DEFAULT 0,
    active BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'STOPPED',
    trading_account_id BIGINT,
    user_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS algo_executions (
    id BIGSERIAL PRIMARY KEY,
    algo_strategy_id BIGINT,
    trade_id BIGINT,
    symbol VARCHAR(50),
    trade_direction VARCHAR(10),
    entry_price DOUBLE PRECISION DEFAULT 0,
    exit_price DOUBLE PRECISION DEFAULT 0,
    position_size DOUBLE PRECISION DEFAULT 0,
    pnl DOUBLE PRECISION DEFAULT 0,
    status VARCHAR(50) DEFAULT 'OPEN',
    trigger_reason VARCHAR(255),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    user_email VARCHAR(255)
);
