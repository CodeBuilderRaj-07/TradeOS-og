---

# COVER PAGE

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotlight_icon.svg/1200px-Spotlight_icon.svg.png" alt="Project Logo" width="100"/>

<br/>

# TRADEOS

## AI-POWERED TRADING JOURNAL & ALGORITHMIC PLATFORM

<br/>

### A Project Report

*Submitted in partial fulfillment of the requirements for the award of the degree of*

<br/>

### Bachelor of Technology

in

### Computer Science & Engineering

<br/>

*Submitted by*

**Rajkumar Pattnail**

**Reg. No: 12345678**

<br/>

*Under the guidance of*

**Prof. Guide Name**

Department of Computer Science & Engineering

<br/>

---

**INSTITUTE NAME**

**Department of Computer Science & Engineering**

**City, State – PIN Code**

**Year: 2026**

---

<br/>

---

# TITLE PAGE

<br/>

## TRADEOS: AI-POWERED TRADING JOURNAL & ALGORITHMIC PLATFORM

<br/>

A Project submitted to

**INSTITUTE NAME**

in partial fulfillment of the requirements for the award of the degree of

**Bachelor of Technology**

in

**Computer Science & Engineering**

<br/>

*Submitted by*

| Name | Reg. No. |
|------|----------|
| Rajkumar Pattnail | 12345678 |

<br/>

*Under the guidance of*

**Prof. Guide Name**

Assistant Professor

Department of Computer Science & Engineering

<br/>

---

**INSTITUTE NAME**

**Department of Computer Science & Engineering**

**Year: 2026**

---

<br/>

---

# CERTIFICATE

<br/>

This is to certify that the project report entitled **"TRADEOS: AI-POWERED TRADING JOURNAL & ALGORITHMIC PLATFORM"** submitted by **Rajkumar Pattnail (Reg. No: 12345678)** to the **Department of Computer Science & Engineering**, **Institute Name**, in partial fulfillment of the requirements for the award of the degree of **Bachelor of Technology in Computer Science & Engineering** is a record of bonafide work carried out by him under my guidance and supervision.

The results embodied in this project report have not been submitted to any other University or Institute for the award of any other degree or diploma.

<br/>
<br/>

| | | |
|---|---|---|
| | | |
| **Signature of Guide** | **Signature of HOD** | **Signature of Principal** |
| Prof. Guide Name | Dr. HOD Name | Dr. Principal Name |
| Assistant Professor, CSE | Head of Department, CSE | Principal |
| | | |

<br/>

**Place:** City Name

**Date:** 04/06/2026

<br/>

---

# DECLARATION

<br/>

I hereby declare that the project work entitled **"TRADEOS: AI-POWERED TRADING JOURNAL & ALGORITHMIC PLATFORM"** is an original work carried out by me under the guidance of **Prof. Guide Name**, Department of Computer Science & Engineering, Institute Name. I further declare that this project or any part of it has not been submitted to any other university or institute for the award of any degree or diploma.

<br/>

I also declare that the sources of information used in this project have been duly acknowledged in the text and in the list of references.

<br/>
<br/>

**Signature of the Student**

<br/>

**Name:** Rajkumar Pattnail

**Reg. No:** 12345678

**Date:** 04/06/2026

**Place:** City Name

<br/>

---

# ACKNOWLEDGEMENT

<br/>

First and foremost, I would like to express my sincere gratitude to my project guide, **Prof. Guide Name**, Department of Computer Science & Engineering, for his invaluable guidance, continuous encouragement, and constructive feedback throughout the duration of this project. His expertise and insights have been instrumental in shaping this work.

I am deeply grateful to **Dr. HOD Name**, Head of the Department of Computer Science & Engineering, for providing the necessary resources and a conducive environment for carrying out this project.

I also extend my thanks to **Dr. Principal Name**, Principal of Institute Name, for his support and encouragement.

I would like to acknowledge the faculty members of the Department of Computer Science & Engineering for their valuable suggestions and feedback during various presentations and reviews.

