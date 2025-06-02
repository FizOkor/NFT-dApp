// const fs = require('fs');
import fs from 'fs';
const path = '../dist';

if (!fs.existsSync(path)) {
  console.error('❌ Dist folder missing at:', path);
  process.exit(1);
}

console.log('✅ Dist folder verified at:', fs.realpathSync(path));
console.log('Contents:', fs.readdirSync(path));