--ShipmentSendingApplication
An intelligent, full-stack logistics and shipment tracking platform designed to optimize delivery efficiency. This system leverages geolocation to automatically assign the nearest warehouse to users and utilizes smart algorithms to manage fleet operations and shipment distribution.

--Key Features
For Users
Smart Warehouse Assignment: Automatically connects you to the nearest warehouse based on your location.

Profile Management: Easily update your address and location, and the system instantly re-assigns you to the most efficient service point.

Shipment Tracking: Full visibility into your shipment's journey. Monitor every step with detailed logs and real-time status updates.

Convenience: Send shipments seamlessly across different regions served by our smart warehouse network.

For Admins
Fleet Management: Add and manage delivery vehicles within the system.

Efficient Distribution: View all shipments assigned to specific vehicles.

Smart Routing:

"Load" Action: When a vehicle loads, it automatically collects shipments along its route, optimizing the delivery path.

"Drop" Action: When a vehicle drops off shipments, it dynamically manages unloading while picking up new shipments on the route for maximum fuel and time efficiency.

Comprehensive Monitoring: Track every movement and vehicle capacity in real-time.

--Getting Started & Admin Setup
Admin Privileges
To access the Admin Panel, you need to assign the ROLE_ADMIN role to a user in the database:

Open your database management tool (MySQL Workbench, DBeaver, etc.).

Navigate to the USERS table.

Find your user account.

Locate the role column and change the value from ROLE_USER to ROLE_ADMIN.

Log out and log back in to the application. You will now see the Admin Panel options.

--Tech Stack
Backend: Spring Boot, Java, JPA/Hibernate.

Frontend: React, Leaflet (for interactive mapping).

Database: MySQL / PostgreSQL.

This project is built to streamline logistics operations by prioritizing efficiency, transparency, and user experience.