My sincere thanks to all my friends and classmates who have directly or indirectly contributed to this project through their discussions, suggestions, and moral support.

Finally, I would like to express my profound gratitude to my family for their unwavering support, patience, and encouragement throughout my academic journey.

<br/>

**Rajkumar Pattnail**

<br/>

---

# ABSTRACT

<br/>

## Page 1

The financial trading landscape has undergone a significant transformation over the past decade, with retail traders gaining unprecedented access to global markets through online brokerages. However, the vast majority of retail traders struggle to achieve consistent profitability. Studies indicate that over 80% of retail traders lose money, with the primary causes being poor discipline, lack of a structured trading plan, inadequate record-keeping, and emotional decision-making. Existing trading tools are fragmented — traders must use separate applications for journaling, charting, news aggregation, and algorithmic trading. This fragmentation leads to inefficiencies, data silos, and missed opportunities for insight.

**TradeOS** is a comprehensive, full-stack web application designed to address these challenges by providing an integrated platform that combines trade journaling, performance analytics, algorithmic trading, and AI-powered coaching in a single, cohesive system. The platform is built using modern software engineering principles and leverages cutting-edge technologies to deliver a seamless user experience.

The backend of TradeOS is developed using **Java Spring Boot 3.4.5**, a robust and production-ready framework that provides enterprise-grade features such as dependency injection, RESTful API development, data persistence with JPA/Hibernate, WebSocket support for real-time communication, and comprehensive security mechanisms. Spring Boot's convention-over-configuration approach enables rapid development while maintaining high standards of code quality and maintainability. The backend exposes a set of well-defined REST APIs that handle authentication, trade management, algorithmic strategy execution, market data retrieval, analytics computation, and AI insight generation.

The frontend is built with **React 19** utilizing modern hooks, functional components, and **Vite 8** as the build tool for fast development and optimized production builds. The user interface is designed with **Tailwind CSS 3** for utility-first styling, ensuring a responsive, accessible, and visually appealing experience across devices. State management is handled by **Zustand 5**, a lightweight and intuitive state management library that avoids the boilerplate associated with traditional Redux implementations. The frontend communicates with the backend via Axios-based HTTP clients and maintains real-time connections through STOMP over WebSocket.

## Page 2

**Algorithmic Trading Engine** — One of the flagship features of TradeOS is its built-in algorithmic trading engine. Users can create automated trading strategies with configurable entry triggers (immediate, price above, price below), position sizing, stop-loss, and take-profit parameters. The engine runs on a scheduled polling mechanism that continuously monitors market prices from the cache and evaluates strategy conditions. When conditions are met, the engine automatically executes trades and creates corresponding journal entries. A monitoring algorithm tracks open positions and closes them when stop-loss or take-profit levels are reached. Each execution is recorded with timestamps, trigger reasons, and profit/loss calculations, providing full auditability of automated trading activities.

**AI-Powered Insights** — TradeOS integrates with **OpenRouter.ai** to access the **DeepSeek V4 Flash** language model for generating intelligent insights. The system provides three AI-driven services: a trade psychology coach that analyzes trading patterns and suggests behavioral improvements; a journal coach that reviews trade entries and provides constructive feedback; and a general AI assistant that answers user queries about trading strategies, market analysis, and risk management. These AI services use carefully engineered prompts that include the user's trading history and performance metrics as context, enabling personalized and actionable recommendations.

**Market Data Integration** — The platform aggregates real-time market data from multiple sources to ensure high availability and accuracy. For cryptocurrency prices, TradeOS primarily uses the **Binance public API**, which provides free and reliable price data for major crypto pairs. For forex pairs and other instruments, the platform falls back to **Twelve Data**, a RESTful API offering real-time and historical market data. Gold prices (XAUUSD) are fetched from **goldapi.io**, a specialized API for precious metals pricing. A caching layer implemented using ConcurrentHashMap with configurable refresh intervals ensures that frequently accessed prices are served with minimal latency while respecting API rate limits.

