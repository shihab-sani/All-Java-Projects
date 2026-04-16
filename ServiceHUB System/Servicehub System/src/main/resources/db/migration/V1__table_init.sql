-- Service Marketplace Database Schema

CREATE DATABASE IF NOT EXISTS service_marketplace;
USE service_marketplace;

-- Users Table (Base user table for all user types)
CREATE TABLE users (
                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       phone_number VARCHAR(20),
                       profile_picture_url VARCHAR(500),
                       user_type ENUM('CUSTOMER', 'WORKER', 'ADMIN') NOT NULL,
                       is_active BOOLEAN DEFAULT TRUE,
                       is_blocked BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       INDEX idx_email (email),
                       INDEX idx_user_type (user_type),
                       INDEX idx_is_active (is_active)
);

-- Customer Profile
CREATE TABLE customer_profiles (
                                   id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                   user_id BIGINT NOT NULL UNIQUE,
                                   address VARCHAR(500),
                                   city VARCHAR(100),
                                   latitude DECIMAL(10, 8),
                                   longitude DECIMAL(11, 8),
                                   total_bookings INT DEFAULT 0,
                                   average_rating DECIMAL(3, 2) DEFAULT 0.00,
                                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                   INDEX idx_city (city),
                                   INDEX idx_location (latitude, longitude)
);

-- Worker Profile
CREATE TABLE worker_profiles (
                                 id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                 user_id BIGINT NOT NULL UNIQUE,
                                 bio VARCHAR(500),
                                 service_category VARCHAR(100) NOT NULL,
                                 hourly_rate DECIMAL(10, 2) NOT NULL,
                                 address VARCHAR(500),
                                 city VARCHAR(100),
                                 latitude DECIMAL(10, 8),
                                 longitude DECIMAL(11, 8),
                                 is_available BOOLEAN DEFAULT TRUE,
                                 total_jobs INT DEFAULT 0,
                                 total_hours_worked DECIMAL(10, 2) DEFAULT 0.00,
                                 average_rating DECIMAL(3, 2) DEFAULT 0.00,
                                 verified BOOLEAN DEFAULT FALSE,
                                 skills TEXT,
                                 years_of_experience INT,
                                 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                 INDEX idx_service_category (service_category),
                                 INDEX idx_city (city),
                                 INDEX idx_location (latitude, longitude),
                                 INDEX idx_is_available (is_available),
                                 INDEX idx_verified (verified)
);

-- Service Categories
CREATE TABLE service_categories (
                                    id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    name VARCHAR(100) NOT NULL UNIQUE,
                                    description VARCHAR(500),
                                    icon_url VARCHAR(500),
                                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings/Jobs
CREATE TABLE bookings (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          customer_id BIGINT NOT NULL,
                          worker_id BIGINT NOT NULL,
                          service_category VARCHAR(100),
                          job_description TEXT,
                          hourly_rate DECIMAL(10, 2) NOT NULL,
                          estimated_hours DECIMAL(5, 2),
                          total_cost DECIMAL(10, 2),
                          status ENUM('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
                          actual_hours_worked DECIMAL(5, 2),
                          scheduled_date DATETIME,
                          start_time DATETIME,
                          end_time DATETIME,
                          payment_status ENUM('PENDING', 'PAID', 'REFUNDED') DEFAULT 'PENDING',
                          customer_rating INT,
                          customer_review TEXT,
                          worker_rating INT,
                          worker_review TEXT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                          FOREIGN KEY (customer_id) REFERENCES users(id),
                          FOREIGN KEY (worker_id) REFERENCES users(id),
                          INDEX idx_customer_id (customer_id),
                          INDEX idx_worker_id (worker_id),
                          INDEX idx_status (status),
                          INDEX idx_created_at (created_at)
);

-- Messages/Conversations
CREATE TABLE conversations (
                               id BIGINT PRIMARY KEY AUTO_INCREMENT,
                               customer_id BIGINT NOT NULL,
                               worker_id BIGINT NOT NULL,
                               booking_id BIGINT,
                               last_message_at TIMESTAMP,
                               is_active BOOLEAN DEFAULT TRUE,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                               FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
                               FOREIGN KEY (worker_id) REFERENCES users(id) ON DELETE CASCADE,
                               FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
                               UNIQUE KEY unique_pair (customer_id, worker_id),
                               INDEX idx_customer_id (customer_id),
                               INDEX idx_worker_id (worker_id)
);

-- Messages
CREATE TABLE messages (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          conversation_id BIGINT NOT NULL,
                          sender_id BIGINT NOT NULL,
                          content TEXT NOT NULL,
                          is_read BOOLEAN DEFAULT FALSE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
                          FOREIGN KEY (sender_id) REFERENCES users(id),
                          INDEX idx_conversation_id (conversation_id),
                          INDEX idx_sender_id (sender_id),
                          INDEX idx_is_read (is_read),
                          INDEX idx_created_at (created_at)
);

-- Reviews/Ratings
CREATE TABLE reviews (
                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                         booking_id BIGINT NOT NULL UNIQUE,
                         reviewer_id BIGINT NOT NULL,
                         reviewee_id BIGINT NOT NULL,
                         rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                         review_text TEXT,
                         review_type ENUM('CUSTOMER_TO_WORKER', 'WORKER_TO_CUSTOMER'),
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
                         FOREIGN KEY (reviewer_id) REFERENCES users(id),
                         FOREIGN KEY (reviewee_id) REFERENCES users(id),
                         INDEX idx_booking_id (booking_id),
                         INDEX idx_reviewee_id (reviewee_id)
);

-- Vouchers/Offers
CREATE TABLE vouchers (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          code VARCHAR(50) NOT NULL UNIQUE,
                          description VARCHAR(500),
                          discount_percentage DECIMAL(5, 2),
                          discount_amount DECIMAL(10, 2),
                          max_uses INT,
                          current_uses INT DEFAULT 0,
                          valid_from DATETIME NOT NULL,
                          valid_until DATETIME NOT NULL,
                          is_active BOOLEAN DEFAULT TRUE,
                          created_by BIGINT,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (created_by) REFERENCES users(id),
                          INDEX idx_code (code),
                          INDEX idx_is_active (is_active),
                          INDEX idx_valid_until (valid_until)
);

-- Admin Activity Log
CREATE TABLE admin_activity_logs (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     admin_id BIGINT NOT NULL,
                                     action_type VARCHAR(100) NOT NULL,
                                     target_user_id BIGINT,
                                     action_details TEXT,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     FOREIGN KEY (admin_id) REFERENCES users(id),
                                     FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL,
                                     INDEX idx_admin_id (admin_id),
                                     INDEX idx_created_at (created_at)
);

-- Create indexes for common queries
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_worker_profile_user ON worker_profiles(user_id);
CREATE INDEX idx_customer_profile_user ON customer_profiles(user_id);
