# Keycloak Setup Guide for DocMan

This guide will walk you through setting up Keycloak for authentication in the DocMan application.

## Prerequisites

- Docker installed on your system
- DocMan application cloned and ready

## Step 1: Start Keycloak with Docker

Run Keycloak in a Docker container:

```bash
docker run -d \
  --name keycloak \
  -p 8180:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest \
  start-dev
```

This will:
- Start Keycloak on port 8180 (to avoid conflict with Spring Boot on 8080)
- Create an admin user with username `admin` and password `admin`
- Run in development mode

Wait a minute for Keycloak to fully start, then access the admin console at:
**http://localhost:8180**

## Step 2: Login to Keycloak Admin Console

1. Navigate to **http://localhost:8180**
2. Click on "Administration Console"
3. Login with:
   - Username: `admin`
   - Password: `admin`

## Step 3: Create a Realm

1. In the top-left corner, hover over "master" and click "Create Realm"
2. Set the realm name to: `docman`
3. Click "Create"

## Step 4: Create a Client for the Backend

1. In the left sidebar, click "Clients"
2. Click "Create client"
3. Configure the client:
   - **Client ID**: `docman`
   - **Client type**: `OpenID Connect`
   - Click "Next"

4. **Capability config**:
   - Enable "Client authentication"
   - Enable "Authorization"
   - Enable "Standard flow"
   - Enable "Direct access grants"
   - Click "Next"

5. **Login settings**:
   - **Root URL**: `http://localhost:8080`
   - **Home URL**: `http://localhost:8080`
   - **Valid redirect URIs**:
     - `http://localhost:8080/*`
     - `http://localhost:4200/*`
   - **Valid post logout redirect URIs**: `http://localhost:8080/*`
   - **Web origins**: `+` (this allows all origins from valid redirect URIs)
   - Click "Save"

6. Go to the "Credentials" tab
7. Copy the **Client secret**
8. Update `backend/src/main/resources/application.properties`:
   ```properties
   spring.security.oauth2.client.registration.keycloak.client-secret=YOUR_CLIENT_SECRET_HERE
   ```

## Step 5: Create a Client for the Frontend

1. In the left sidebar, click "Clients"
2. Click "Create client"
3. Configure the client:
   - **Client ID**: `docman-frontend`
   - **Client type**: `OpenID Connect`
   - Click "Next"

4. **Capability config**:
   - DISABLE "Client authentication" (this is a public client)
   - Enable "Standard flow"
   - Enable "Direct access grants"
   - Click "Next"

5. **Login settings**:
   - **Root URL**: `http://localhost:4200`
   - **Home URL**: `http://localhost:4200`
   - **Valid redirect URIs**:
     - `http://localhost:4200/*`
   - **Valid post logout redirect URIs**: `http://localhost:4200/*`
   - **Web origins**: `http://localhost:4200`
   - Click "Save"

## Step 6: Create Test Users

1. In the left sidebar, click "Users"
2. Click "Create new user"
3. Fill in the details:
   - **Username**: `testuser` (or your preferred username)
   - **Email**: `testuser@example.com`
   - **First name**: `Test`
   - **Last name**: `User`
   - **Email verified**: Toggle ON
   - Click "Create"

4. Set the user's password:
   - Go to the "Credentials" tab
   - Click "Set password"
   - Enter a password (e.g., `password`)
   - Set "Temporary" to OFF
   - Click "Save"
   - Confirm by clicking "Save password"

5. Repeat for additional test users as needed

## Step 7: Configure Client Scopes (Optional)

By default, Keycloak includes the necessary scopes (openid, profile, email). You can verify:

1. Go to "Client scopes" in the left sidebar
2. Ensure these scopes exist:
   - `openid`
   - `profile`
   - `email`

## Step 8: Verify Configuration

### Backend Configuration

Ensure your `backend/src/main/resources/application.properties` has:

