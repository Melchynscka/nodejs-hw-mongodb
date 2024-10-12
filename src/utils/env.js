import dotenv from "dotenv";

dotenv.config();
console.log(process.env.SMTP_HOST); 
console.log('SMTP_HOST:', process.env.SMTP_HOST);  // Додайте це, щоб побачити значення

export function env(name, defaultValue) {
    const value = process.env[name];
    if (value) return value;
    if (defaultValue) return defaultValue;
    throw new Error(`Missing: process.env['${name}'].`);
  }