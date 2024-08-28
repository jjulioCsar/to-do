// validators/validateID.js
import { check } from 'express-validator';

export const validateId = [
  check('id').isUUID().withMessage('Invalid ID format')
];
