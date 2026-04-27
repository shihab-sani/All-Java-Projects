CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     email VARCHAR(255) NOT NULL UNIQUE,
                                     password VARCHAR(255) NOT NULL,
                                     full_name VARCHAR(255) NOT NULL,
                                     phone_number VARCHAR(20),
                                     profile_picture_url VARCHAR(500),
                                     user_type ENUM('CUSTOMER', 'WORKER', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
                                     is_verified BOOLEAN DEFAULT FALSE,
                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     INDEX idx_email (email),
                                     INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Workers table
CREATE TABLE IF NOT EXISTS workers (
                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       user_id BIGINT NOT NULL UNIQUE,
                                       service_category VARCHAR(100) NOT NULL,
                                       city VARCHAR(100) NOT NULL,
                                       latitude DECIMAL(10, 8),
                                       longitude DECIMAL(11, 8),
                                       bio TEXT,
                                       experience_years INT,
                                       hourly_rate DECIMAL(10, 2) NOT NULL,
                                       is_available BOOLEAN DEFAULT TRUE,
                                       rating DECIMAL(3, 2) DEFAULT 0,
                                       total_jobs INT DEFAULT 0,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                       INDEX idx_category (service_category),
                                       INDEX idx_city (city),
                                       INDEX idx_available (is_available),
                                       INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Customers table
CREATE TABLE IF NOT EXISTS customers (
                                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                         user_id BIGINT NOT NULL UNIQUE,
                                         address VARCHAR(500),
                                         city VARCHAR(100),
                                         latitude DECIMAL(10, 8),
                                         longitude DECIMAL(11, 8),
                                         total_bookings INT DEFAULT 0,
                                         rating DECIMAL(3, 2) DEFAULT 0,
                                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                                         INDEX idx_city (city),
                                         INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Bookings table
CREATE TABLE IF NOT EXISTS bookings (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        customer_id BIGINT NOT NULL,
                                        worker_id BIGINT NOT NULL,
                                        service_category VARCHAR(100) NOT NULL,
                                        job_description TEXT NOT NULL,
                                        hourly_rate DECIMAL(10, 2) NOT NULL,
                                        estimated_hours DECIMAL(5, 2) NOT NULL,
                                        actual_hours DECIMAL(5, 2),
                                        scheduled_date DATETIME NOT NULL,
                                        started_date DATETIME,
                                        completed_date DATETIME,
                                        total_cost DECIMAL(10, 2),
                                        status ENUM('PENDING', 'ACCEPTED', 'STARTED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
                                        is_paid BOOLEAN DEFAULT FALSE,
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
                                        FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
                                        INDEX idx_customer (customer_id),
                                        INDEX idx_worker (worker_id),
                                        INDEX idx_status (status),
                                        INDEX idx_scheduled_date (scheduled_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Reviews table
CREATE TABLE IF NOT EXISTS reviews (
                                       id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                       booking_id BIGINT NOT NULL UNIQUE,
                                       reviewer_id BIGINT NOT NULL,
                                       rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                                       review_text TEXT,
                                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
                                       FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
                                       INDEX idx_reviewer (reviewer_id),
                                       INDEX idx_booking (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Payments table
CREATE TABLE IF NOT EXISTS payments (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        booking_id BIGINT NOT NULL,
                                        amount DECIMAL(10, 2) NOT NULL,
                                        payment_method VARCHAR(50),
                                        payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
                                        transaction_id VARCHAR(255),
                                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                        FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
                                        INDEX idx_booking (booking_id),
                                        INDEX idx_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Verification table for worker verification
CREATE TABLE IF NOT EXISTS verification_documents (
                                                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                                      worker_id BIGINT NOT NULL,
                                                      document_type VARCHAR(100),
                                                      document_url VARCHAR(500),
                                                      verification_status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
                                                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                                      FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE CASCADE,
                                                      INDEX idx_worker (worker_id),
                                                      INDEX idx_status (verification_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
