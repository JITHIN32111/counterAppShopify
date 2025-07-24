import express from 'express';
import {createTimer,getAllTimers,getTimer} from '../controllers/timerController.js';

const router = express.Router();


router.post('/timers', createTimer);
router.get('/', getTimer);
router.get('/all', getAllTimers);



export default router;