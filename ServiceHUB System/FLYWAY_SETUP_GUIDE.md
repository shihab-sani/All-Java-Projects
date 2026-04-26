# Flyway Setup & Troubleshooting Guide

## Problem Fixed

**Original Error:**
```
No Flyway database plugin found to handle jdbc:mysql://localhost:3306/first_project?createDatabaseIfNotExist=true
```

**Root Cause:** The Flyway Maven plugin was missing the MySQL JDBC driver in its classpath.

**Solution:** Added Flyway Maven plugin configuration with MySQL driver dependency.

---

## What Was Changed

### pom.xml Update
Added the `flyway-maven-plugin` with proper MySQL driver configuration:

```xml
<plugin>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-maven-plugin</artifactId>
    <version>11.7.2</version>
    <configuration>
        <driver>com.mysql.cj.jdbc.Driver</driver>
        <url>jdbc:mysql://localhost:3306/servicehub?createDatabaseIfNotExist=true</url>
        <user>root</user>
        <password>root</password>
        <locations>
            <location>filesystem:src/main/resources/db/migration</location>
        </locations>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>
</plugin>
```

**Key Points:**
- Driver: `com.mysql.cj.jdbc.Driver` (MySQL Connector/J)
- Database: `servicehub` (default database name)
- MySQL driver is a dependency of the plugin itself
- Migrations location: `src/main/resources/db/migration`

---

## How to Use Flyway

### Option 1: Automatic Migration (Recommended)
When you start your Spring Boot application, Flyway automatically runs:

```bash
cd "ServiceHUB System/Servicehub System"
./mvnw spring-boot:run
```

**What happens:**
1. Spring Boot starts
2. Flyway checks for migrations in `src/main/resources/db/migration`
3. Runs any pending migrations (V1__, V2__, etc.)
4. Creates/updates database tables
5. Logs Flyway success messages

### Option 2: Manual Flyway Migration
Run Flyway migrations manually from command line:

```bash
cd "ServiceHUB System/Servicehub System"
./mvnw flyway:migrate
```

**Expected Output:**
```
[INFO] --- flyway:11.7.2:migrate (default-cli) @ ServicehubSystem ---
[INFO] Database: jdbc:mysql://localhost:3306/servicehub (MySQL 8.0)
[INFO] Validated 1 migration (file)
[INFO] Creating Schema History table `servicehub`.`flyway_schema_history` ...
[INFO] Current version of schema `servicehub`: 0
[INFO] Migrating schema `servicehub` to version 1 - Initial Database Setup
[INFO] Successfully applied 1 migration
```

### Option 3: Check Migration Status
```bash
./mvnw flyway:info
```

Shows all migrations and their status:
- Success (green checkmark)
- Pending (not yet run)
- Failed (error state)

---

## Configuration Details

### application.yaml (Auto-Migration)
```yaml
spring:
  flyway:
    enabled: true
    locations: classpath:db/migration
    baselineOnMigrate: false
    validateOnMigrate: true
```

**Parameters:**
- `enabled`: true = auto-run on startup
- `locations`: where migration files are located
- `baselineOnMigrate`: false = don't allow baseline on non-empty DB
- `validateOnMigrate`: true = validate existing migrations

### pom.xml (Manual Migration)
```xml
<plugin>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-maven-plugin</artifactId>
    <version>11.7.2</version>
    <configuration>
        <driver>com.mysql.cj.jdbc.Driver</driver>
        <url>jdbc:mysql://localhost:3306/servicehub?createDatabaseIfNotExist=true</url>
        <user>root</user>
        <password>root</password>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>8.0.33</version>
        </dependency>
    </dependencies>
</plugin>
```

---

## Migration File Naming Convention

Flyway requires specific naming:

### Versioned Migrations (Auto-run in order)
```
V1__Initial_Database_Setup.sql
V2__Add_User_Profiles.sql
V3__Create_Booking_Table.sql
```

**Format:** `V<version>__<description>.sql`
- V = Version prefix (required)
- <version> = Number (1, 2, 3, etc.)
- __ = Double underscore (required)
- <description> = Human-readable name (underscores for spaces)

