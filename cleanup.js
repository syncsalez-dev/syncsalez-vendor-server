const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const rootDir = path.resolve(__dirname); // Your project root directory

// List of directories and files to delete
const dirsToDelete = [
  'node_modules',
  'prisma/.prisma', // Prisma generated files
  'dist', // Build output folder
];

const filesToDelete = [
  'pnpm-lock.yaml', // pnpm lock file
  'package-lock.json', // npm lock file (if it exists)
  'yarn.lock', // yarn lock file (if it exists)
];

// Delete specified directories
dirsToDelete.forEach((dir) => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    rimraf.sync(dirPath); // Deletes the directory and its contents
    console.log(`Deleted: ${dirPath}`);
  }
});

// Delete specified files
filesToDelete.forEach((file) => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath); // Deletes the file
    console.log(`Deleted: ${filePath}`);
  }
});

console.log('Cleanup completed!');
