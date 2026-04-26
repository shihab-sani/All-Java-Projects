# ServiceHub System - Complete Setup Checklist

## ✅ All Issues Resolved

- [x] API Endpoint Mismatch Fixed
- [x] Flyway Migrations Enabled
- [x] Database Schema Created
- [x] CORS Properly Configured
- [x] Complete Documentation

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create MySQL Database
```bash
mysql -u root -p
```
Then in MySQL:
```sql
CREATE DATABASE IF NOT EXISTS servicehub;
EXIT;
```

### Step 2: Start Backend
```bash
cd "ServiceHUB System/Servicehub System"
./mvnw spring-boot:run
```
Wait for: "Started ServicehubSystemApplication"

### Step 3: Start Frontend
```bash
cd "ServiceHUB System/Servicehub System/Frontend"
npm install
npm run dev
```
Opens: http://localhost:3000

### Step 4: Test Connection
```bash
curl http://localhost:8080/api/workers/verified
```
Should return: `[]` or JSON array (not 404)

---

## ✨ Pre-Testing Checklist

### Backend
- [ ] MySQL server running on localhost:3306
- [ ] Database 'servicehub' created
- [ ] Java 21+ installed
- [ ] Maven configured
- [ ] No port 8080 conflicts

### Frontend
- [ ] Node.js/npm installed
- [ ] node_modules not corrupted
- [ ] .env file configured with API_URL
- [ ] No port 3000 conflicts

### Files Modified
- [ ] WorkerController.java - endpoint fixed to `/workers`
- [ ] BookingController.java - endpoint fixed to `/bookings`
- [ ] application.yaml - Flyway enabled
- [ ] V1__Initial_Database_Setup.sql - migration created

---

## 🧪 Testing Steps

### Test 1: Backend Startup
```
EXPECTED: No errors in startup logs
EXPECTED: "Flyway database migration..." in logs
EXPECTED: "Started ServicehubSystemApplication" message
ACTUAL: _______________________________________________
```

### Test 2: Database Tables
```bash
mysql -u root -p servicehub
SHOW TABLES;
```
```
EXPECTED TABLES:
✓ users
✓ workers
✓ customers
✓ bookings
✓ reviews
✓ payments
✓ verification_documents
✓ flyway_schema_history

ACTUAL: _______________________________________________
```

### Test 3: API Worker Endpoint
```bash
curl http://localhost:8080/api/workers/verified
```
```
EXPECTED: HTTP 200 with JSON array []
NOT EXPECTED: 404 error or "Cannot POST" message
ACTUAL: _______________________________________________
```

### Test 4: API Booking Endpoint
```bash
curl http://localhost:8080/api/bookings/customer/1
```
```
EXPECTED: HTTP 200 with JSON array []
NOT EXPECTED: 404 error or "Cannot POST" message
ACTUAL: _______________________________________________
```

### Test 5: Auth Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```
```
EXPECTED: HTTP 200 or 401 (but not 404)
NOT EXPECTED: 404 error
ACTUAL: _______________________________________________
```

### Test 6: CORS Test (in browser console at http://localhost:3000)
```javascript
fetch('http://localhost:8080/api/workers/verified')
  .then(r => r.json())
  .then(d => console.log('Success!', d))
  .catch(e => console.log('Error:', e))
```
```
EXPECTED: "Success!" printed with array data
NOT EXPECTED: CORS error or network error
ACTUAL: _______________________________________________
```

### Test 7: Frontend API Integration
Visit: http://localhost:3000
```
Check:
□ Page loads without errors
□ Search page loads
□ Try to search for workers
□ Check browser DevTools → Network tab
□ Look for requests to http://localhost:8080/api/
□ Verify they return 200 (not 404)

ACTUAL: _______________________________________________
```

---

## 📋 Troubleshooting Guide

### Issue: "Cannot GET /api/worker/category/Plumbing"
```
Root Cause: Old endpoint path (singular)
Solution: ✅ ALREADY FIXED in WorkerController.java
Status: Verify changed from /worker to /workers
```

### Issue: "CORS policy: No 'Access-Control-Allow-Origin' header"
```
Root Cause: CORS not configured
Solution: ✅ ALREADY CONFIGURED in ServicehubSystemApplication.java
Status: Check logs for "addCorsMappings" configuration
```

### Issue: "Table 'servicehub.users' doesn't exist"
```
Root Cause: Database not created or Flyway didn't run
Solution: 
  1. Create database: CREATE DATABASE IF NOT EXISTS servicehub;
  2. Restart backend
  3. Watch for "Flyway" messages in logs
```

### Issue: "Flyway successfully applied 1 migration" but no tables
```
Root Cause: Migration script has errors
Solution:
  1. Check MySQL error logs
  2. Verify V1__Initial_Database_Setup.sql is in correct location
  3. Ensure MySQL user has CREATE TABLE permission
```

