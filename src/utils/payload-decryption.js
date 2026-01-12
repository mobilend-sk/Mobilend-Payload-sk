// src/utils/payload-decryption.js
import { decrypt } from './encryption.utils.js';

const ORDER_ENCRYPTED_FIELDS = [
    'userData.firstName',
    'userData.lastName',
    'userData.email',
    'userData.phone',
    'userData.externalApplicantId',
    'clientDetail.streetName',
    'clientDetail.buildingNumber',
    'clientDetail.townName',
    'clientDetail.postCode',
    'clientDetail.cardHolder'
];

/**
 * Перевіряє чи значення зашифроване (формат: iv:encryptedData)
 */
function isEncrypted(value) {
    if (typeof value !== 'string' || !value) return false;
    
    const parts = value.split(':');
    if (parts.length !== 2) return false;
    
    const [iv, encryptedData] = parts;
    
    return iv.length === 32 && 
           encryptedData.length > 0 && 
           /^[0-9a-f]+$/i.test(iv) && 
           /^[0-9a-f]+$/i.test(encryptedData);
}

/**
 * Отримує значення за вкладеним шляхом
 */
function getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce((acc, key) => {
        return (acc && typeof acc === 'object') ? acc[key] : undefined;
    }, obj);
}

/**
 * Встановлює значення за вкладеним шляхом
 */
function setNestedValue(obj, path, value) {
    if (!obj || !path) return;
    
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    let target = obj;
    for (const key of keys) {
        if (!target[key] || typeof target[key] !== 'object') {
            target[key] = {};
        }
        target = target[key];
    }
    
    if (target && typeof target === 'object' && lastKey) {
        target[lastKey] = value;
    }
}

/**
 * Розшифровує всі зашифровані поля в документі
 */
export function decryptPayloadDoc(doc) {
    if (!doc) return doc;
    
    ORDER_ENCRYPTED_FIELDS.forEach(field => {
        try {
            const value = getNestedValue(doc, field);
            
            if (value && typeof value === 'string' && isEncrypted(value)) {
                const decrypted = decrypt(value);
                setNestedValue(doc, field, decrypted);
            }
        } catch (error) {
            console.error(`Error decrypting field ${field}:`, error.message);
        }
    });
    
    return doc;
}

/**
 * Hook для Payload - розшифровує один документ
 */
export const decryptAfterRead = ({ doc }) => {
    return decryptPayloadDoc(doc);
};

/**
 * Hook для Payload - розшифровує масив документів
 */
export const decryptAfterReadMany = ({ docs }) => {
    if (Array.isArray(docs)) {
        return docs.map(doc => decryptPayloadDoc(doc));
    }
    return docs;
};