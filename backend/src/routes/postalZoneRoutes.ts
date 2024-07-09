// backend/src/routes/postalZoneRoutes.ts
import { Router } from 'express';
import { getPostalZoneByZip, getProposalByZip, getPostalZones, getPostalZoneById, getZoneByProposalAndZip } from '../controllers/postalZoneController';

const router = Router();

router.get('/', getPostalZones);
router.get('/get_post_zone', getPostalZoneByZip);
router.get('/get_zone', getZoneByProposalAndZip);
router.get('/:id', getPostalZoneById);


export default router;
