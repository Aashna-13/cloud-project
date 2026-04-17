# Intelligent Cloud Application Catalog System

Welcome to the Intelligent Cloud Application Catalog System! This is a modern, full-stack platform designed to help administrators and developers seamlessly manage cloud-based application inventories, visualize metrics, and track complex structural dependencies.

---

## 🌟 Core Features

1. **Centralized Application Catalog (CRUD)**
   Acts as a central hub where developers can browse, add, edit, and delete cloud applications. Each application tracks vital metadata such as its name, description, category (e.g., Database, AI, Storage), version, and custom searchable tags.

2. **Intelligent Dependency Mapping**
   Modern microservices rely heavily on each other. Our system allows applications to link to one another using a unique "self-referencing many-to-many" database table. For example, if you view the "Payment Gateway" app, the system maps out that it depends on "Auth Service" and "Redis Cache".

3. **Smart Recommendation Engine**
   When users interact with a specific app, the Spring Boot backend runs an algorithm that analyzes the application's category and the overall usage frequencies of all other apps. It dynamically recommends similar or highly-utilized companion applications that you might also need.

4. **Real-Time Analytics Dashboard**
   The home dashboard provides an executive overview using beautiful charting visualizations (powered by Recharts). It aggregates live database statistics to show you pie charts of the category distributions and top-usage metrics.

5. **Lightning-Fast Global Search & Filtering**
   Features a custom JPQL (Java Persistence Query Language) engine allowing users to type into the search bar and instantly filter the entire catalog dynamically by matching keywords across names, descriptions, and tags.

---

## ⚙️ How it Works in Real-Time

When interacting with the user interface, the architecture moves rapidly through three layers:

1. **The Modern React Frontend:** As you click around or type into the search bar, the React frontend instantly triggers non-blocking asynchronous HTTP requests (using Axios) behind the scenes in your browser. This signifies that the UI never freezes and the page never has to fully reload.
2. **The Spring Boot REST API:** Your request hits the Spring Boot Java server running locally on Port `8080`. The backend acts as the traffic controller. For instance, if you ask for recommendations, it triggers the `ApplicationService` class to instantly calculate which apps relate to your request using Java Stream mathematics.
3. **The Live Database:** The backend instantly executes optimized SQL queries using Hibernate/JPA against the relational database, processes your data, and returns a JSON package back to React.

---

## 💾 Where is the Data Stored?

Our backend is built using **Spring Data JPA** (Java Persistence API), meaning it is completely database-agnostic. 

Depending on the environment, the data is stored in different places:

1. **Local Development (How you are running it now):**
   Locally, the data is stored in an **H2 In-Memory Database**. This means the database is stored entirely in your computer's RAM. 
   * **Why we do this:** It allows the application to boot up instantly without installing SQL servers locally. Every time you restart the backend, the database is wiped clean, and our custom `DataInitializer` class automatically rebuilds the database structures and inserts 10 dummy applications so you have fresh data every single time you develop!
   * You can view the raw local database anytime by visiting `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:catalogdb`).

2. **Cloud Environment (AWS):**
   When deployed via the provided `aws-cloudformation-template.yaml` file, the Spring Boot application detects the AWS environment variables and seamlessly switches its dialect to connect to an **Amazon RDS MySQL Database**. There, your data is written to a highly-available, physical disk for persistent cloud storage.

---

## 🚀 How to Run Locally

You can launch both the frontend and backend simultaneously using the provided automation script:

1. Open PowerShell in this root directory.
2. Run the command:
   ```powershell
   .\start-all.ps1
   ```
3. Visit the live UI at [http://localhost:5173](http://localhost:5173).