### Undo Migrations (Rollback - requires paid version)
```
U1__Undo_Initial_Setup.sql
```

### Repeatable Migrations (Run every migration)
```
R__Refresh_Views.sql
R__Update_Permissions.sql
```

---

## Current Migration Files

Location: `src/main/resources/db/migration/`

### V1__Initial_Database_Setup.sql
Creates 7 tables:
- `users` - Core user information
- `workers` - Worker profiles and details
- `customers` - Customer profiles
- `bookings` - Service bookings and status
- `reviews` - Customer reviews and ratings
- `payments` - Payment transactions
- `verification_documents` - Worker verification

---

## Troubleshooting

### Problem 1: "No Flyway database plugin found"
**Solution:** Ensure mysql-connector-j is in the flyway-maven-plugin dependencies (not just main dependencies).

### Problem 2: "Connection refused"
**Solution:**
```bash
# Check MySQL is running
mysql -u root -p

# Or restart MySQL
# Windows:
net start MySQL80

# Mac:
brew services restart mysql

# Linux:
sudo service mysql restart
```

### Problem 3: "Access denied for user 'root'"
**Solution:** Update credentials in pom.xml:
```xml
<user>root</user>
<password>your_mysql_password</password>
```

### Problem 4: "Unknown database 'servicehub'"
**Solution:** This is OK! Flyway will create it automatically with `createDatabaseIfNotExist=true`.

### Problem 5: "Validation failed"
**Solution:** If you manually modified migration files, clear and restart:
```bash
./mvnw flyway:clean  # WARNING: Deletes all data!
./mvnw flyway:migrate
```

---

## Best Practices

### 1. Always Use Versioned Migrations
```sql
-- Good: V2__Add_Worker_Location.sql
CREATE TABLE worker_location (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (worker_id) REFERENCES workers(id)
);

-- Bad: Never edit V1__Initial_Database_Setup.sql after it runs!
```

### 2. Make Migrations Idempotent
```sql
-- Good: Safe to run multiple times
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL
);

-- Bad: Will error if table exists
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT
);
```

### 3. Use Separate Migrations for Schema Changes
```sql
-- V2__Add_Phone_To_Users.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- V3__Add_Verification_Status.sql
ALTER TABLE workers ADD COLUMN verified BOOLEAN DEFAULT FALSE;
```

### 4. Include Rollback Plan
For migrations you might need to undo:
```sql
-- V2__Add_Location_To_Workers.sql
-- Includes rollback in comments for reference

-- Forward:
ALTER TABLE workers ADD COLUMN location VARCHAR(255);

-- Rollback (manual if needed):
-- ALTER TABLE workers DROP COLUMN location;
```

---

## Complete Workflow

### 1. Start MySQL
```bash
# Ensure MySQL is running
mysql -u root -p
```

### 2. Edit Migration File
Create new file: `src/main/resources/db/migration/V2__Add_New_Feature.sql`
```sql
CREATE TABLE new_feature (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);
```

### 3. Option A: Auto-run with Spring Boot
```bash
./mvnw spring-boot:run
```

### 3. Option B: Run manually with Maven
```bash
./mvnw flyway:migrate
```

### 4. Verify Migration
```bash
./mvnw flyway:info
```

### 5. Check Database
```bash
mysql -u root -p
use servicehub;
SHOW TABLES;
```

---

## Summary

| Task | Command |
|------|---------|
| Run migrations with Spring Boot | `./mvnw spring-boot:run` |
| Run migrations manually | `./mvnw flyway:migrate` |
| Check migration status | `./mvnw flyway:info` |
| Clean database (⚠️ deletes data) | `./mvnw flyway:clean` |
| Validate migrations | `./mvnw flyway:validate` |

---

## Additional Resources

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Flyway Maven Plugin](https://flywaydb.org/documentation/maven/)
- [MySQL JDBC Driver](https://dev.mysql.com/downloads/connector/j/)
- [Spring Boot Flyway Integration](https://spring.io/blog/2021/02/04/flyway-database-migrations-with-spring-boot)

---

**Status:** ✅ Fixed and Ready to Use
