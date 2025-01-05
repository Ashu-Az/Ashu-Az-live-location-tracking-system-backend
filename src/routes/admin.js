// src/routes/admin.js
import express from 'express';
import { getAllUsers, getActiveUsers, exportUserLocations } from '../controllers/adminController.js';
import { auth } from '../middleware/auth.js';
import { adminAuth } from '../middleware/admin.js';
import { Location } from '../models/Location.js';

const router = express.Router();

router.get('/users', auth, adminAuth, getAllUsers);
router.get('/locations/:userId', auth, adminAuth, async (req, res) => {
 try {
   const { userId } = req.params;
   const { startDate, endDate } = req.query;
   
   const locations = await Location.find({
     userId,
     timestamp: {
       $gte: new Date(startDate || Date.now() - 24*60*60*1000),
       $lte: new Date(endDate || Date.now())
     }
   }).sort({ timestamp: -1 });
   
   res.json(locations);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});
router.get('/export/:userId', auth, adminAuth, exportUserLocations);
router.get('/active-users', auth, adminAuth, getActiveUsers);

export default router;