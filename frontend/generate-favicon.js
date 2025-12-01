const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFavicon() {
  try {
    // Check if favicon.png exists (the user's uploaded file)
    const faviconPngPath = path.join(__dirname, 'public', 'favicon.png');
    const faviconIcoPath = path.join(__dirname, 'public', 'favicon.ico');
    const appFaviconPath = path.join(__dirname, 'src', 'app', 'favicon.ico');
    
    let inputFile = faviconPngPath;
    
    // If user's favicon.png doesn't exist, use the logo as fallback
    if (!fs.existsSync(faviconPngPath)) {
      inputFile = path.join(__dirname, 'public', 'logo', 'Mark Corpotax x11 Clear BG.png');
      console.log('Using logo file as favicon source...');
    } else {
      console.log('Using uploaded favicon.png...');
    }
    
    // Create multiple sizes for ICO file (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const buffers = [];
    
    for (const size of sizes) {
      const buffer = await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
        })
        .png()
        .toBuffer();
      buffers.push(buffer);
    }
    
    // For now, just use the 32x32 version as favicon.ico
    await sharp(inputFile)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(faviconIcoPath);
    
    console.log('✅ Favicon generated successfully!');
    console.log(`📁 Created: ${faviconIcoPath}`);
    
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
  }
}

createFavicon();