# Password Reset API Documentation

## Forgot Password Flow

### 1. Request Password Reset

**Endpoint:** `POST /api/v1/auth/forgot-password`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "success": true,
    "resetToken": "abc123...xyz", // ONLY IN DEVELOPMENT - Send via email in production
    "email": "user@example.com",
    "message": "Password reset token generated"
  },
  "message": "Password reset token generated",
  "success": true
}
```

**Notes:**
- Token expires in 1 hour
- Old unused tokens are automatically deleted when a new one is generated
- Returns success even if email doesn't exist (security best practice)
- In production, the `resetToken` should be sent via email, not in the response

---

### 2. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`

**Request Body:**
```json
{
  "token": "abc123...xyz",
  "newPassword": "newSecurePassword123"
}
```

**Success Response (200):**
```json
{
  "statusCode": 200,
  "data": {
    "success": true,
    "message": "Password has been reset successfully"
  },
  "message": "Password has been reset successfully",
  "success": true
}
```

**Error Responses:**
- **400:** Invalid or expired reset token
- **400:** Reset token has already been used
- **400:** Password must be at least 6 characters

**Notes:**
- Token can only be used once
- All existing sessions are invalidated after password reset (user is logged out from all devices)
- Token expires after 1 hour

---

## Database Schema

```sql
CREATE TABLE password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token_hash (token_hash)
);
```

---

## Security Features

1. **Token Hashing:** Tokens are stored as SHA-256 hashes in the database
2. **Expiration:** Tokens expire after 1 hour
3. **Single Use:** Tokens can only be used once
4. **Old Token Cleanup:** Previous unused tokens are deleted when new ones are generated
5. **Session Invalidation:** All refresh tokens are deleted after password reset
6. **Email Privacy:** API doesn't reveal if an email exists in the system

---

## Example Usage (cURL)

### Request Password Reset:
```bash
curl -X POST http://localhost:3000/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Reset Password:
```bash
curl -X POST http://localhost:3000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your-reset-token-here",
    "newPassword": "newSecurePassword123"
  }'
```
