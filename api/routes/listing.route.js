import express from 'express';
import { createListing, deleteListing, updateListing,getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.route('/:id')
  .get(verifyToken, getUser)
  .delete(verifyToken, deleteUser)
  .post(verifyToken, updateUser);
router.get('/listings/:id', verifyToken, getUserListings);
router.post('/update/:id', verifyToken, updateUser);

export default router;