**Technology Stack** — TradeOS is deployed on **Render Cloud Platform** using Docker-based deployment for the backend and static site hosting for the frontend. The backend is containerized using a multi-stage Docker build that compiles the Java application with Maven and runs it on JDK 21. The database is hosted on **Aiven Cloud** using PostgreSQL 15 with SSL encryption. The architecture follows a stateless, RESTful design pattern with JWT-based authentication, enabling horizontal scalability and future microservices decomposition.

**Keywords**: Trading Journal, Algorithmic Trading, Artificial Intelligence, Spring Boot, React, Market Data, Risk Management, PostgreSQL, Docker

<br/>

---

# EXECUTIVE SUMMARY

<br/>

## Page 1

### Project Overview

TradeOS is an integrated AI-powered trading journal and algorithmic trading platform designed to address the critical pain points faced by retail traders in today's financial markets. The project was conceived with the recognition that while financial markets have become increasingly accessible to individual traders, the tools available to support systematic trading, performance analysis, and continuous improvement remain fragmented and inadequate.

The platform brings together four core capabilities under a single, unified interface: comprehensive trade journaling with detailed record-keeping, advanced performance analytics with visual dashboards, automated algorithmic trading with configurable strategies, and AI-powered coaching for behavioral improvement. By integrating these capabilities, TradeOS eliminates the need for traders to maintain multiple disjointed tools and spreadsheets, reducing friction and enabling deeper insights through cross-referencing of data across these domains.

### Architecture and Technology

TradeOS follows a modern **client-server architecture** with a clear separation of concerns. The backend is a Java Spring Boot 3.4.5 application that exposes a RESTful API over HTTP and WebSocket connections. The application is structured into distinct layers: controllers handle HTTP request routing and validation, services encapsulate business logic, repositories provide data access through Spring Data JPA, and entities model the database schema. Cross-cutting concerns such as authentication, authorization, rate limiting, and exception handling are addressed through Spring Security filters, custom annotations, and global exception handlers.

The frontend is a single-page application (SPA) built with React 19 that communicates with the backend exclusively through API calls. This decoupled architecture allows independent scaling, deployment, and development of both components. The frontend is compiled into static assets by Vite 8 and served via Render's static site infrastructure. Client-side routing is managed by React Router DOM v7, with protected routes ensuring that authenticated users can only access authorized sections.

The database layer uses PostgreSQL 15 hosted on Aiven Cloud, a managed cloud database service that provides automated backups, high availability, and SSL-encrypted connections. The schema is managed through JPA/Hibernate with automatic DDL generation, complemented by Flyway for version-controlled migrations. The database design follows normalized principles with appropriate indexing for query performance.

### Key Features and Capabilities

**Trade Journal Management**: Users can log both manual and automated trades with comprehensive details including entry and exit prices, position sizes, trade direction (buy/sell), stop-loss and take-profit levels, timestamps, and free-form notes. Trades are organized by status (open/closed) and can be filtered, searched, and sorted. Each trade entry supports real-time profit/loss calculations and is linked to the user's profile for personalized analytics.

## Page 2

**Performance Analytics**: The platform computes a comprehensive set of performance metrics including win rate, profit factor, average win/loss, maximum drawdown, Sharpe ratio, and risk-reward ratios. Results are presented through interactive charts built with **Recharts 3** and **Lightweight Charts 4**, including equity curves, monthly performance heatmaps, win ratio breakdowns, and drawdown analysis. The analytics module also provides streak tracking (consecutive wins/losses), discipline scoring based on adherence to trading plans, and comparative performance benchmarks.

**Algorithmic Trading Engine**: The built-in algo engine supports fully automated trading strategies defined by users through a strategy builder interface. Strategies consist of entry conditions, trade direction, position sizing, and risk parameters. The engine evaluates strategies against cached market prices at configurable intervals and executes trades automatically when conditions are satisfied. Open positions are monitored and closed automatically when take-profit or stop-loss levels are breached. Each execution is logged with detailed metadata for post-trade analysis.

