import fs from 'fs';
import path from 'path';

const src = path.resolve(process.cwd(), 'public');
const dest = path.resolve(process.cwd(), 'dist');

try {
    if (fs.existsSync(src)) {
        fs.cpSync(src, dest, { recursive: true });
        console.log('✓ Successfully created dist directory for Vercel deployment');
    }
} catch (error) {
    console.error('Warning: Failed to copy public to dist:', error);
}
