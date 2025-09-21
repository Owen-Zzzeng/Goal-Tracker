import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';

import { authRouter } from './routes/auth';
import { visionRouter } from './routes/vision';
import { goalsRouter } from './routes/goals';
import { summariesRouter } from './routes/summaries';
import { lettersRouter } from './routes/letters';

const app = express();
const prisma = new PrismaClient();

app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174'], 
  credentials: true 
}));
app.use(express.json());

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
});

app.use('/auth', authRouter);
app.use('/vision', visionRouter);
app.use('/goals', goalsRouter);
app.use('/summaries', summariesRouter);
app.use('/letters', lettersRouter);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});



