// src/utils/encryption.utils.js
import crypto from 'crypto';

// Фіксований ключ з .env (32 байти для AES-256)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-32-char-secret-key-here!!';
const ALGORITHM = 'aes-256-cbc';

// Переконуємось що ключ правильної довжини
const KEY = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

/**
 * Шифрування тексту
 */
export function encrypt(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }

    try {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Повертаємо: iv:encrypted
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('❌ Помилка шифрування:', error);
        return text;
    }
}

/**
 * Дешифрування тексту
 */
export function decrypt(encryptedText) {
    if (!encryptedText || typeof encryptedText !== 'string') {
        return encryptedText;
    }

    // Перевіряємо чи це зашифрований текст
    if (!encryptedText.includes(':')) {
        return encryptedText;
    }

    try {
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('❌ Помилка дешифрування:', error);
        return encryptedText;
    }
}

/**
 * Шифрування вибіркових полів об'єкта
 */
export function encryptFields(obj, fields) {
    const result = { ...obj };

    fields.forEach(fieldPath => {
        const value = getNestedValue(result, fieldPath);
        if (value) {
            setNestedValue(result, fieldPath, encrypt(value));
        }
    });

    return result;
}

/**
 * Дешифрування вибіркових полів об'єкта
 */
export function decryptFields(obj, fields) {
    const result = { ...obj };

    fields.forEach(fieldPath => {
        const value = getNestedValue(result, fieldPath);
        if (value) {
            setNestedValue(result, fieldPath, decrypt(value));
        }
    });

    return result;
}

// Допоміжні функції для роботи з вкладеними об'єктами
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
        if (!current[key]) current[key] = {};
        return current[key];
    }, obj);
    target[lastKey] = value;
}

export default {
    encrypt,
    decrypt,
    encryptFields,
    decryptFields
};