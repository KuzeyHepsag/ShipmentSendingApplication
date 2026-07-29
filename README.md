📦ShipmentSendingApplication
An intelligent, full-stack logistics and shipment tracking platform designed to optimize delivery efficiency. This system leverages geolocation to automatically assign the nearest warehouse to users and utilizes smart algorithms to manage fleet operations and shipment distribution.

🚀Key Features
For Users
Smart Warehouse Assignment: Automatically connects you to the nearest warehouse based on your location.

Profile Management: Easily update your address and location, and the system instantly re-assigns you to the most efficient service point.

Shipment Tracking: Full visibility into your shipment's journey. Monitor every step with detailed logs and real-time status updates.

Convenience: Send shipments seamlessly across different regions served by our smart warehouse network.

🛠️For Admins
Fleet Management: Add and manage delivery vehicles within the system.

Efficient Distribution: View all shipments assigned to specific vehicles.

Smart Routing:

"Load" Action: When a vehicle loads, it automatically collects shipments along its route, optimizing the delivery path.

"Drop" Action: When a vehicle drops off shipments, it dynamically manages unloading while picking up new shipments on the route for maximum fuel and time efficiency.

Comprehensive Monitoring: Track every movement and vehicle capacity in real-time.

🛠️Getting Started & Admin Setup
🛠️Admin Privileges
To access the Admin Panel, you need to assign the ROLE_ADMIN role to a user in the database:

Open your database management tool (MySQL Workbench, DBeaver, etc.).

Navigate to the USERS table.

Find your user account.

Locate the role column and change the value from ROLE_USER to ROLE_ADMIN.

Log out and log back in to the application. You will now see the Admin Panel options.

🛠️🛠️How to Run Locally
To get this project up and running on your local machine, follow these steps:

1. Prerequisites
Ensure you have the following installed on your computer:

Java (JDK 17+)

Node.js (v16+)

MySQL (or any preferred relational database)

2. Backend Setup
Navigate to the kargoTakipBackend folder:
cd kargoTakipBackend

Open src/main/resources/application.properties and update your database configuration:
spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
spring.datasource.username=your_username
spring.datasource.password=your_password

Build and run the project:
mvn spring-boot:run

3. Frontend Setup
Navigate to the kargoTakipFrontend folder in a new terminal:
cd kargoTakipFrontend

Install the necessary dependencies:
npm install

Start the React development server:
npm start

Open your browser and go to http://localhost:3000.

Tech Stack
Backend: Spring Boot, Java, JPA/Hibernate.

Frontend: React, Leaflet (for interactive mapping).

Database: MySQL / PostgreSQL.

## Configuration
To run this project, follow these steps:
1. Navigate to `kargoTakipBackend/src/main/resources/`.
2. Create a copy of `application.properties.example` and name it `application.properties`.
3. Update the `spring.datasource.password` and `jwt.secret` fields with your local database credentials.

This project is built to streamline logistics operations by prioritizing efficiency, transparency, and user experience.
