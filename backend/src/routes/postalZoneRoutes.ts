// backend/src/routes/postalZoneRoutes.ts
import { Router } from 'express';
import { getProposalByZip, getPostalZones, getPostalZoneById, getZoneByProposalAndZip } from '../controllers/postalZoneController';

const router = Router();

router.get('/', getPostalZones);
router.get('/get_proposal', getProposalByZip);
router.get('/get_zone', getZoneByProposalAndZip);
router.get('/:id', getPostalZoneById);


export default router;
