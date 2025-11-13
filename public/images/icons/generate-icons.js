import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputFile = path.join(__dirname, '/favicon.png');
const outputDir = path.join(__dirname, '/pwa');

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      await sharp(inputFile)
        .resize(size, size, {
          background: { r: 15, g: 23, b: 42, alpha: 1 },
          fit: 'contain',
        })
        .png()
        .toFile(outputFile);
      console.log(`Generated icon-${size}x${size}.png`);
    }

    // Generate favicon
    await sharp(inputFile)
      .resize(32, 32, {
        background: { r: 15, g: 23, b: 42, alpha: 1 },
        fit: 'contain',
      })
      .png()
      .toFile(path.join(outputDir, 'favicon.png'));
    console.log('Generated favicon.png');

    // Generate apple-touch-icon
    await sharp(inputFile)
      .resize(180, 180, {
        background: { r: 15, g: 23, b: 42, alpha: 1 },
        fit: 'contain',
      })
      .png()
      .toFile(path.join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
