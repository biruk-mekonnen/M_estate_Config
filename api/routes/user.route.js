import express from 'express';
import {  test, updateUser, deleteUser, getUserListings, getUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.route('/:id')
  .get(verifyToken, getUser)
  .delete(verifyToken, deleteUser)
  .post(verifyToken, updateUser);

router.get('/listings/:id', verifyToken, getUserListings);
router.post('/update/:id', verifyToken, updateUser);

// improve readability and maintainabilit  by refactoring of the code while preserving the same output and functionality.