**AI-Powered Coaching**: Through integration with **OpenRouter.ai** and the **DeepSeek V4 Flash** model, TradeOS provides three specialized AI services. The Psychology Coach analyzes trading patterns to identify behavioral biases and suggests improvements. The Journal Coach reviews trade entries and provides constructive feedback on trading decisions. The General AI Assistant answers user questions about trading concepts, market analysis, and strategy optimization. These services use context-aware prompting that incorporates the user's trading history and performance data.

**Real-Time Market Data**: The platform fetches live prices from multiple providers including Binance (cryptocurrencies), Twelve Data (forex and indices), and goldapi.io (precious metals). A sophisticated caching layer minimizes API calls while ensuring data freshness through configurable refresh intervals. The system gracefully degrades across providers — if one source fails, it falls back to alternatives to maximize uptime.

### Deployment and Operations

TradeOS is deployed on **Render Cloud Platform** using a Docker-based deployment pipeline. The backend uses a multi-stage Dockerfile that builds the application with Maven and packages it into a minimal JDK 21 runtime image. The frontend is built with Vite and deployed as a static site. Both services are configured with environment variables for all sensitive configuration, ensuring that no credentials are embedded in the codebase. The database runs on **Aiven Cloud PostgreSQL**, providing managed database operations with automated backups and SSL security.

### Conclusion

TradeOS represents a significant step forward in providing retail traders with professional-grade tools that were previously available only to institutional traders. By combining trade journaling, performance analytics, algorithmic trading, and AI coaching in a single platform, TradeOS enables traders to develop and maintain a systematic approach to trading — a key differentiator between successful and unsuccessful traders. The platform's modern technology stack, clean architecture, and comprehensive feature set provide a solid foundation for future enhancements and scaling.

<br/>

---

# TABLE OF CONTENTS

<br/>

| Section | Page |
|---------|------|
| **Cover Page** | 1 |
| **Title Page** | 2 |
| **Certificate** | 3 |
| **Declaration** | 4 |
| **Acknowledgement** | 5 |
| **Abstract** | 6-7 |
| **Executive Summary** | 8-9 |
| **Table of Contents** | 10 |
| **List of Figures** | 11 |
| **List of Tables** | 12 |
| **Chapter 1: Introduction** | 13 |
| &nbsp;&nbsp;1.1 Background | 13 |
| &nbsp;&nbsp;1.2 Problem Statement | 14 |
| &nbsp;&nbsp;1.3 Objectives | 15 |
| &nbsp;&nbsp;1.4 Scope | 16 |
| &nbsp;&nbsp;1.5 Organization of Report | 17 |
| **Chapter 2: Literature Review** | 18 |
| &nbsp;&nbsp;2.1 Existing Trading Platforms | 18 |
| &nbsp;&nbsp;2.2 Algorithmic Trading Systems | 20 |
| &nbsp;&nbsp;2.3 AI in Financial Trading | 21 |
| &nbsp;&nbsp;2.4 Gaps in Existing Systems | 22 |
| **Chapter 3: System Analysis** | 23 |
| &nbsp;&nbsp;3.1 Requirement Analysis | 23 |
| &nbsp;&nbsp;3.2 Functional Requirements | 24 |
| &nbsp;&nbsp;3.3 Non-Functional Requirements | 25 |
| &nbsp;&nbsp;3.4 Use Case Diagrams | 26 |
| &nbsp;&nbsp;3.5 Feasibility Study | 27 |
| **Chapter 4: System Design** | 28 |
| &nbsp;&nbsp;4.1 System Architecture | 28 |
| &nbsp;&nbsp;4.2 Module Descriptions | 30 |
| &nbsp;&nbsp;4.3 Database Design | 32 |
| &nbsp;&nbsp;4.4 API Design | 34 |
| &nbsp;&nbsp;4.5 UI/UX Design | 35 |
| **Chapter 5: Implementation** | 36 |
| &nbsp;&nbsp;5.1 Technology Stack | 36 |
| &nbsp;&nbsp;5.2 Backend Implementation | 38 |
| &nbsp;&nbsp;5.3 Frontend Implementation | 40 |
| &nbsp;&nbsp;5.4 Integration and Deployment | 42 |
| **Chapter 6: Testing** | 43 |
| &nbsp;&nbsp;6.1 Testing Strategy | 43 |
| &nbsp;&nbsp;6.2 Unit Testing | 44 |
| &nbsp;&nbsp;6.3 Integration Testing | 45 |
| &nbsp;&nbsp;6.4 Performance Testing | 46 |
| **Chapter 7: Results and Discussion** | 47 |
| &nbsp;&nbsp;7.1 Feature Implementation Results | 47 |
| &nbsp;&nbsp;7.2 Performance Analysis | 49 |
| &nbsp;&nbsp;7.3 User Feedback | 50 |
| **Chapter 8: Conclusion and Future Work** | 51 |
| &nbsp;&nbsp;8.1 Conclusion | 51 |
| &nbsp;&nbsp;8.2 Limitations | 52 |
| &nbsp;&nbsp;8.3 Future Enhancements | 53 |
| **References** | 54 |
| **Appendices** | 55 |

