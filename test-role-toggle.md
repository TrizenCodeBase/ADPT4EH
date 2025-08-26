# 🧪 Professional Role Toggle Test Guide

## ✅ **New Features Implemented:**

### 1. **Professional Role Toggle Component**
- **Location**: `ADPT4EH/src/components/ProfessionalRoleToggle.tsx`
- **Features**:
  - Professional design with better accessibility
  - Compact version for profile section (top-right corner)
  - Full version for home screens
  - Proper accessibility labels and roles
  - Smooth animations and visual feedback

### 2. **Profile Section Integration**
- **Location**: `ADPT4EH/src/ProfileScreen.tsx`
- **Features**:
  - Toggle positioned in top-right corner
  - Compact design that doesn't interfere with content
  - Role change triggers profile save
  - Automatic navigation to appropriate home screen

### 3. **Role-Based Home Screen Switching**
- **Location**: `ADPT4EH/src/SimpleNavigation.tsx`
- **Features**:
  - Automatic navigation when role changes
  - Seamless switching between PosterHome and PerformerHome
  - Maintains user context and state

## 🧪 **Testing Steps:**

### **Test 1: Profile Section Toggle**
1. **Navigate to Profile section**
2. **Look for toggle in top-right corner**
   - Should see "Role: [Poster/Performer]" with toggle buttons
   - Current role should be highlighted in yellow
3. **Click on different role**
   - Should see visual feedback
   - Profile should save automatically
   - Should navigate to appropriate home screen

### **Test 2: Home Screen Toggle**
1. **Go to PosterHome or PerformerHome**
2. **Find toggle in header menu**
3. **Click to change role**
   - Should switch to other home screen
   - Should maintain user context

### **Test 3: Accessibility**
1. **Use screen reader or keyboard navigation**
2. **Verify accessibility labels work**
3. **Check keyboard focus indicators**

### **Test 4: Mobile Responsiveness**
1. **Test on mobile devices**
2. **Verify toggle works on touch**
3. **Check positioning on different screen sizes**

## 🎯 **Expected Behavior:**

### **When User Changes to "Performer":**
- ✅ Profile saves with `roles: ['tasker']`
- ✅ Navigates to `PerformerHomeScreen`
- ✅ Shows performer-specific content and stats

### **When User Changes to "Poster":**
- ✅ Profile saves with `roles: ['poster']`
- ✅ Navigates to `PosterHomeScreen`
- ✅ Shows poster-specific content and stats

### **Visual Feedback:**
- ✅ Active role highlighted in yellow
- ✅ Smooth transitions
- ✅ Professional appearance
- ✅ Clear role labels

## 🔧 **Technical Implementation:**

### **Component Structure:**
```typescript
<ProfessionalRoleToggle 
  compact={true}  // For profile section
  onRoleChange={(role) => {
    // Handles role change and navigation
  }}
/>
```

### **Role Mapping:**
- **Poster** → `roles: ['poster']` → `PosterHomeScreen`
- **Performer** → `roles: ['tasker']` → `PerformerHomeScreen`

### **Navigation Logic:**
- Role change triggers profile save
- SimpleNavigation detects role change
- Automatic navigation to appropriate home screen
- Maintains user session and context

## ✅ **Success Criteria:**
- [ ] Toggle appears in profile section top-right corner
- [ ] Toggle works in home screen headers
- [ ] Role changes save to backend
- [ ] Navigation switches to correct home screen
- [ ] Visual feedback is clear and professional
- [ ] Accessibility features work properly
- [ ] Mobile responsiveness is good
- [ ] No console errors or warnings
