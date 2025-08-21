# Environment Switching Guide

This guide explains how to easily switch between development and production environments.

## Quick Switch

To switch between environments, edit the `src/config.ts` file:

### For LOCALHOST Development:
```typescript
// For LOCALHOST development:
export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';

// For PRODUCTION:
// export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';
```

### For PRODUCTION:
```typescript
// For LOCALHOST development:
// export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';

// For PRODUCTION:
export const API_BASE_URL = 'https://extrahandbackend.llp.trizenventures.com';
```

## What Changes

When you switch the API_BASE_URL:

1. **Frontend API calls** will point to the correct backend
2. **Authentication tokens** will be properly passed to the backend
3. **Development banner** will show/hide automatically
4. **Mock data fallback** will work in development mode
5. **Feature flags** will be set appropriately

## Authentication Flow

### Development Mode (localhost):
- Uses Firebase authentication
- Passes auth tokens to localhost backend
- Falls back to mock data if backend is unavailable
- Shows development banner

### Production Mode:
- Uses Firebase authentication
- Passes auth tokens to production backend
- No fallback to mock data
- No development banner

## Data Management

### MongoDB Integration:
- All data operations go through the configured backend
- Authentication ensures proper user context
- Data is stored in MongoDB with proper user associations
- Profile and task data is maintained consistently

### Development vs Production Data:
- **Development**: Uses local MongoDB instance
- **Production**: Uses production MongoDB instance
- Both maintain the same data schema
- Authentication ensures data isolation

## Testing

### Local Development:
1. Set API_BASE_URL to localhost
2. Start local backend: `cd BackendEH && npm run dev`
3. Start frontend: `npm run web:dev`
4. Verify development banner appears
5. Test with real backend data

### Production Testing:
1. Set API_BASE_URL to production
2. Build and deploy: `npm run build:web`
3. Verify no development banner
4. Test with production backend

## Troubleshooting

### Backend Not Available:
- Development mode will show mock data
- Check backend server status
- Verify API_BASE_URL is correct

### Authentication Issues:
- Check Firebase configuration
- Verify auth tokens are being passed
- Check backend authentication middleware

### Data Not Syncing:
- Verify MongoDB connection
- Check authentication context
- Ensure proper user associations

## Files Modified

- `src/config.ts` - Main configuration file
- `src/api.ts` - API client with authentication
- `src/components/DevModeBanner.tsx` - Development mode indicator
- `src/PerformerHomeScreen.tsx` - Uses feature flags

## Best Practices

1. **Always test both environments** before deployment
2. **Keep localhost backend running** during development
3. **Use feature flags** for environment-specific behavior
4. **Maintain consistent data schema** across environments
5. **Monitor authentication flow** in both modes