<br/>

---

# LIST OF FIGURES

<br/>

| Figure No. | Description | Page |
|------------|-------------|------|
| 1.1 | Retail Trading Statistics — Win/Loss Distribution | 14 |
| 3.1 | Use Case Diagram — User Authentication | 26 |
| 3.2 | Use Case Diagram — Trade Management | 26 |
| 3.3 | Use Case Diagram — Algo Trading | 27 |
| 4.1 | System Architecture Diagram | 28 |
| 4.2 | Client-Server Communication Flow | 29 |
| 4.3 | Entity-Relationship Diagram | 32 |
| 4.4 | Database Schema — Users Table | 33 |
| 4.5 | Database Schema — Trades Table | 33 |
| 4.6 | API Endpoint Map | 34 |
| 4.7 | Frontend Component Hierarchy | 35 |
| 4.8 | Wireframe — Login Page | 35 |
| 4.9 | Wireframe — Dashboard | 35 |
| 5.1 | Technology Stack Layers | 36 |
| 5.2 | Spring Boot Application Structure | 38 |
| 5.3 | JWT Authentication Flow | 39 |
| 5.4 | Algo Engine Execution Flow | 40 |
| 5.5 | React Component Tree | 41 |
| 5.6 | Docker Multi-Stage Build | 42 |
| 6.1 | Test Coverage Report | 44 |
| 6.2 | API Response Time Benchmark | 46 |
| 7.1 | Dashboard — Live Market Data | 47 |
| 7.2 | Analytics — Equity Curve | 48 |
| 7.3 | Algo Builder — Strategy Configuration | 48 |
| 7.4 | AI Insights — Trade Psychology Report | 49 |
| 7.5 | Performance — Page Load Times | 49 |

<br/>

---

# LIST OF TABLES

<br/>

| Table No. | Description | Page |
|-----------|-------------|------|
| 3.1 | Functional Requirements Specification | 24 |
| 3.2 | Non-Functional Requirements Specification | 25 |
| 4.1 | User Entity — Field Description | 32 |
| 4.2 | Trade Entity — Field Description | 33 |
| 4.3 | REST API Endpoints | 34 |
| 5.1 | Technology Stack Comparison | 37 |
| 5.2 | Backend Dependencies (pom.xml) | 38 |
| 5.3 | Frontend Dependencies (package.json) | 41 |
| 6.1 | Test Cases — Authentication Module | 44 |
| 6.2 | Test Cases — Trade Management | 45 |
| 6.3 | Test Cases — Algo Engine | 45 |
| 6.4 | Performance Benchmarks | 46 |
| 7.1 | Feature Completion Status | 47 |
| 7.2 | API Response Times (Percentiles) | 49 |

<br/>

---

*End of Front Matter*

*This document is the property of Rajkumar Pattnail. Unauthorized reproduction or distribution is prohibited.*
