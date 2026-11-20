import { Router } from 'express';
import { SchemeController } from '../controllers/schemeController.js';

const router = Router();

router.get('/categories', SchemeController.getCategories);
router.get('/departments', SchemeController.getDepartments);
router.get('/search', SchemeController.searchSchemes);
router.get('/', SchemeController.getSchemes);
router.get('/:id', SchemeController.getSchemeById);

export default router;
