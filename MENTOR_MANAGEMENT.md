# 👥 Mentor Management Guide

## 🔐 Security System Overview

The BUSA Speaking Club admin system uses a **secure two-layer mentor verification**:

1. **Database Role**: Stored in Firestore users collection (`role: 'mentor'`)
2. **Security Rules**: Hardcoded email list in `firestore.rules`

**Both layers must match for full admin access!**

---

## ➕ Adding New Mentors

### Step 1: Create Account via Setup Page
1. Go to `/setup` page
2. Add new mentor credentials:
   - Email: `new-mentor@busa.kr`
   - Password: Strong password
   - Name: Full name
3. Click "Create All Accounts"
4. ✅ **Database role is automatically set to 'mentor'**

### Step 2: Update Security Rules
1. Open `uzkorea-speak-club/firestore.rules`
2. Find the `isMentor()` function (around line 7)
3. Add the new email to the list:
   ```javascript
   function isMentor() {
     return request.auth != null && 
       request.auth.token.email in [
         // Original mentors
         'aziz.karimov@busa.kr',
         'malika.uzbekova@busa.kr', 
         'bekzod.tashkentov@busa.kr',
         'admin@busa.kr',
         'alexnabiyev5@gmail.com',
         // New mentors
         'new-mentor@busa.kr'  // ← Add here
       ];
   }
   ```
4. Save the file
5. Deploy rules: `firebase deploy --only firestore:rules`
6. ✅ **Security permissions updated**

### Step 3: Test Access
- New mentor can now:
  - Login at `/login`
  - Access admin dashboard at `/admin`
  - Manage all admin functions

---

## 🔧 Alternative: Promote Existing Users

If someone already has an account but isn't a mentor:

### Method 1: Via User Manager (Requires existing mentor)
1. Login as existing mentor
2. Go to **User Manager** in admin dashboard
3. Find the user and click "Edit Role"
4. Change role to "Mentor"
5. **Still need to add email to security rules (Step 2 above)**

### Method 2: Manual Database Update
1. Go to Firebase Console → Firestore
2. Find the user in `users` collection
3. Update `role` field to `'mentor'`
4. **Still need to add email to security rules (Step 2 above)**

---

## 🚨 Security Notes

- **Never commit sensitive emails** to public repositories
- **Always use strong passwords** for mentor accounts
- **Test new mentor access** before sharing credentials
- **Remove mentors** by deleting from both database and rules
- **Backup before making changes** to security rules

---

## 📋 Current Mentors

- aziz.karimov@busa.kr
- malika.uzbekova@busa.kr
- bekzod.tashkentov@busa.kr
- admin@busa.kr
- alexnabiyev5@gmail.com

**Last Updated**: $(date)

---

## 🆘 Troubleshooting

### "Missing or insufficient permissions" error:
- Check if email is in `firestore.rules`
- Verify rules are deployed: `firebase deploy --only firestore:rules`
- Check user role in Firestore database

### New mentor can't access admin:
- Verify email exactly matches in rules (case-sensitive)
- Check account exists and role is 'mentor'
- Try logging out and back in

### Rules deployment fails:
- Check syntax in `firestore.rules`
- Verify Firebase CLI is authenticated: `firebase login`
- Check project is correct: `firebase use --list` 