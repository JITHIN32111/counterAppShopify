import express from 'express';
import {createTimer,getAllTimers} from '../controllers/timerController.js';

const router = express.Router();


router.post('/timers', createTimer);
router.get('/getTimer', getAllTimers);


export default router;