```properties
# OAuth2/OIDC Configuration (Keycloak)
spring.security.oauth2.client.registration.keycloak.client-id=docman
spring.security.oauth2.client.registration.keycloak.client-secret=YOUR_CLIENT_SECRET
spring.security.oauth2.client.registration.keycloak.scope=openid,profile,email
spring.security.oauth2.client.registration.keycloak.authorization-grant-type=authorization_code
spring.security.oauth2.client.registration.keycloak.redirect-uri={baseUrl}/login/oauth2/code/{registrationId}

spring.security.oauth2.client.provider.keycloak.issuer-uri=http://localhost:8180/realms/docman
spring.security.oauth2.client.provider.keycloak.user-name-attribute=preferred_username

# Resource Server Configuration
spring.security.oauth2.resourceserver.jwt.issuer-uri=http://localhost:8180/realms/docman
spring.security.oauth2.resourceserver.jwt.jwk-set-uri=http://localhost:8180/realms/docman/protocol/openid-connect/certs
```

### Frontend Configuration

The frontend is already configured in `frontend/src/app/services/auth.service.ts`:

```typescript
private authConfig: AuthConfig = {
  issuer: 'http://localhost:8180/realms/docman',
  redirectUri: window.location.origin,
  clientId: 'docman-frontend',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  requireHttps: false
};
```

## Step 9: Test the Application

1. **Start Keycloak** (if not already running):
   ```bash
   docker start keycloak
   ```

2. **Start the Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Start the Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application**:
   - Open your browser to **http://localhost:4200**
   - You should see the login screen
   - Click "Sign in with Keycloak"
   - You'll be redirected to Keycloak login
   - Enter your test user credentials
   - You'll be redirected back to the application, now authenticated

5. **Create a Document**:
   - Click "+ New Document"
   - Enter a title and content
   - The document will be saved with your user information as the author

## Troubleshooting

### Keycloak Not Accessible

- Verify Keycloak is running: `docker ps | grep keycloak`
- Check logs: `docker logs keycloak`
- Try accessing: http://localhost:8180

### Invalid Redirect URI

- Ensure the redirect URIs in the Keycloak client configuration match exactly
- Check for trailing slashes
- Verify the port numbers are correct

### CORS Errors

- Ensure "Web origins" is set correctly in the Keycloak client
- Backend CORS configuration should allow `http://localhost:4200`

### Token Validation Errors

- Verify the issuer URI is correct
- Check that the realm name is `docman`
- Ensure the client secret matches in application.properties

### User Not Found

- Ensure the user is created in the `docman` realm (not the `master` realm)
- Verify email is marked as verified
- Check that the password is set and not temporary

## Production Considerations

For production deployment:

1. **Use HTTPS**:
   - Configure Keycloak with SSL certificates
   - Update `requireHttps: true` in the frontend auth config

2. **Secure Client Secret**:
   - Store the client secret in environment variables or a secrets manager
   - Never commit secrets to version control

3. **Database**:
   - Configure Keycloak to use a production database (PostgreSQL, MySQL)
   - Don't use the H2 development database

4. **Realm Configuration**:
   - Configure proper token expiration times
   - Set up email verification
   - Configure password policies
   - Enable MFA (Multi-Factor Authentication)

5. **User Management**:
   - Set up user registration if needed
   - Configure social login providers (Google, GitHub, etc.)
   - Implement proper user roles and permissions

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Spring Security OAuth2 Documentation](https://docs.spring.io/spring-security/reference/servlet/oauth2/index.html)
- [Angular OAuth2 OIDC Library](https://github.com/manfredsteyer/angular-oauth2-oidc)

## Docker Commands

Useful Docker commands for managing Keycloak:

```bash
# Stop Keycloak
docker stop keycloak

# Start Keycloak
docker start keycloak

# Remove Keycloak container
docker rm keycloak

# View Keycloak logs
docker logs -f keycloak

# Restart Keycloak
docker restart keycloak
```
