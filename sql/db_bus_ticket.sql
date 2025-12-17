CREATE DATABASE IF NOT EXISTS db_bus_ticket;
USE db_bus_ticket;

CREATE TABLE bus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    route VARCHAR(100),
    seats INT
);

CREATE TABLE booking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passenger_name VARCHAR(100),
    bus_id INT,
    FOREIGN KEY (bus_id) REFERENCES bus(id)
);

INSERT INTO bus(name,route,seats)
VALUES
("Sinar Jaya","Bandung - Jakarta",40),
("Rosalia","Bandung - Surabaya",35);
