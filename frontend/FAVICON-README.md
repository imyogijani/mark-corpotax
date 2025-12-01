# Favicon Setup Instructions

## How to Replace Favicon with Your Custom Image

### Option 1: Use the Generation Script (Recommended)

1. **Place your favicon image** in the `frontend/public/` directory with the name `favicon.png`
2. **Run the generation script**:
   ```bash
   cd frontend
   node generate-favicon.js
   ```
3. **Restart the development server** to see the changes

### Option 2: Manual Replacement

1. **Convert your PNG to ICO format** using an online converter like:
   - https://favicon.io/
   - https://convertio.co/png-ico/

2. **Replace the file**:
   - Replace `frontend/public/favicon.ico`

3. **Clear browser cache** to see the changes immediately

### Current Configuration

Next.js automatically serves `favicon.ico` from the `public` directory. No additional configuration needed in `layout.tsx`.

### File Locations

- **Favicon file**: `frontend/public/favicon.ico`
- **Generation script**: `frontend/generate-favicon.js`

### Note

Only one favicon file is needed in the `public` directory. Next.js handles the rest automatically.