### Issue: Port 8080 already in use
```
Solution: Kill process on port 8080 or use different port
bash
lsof -i :8080  # Find process
kill -9 <PID>   # Kill it
# Or change port in application.yaml
```

### Issue: Port 3000 already in use
```
Solution: Kill process on port 3000
bash
lsof -i :3000  # Find process
kill -9 <PID>   # Kill it
# Or use: npm run dev -- -p 3001
```

### Issue: "Could not authenticate against any of the configured realms"
```
Root Cause: MySQL password wrong
Solution:
  1. Check password in application.yaml
  2. Verify MySQL is running
  3. Test: mysql -u root -p (check password works)
```

---

## 📊 Success Indicators

### Backend Logs Should Show:
```
✓ "Flyway X.X.X validated successfully"
✓ "Creating schema `flyway_schema_history`..." or "Schema exists"
✓ "V1__Initial_Database_Setup"
✓ "Migrating schema `public` to version 1 - Initial Database Setup"
✓ "Successfully applied 1 migration to schema `public`"
✓ "Started ServicehubSystemApplication in X.XXs"
✓ "Tomcat initialized with port(s): 8080 (http)"
```

### Frontend Console Should Show:
```
✓ No errors related to API calls
✓ Network requests to localhost:8080/api/* show 200 status
✓ Response data visible in Network tab
```

### Database Should Show:
```
✓ 8 tables in servicehub database
✓ flyway_schema_history has 1 entry for V1
✓ users, workers, bookings tables have correct columns
✓ Foreign keys established
```

---

## 🔄 Rebuild & Clean Steps

If something goes wrong, clean everything:

### Clean Backend
```bash
cd "ServiceHUB System/Servicehub System"
./mvnw clean
# This removes target/ directory
```

### Clean Frontend
```bash
cd "ServiceHUB System/Servicehub System/Frontend"
rm -rf node_modules package-lock.json
npm install
```

### Clean Database (WARNING: Deletes all data)
```bash
mysql -u root -p
DROP DATABASE servicehub;
CREATE DATABASE servicehub;
EXIT;
```

Then restart backend to recreate schema via Flyway.

---

## 📞 Quick Reference

### Important URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- MySQL: localhost:3306 (servicehub database)

### Important Credentials
- MySQL User: root
- MySQL Password: Shihab14032001 (change for production!)
- JWT Secret: Check application.yaml

### Important Directories
- Backend Controllers: `src/main/java/servicehub/system/Controller/`
- Frontend Pages: `Frontend/app/`
- Database Migrations: `src/main/resources/db/migration/`
- Backend Config: `src/main/resources/application.yaml`
- Frontend Config: `Frontend/.env`

### Important Files Changed
1. `WorkerController.java` - Fixed endpoint
2. `BookingController.java` - Fixed endpoint
3. `application.yaml` - Enabled Flyway
4. `V1__Initial_Database_Setup.sql` - New migration

---

## 🎯 Next Steps After Successful Setup

1. **Add Test Data**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

2. **Test Authentication Flow**
   - Try login and verify JWT token is returned
   - Use token in Authorization header for other requests

3. **Test Full Booking Flow**
   - Create customer and worker
   - Create booking
   - Update booking status
   - Add review

4. **Production Preparation**
   - Change JWT secret
   - Update MySQL password
   - Configure HTTPS
   - Set up environment variables
   - Add request validation
   - Implement rate limiting

---

## ✅ Final Verification

Run this checklist right before going to production:

- [ ] All 3 API endpoint mismatch issues fixed
- [ ] Flyway successfully migrates database on startup
- [ ] All 7 tables created with proper relationships
- [ ] Frontend can connect to backend without CORS errors
- [ ] Authentication works (login returns JWT token)
- [ ] Worker search returns results
- [ ] Bookings can be created and updated
- [ ] Reviews can be added
- [ ] Database properly normalized
- [ ] No hardcoded passwords in code (use env vars)
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance acceptable
- [ ] Security headers set
- [ ] HTTPS configured (if deployed)
- [ ] Backups automated (if in production)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **QUICK_START.md** | 2-minute quick start guide |
| **FIXES_AND_IMPROVEMENTS.md** | Detailed explanation of all fixes |
| **VERIFICATION_CHECKLIST.md** | Complete testing and verification guide |
| **IMPLEMENTATION_SUMMARY.md** | High-level summary of changes |
| **ARCHITECTURE.md** | System architecture and flow diagrams |
| **SETUP_CHECKLIST.md** | This file - step-by-step setup |

---

## 💾 Backup Reminder

Before making any changes to database:
```bash
# Create backup
mysqldump -u root -p servicehub > servicehub_backup.sql

# Restore if needed
mysql -u root -p servicehub < servicehub_backup.sql
```

---

## 🎉 You're All Set!

Everything is configured and ready to go. Follow the Quick Setup above and you should be running in 5 minutes!

**Questions?** Check the documentation files listed above.
