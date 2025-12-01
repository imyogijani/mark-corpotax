# Website Content Update Instructions

## 📝 How to Replace Website Content with Your Word Document

### Step 1: Update the Content Template
1. Open the file: `E:\Projects 2025\Fiannce-web\FinBest-Finance\backend\scripts\seed-new-content.js`
2. Replace all placeholders that start with `REPLACE_WITH_*` with actual content from your `website.docx` file

### Step 2: Content Sections to Replace

#### 🏠 HOMEPAGE CONTENT
- **Hero Section**: Update tagline, main title, description, and CTA text
- **Experience Section**: Update section tagline, title, description, and feature descriptions
- **Statistics**: Update years of experience, client count, office count, award count

#### ℹ️ ABOUT PAGE CONTENT  
- **Hero**: Update about page title and description
- **Mission/Vision**: Update mission and vision statements
- **Team Members**: Update team member names, titles, and bios

#### 🛠️ SERVICES PAGE CONTENT
- **Hero**: Update services page title and description  
- **Services List**: Update 6 service titles and descriptions:
  - Wealth Management
  - Retirement Planning
  - Investment Advice
  - Tax Planning
  - Estate Planning
  - Insurance & Risk Management

#### 📞 CONTACT PAGE CONTENT
- **Hero**: Update contact page title and description
- **Contact Info**: Update office address, phone numbers, email, and hours

#### 🌐 GLOBAL CONTENT
- **Company Info**: Update company name, tagline, description
- **Footer**: Update company description, address, contact info
- **Social Links**: Update social media URLs

### Step 3: Run the Update Script

After updating all the content in `seed-new-content.js`, run:

```bash
cd "E:\Projects 2025\Fiannce-web\FinBest-Finance\backend\scripts"
node seed-new-content.js
```

### Step 4: Verify Changes
1. The script will clear all existing content from the database
2. Insert your new content from the Word document
3. Check your website to see the updated content

### 🚨 Important Notes:
- A backup of your current content is saved as `seed-real-content.backup.js`
- Make sure to replace ALL placeholders with actual content
- If you need to restore, you can run the backup file: `node seed-real-content.backup.js`

### 📋 Example of What to Replace:
```javascript
// BEFORE:
tagline: "REPLACE_WITH_YOUR_TAGLINE_FROM_DOCX",

// AFTER (example):
tagline: "Financial Excellence",
```

### 🔄 To Restore Original Content:
If you need to go back to the original content:
```bash
node seed-real-content.backup.js
```