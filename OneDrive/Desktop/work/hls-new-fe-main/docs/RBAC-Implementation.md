# Role-Based Access Control (RBAC) Implementation Guide

This guide outlines the implementation of a role-based access control system for the Health Hub Reels application. The system restricts access to certain pages and UI elements based on user roles.

## 1. File Structure

```
src/
  context/
    roles.ts               # Defines user role enum
    RBACContext.ts         # Creates the context and types
    RBACProvider.tsx       # Provider component for RBAC
    useRBAC.ts             # Hook for accessing RBAC context
  components/
    RoleBasedRoute.tsx     # Route component for role-based access
    Layout.tsx             # Layout with role-based navigation
  utils/
    navigation.tsx         # Role-specific navigation definitions
```

## 2. Key Components

### 2.1 Role Definition (`roles.ts`)

Defines all possible user roles in the application as an enum:

```tsx
export enum UserRole {
  PRINCIPAL = 'principal',
  WHOLESALER = 'wholesaler',
  BENFEK = 'benfek',
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}
```

### 2.2 RBAC Context and Provider

The context provides:
- `hasRole`: Function to check if a user has a specific role
- `userRole`: The current user's role
- `isLoading`: Loading state for role information

### 2.3 Role-Based Route Component

Extends the existing `ProtectedRoute` to restrict access based on user roles:

```tsx
<RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]} fallbackPath="/">
  <PrincipalHomepage />
</RoleBasedRoute>
```

### 2.4 Navigation Management

The `navigation.tsx` defines role-specific navigation items:
- `commonNavigation`: Available to all users
- `authenticatedNavigation`: For all authenticated users
- `roleNavigation`: Specific to each user role

## 3. Implementation Steps

### Step 1: Install Required Files

1. Copy the following files to your project:
   - `src/context/roles.ts`
   - `src/context/RBACContext.ts`
   - `src/context/RBACProvider.tsx`
   - `src/context/useRBAC.ts`
   - `src/components/RoleBasedRoute.tsx`
   - `src/utils/navigation.tsx`
   - Modified `src/App.tsx` and `src/components/Layout.tsx`

### Step 2: Update App.tsx

1. Wrap the application with the `RBACProvider`:

```tsx
<AuthWrapper>
  <RBACProvider>
    <Layout>
      {/* Routes */}
    </Layout>
  </RBACProvider>
</AuthWrapper>
```

2. Update routes to use `RoleBasedRoute` for role-specific pages:

```tsx
<Route path="/principal" element={
  <RoleBasedRoute allowedRoles={[UserRole.PRINCIPAL]} fallbackPath="/">
    <PrincipalHomepage />
  </RoleBasedRoute>
} />
```

### Step 3: Use RBAC in Components

1. Use the `useRBAC` hook to access role information:

```tsx
const { hasRole, userRole } = useRBAC();

// Conditionally render UI elements
{hasRole([UserRole.ADMIN, UserRole.PRINCIPAL]) && (
  <AdminFeature />
)}
```

## 4. Testing

1. Test all role-specific routes by:
   - Logging in as different user roles
   - Attempting to access restricted routes
   - Verifying proper redirects

## 5. Adding New Role-Based Features

To add a new role-restricted feature:

1. Add new routes in `App.tsx` using `RoleBasedRoute`
2. Add role-specific navigation items in `navigation.tsx`
3. Use `useRBAC().hasRole()` to conditionally render UI elements

## Notes

- The current implementation relies on the user role being stored in the `useStore()` state
- When updating the role or permissions system, update the `RBACProvider`
- Consider adding permission-based checks in the future for more granular control
