import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from './auth';

const prisma = new PrismaClient();
export const visionRouter = Router();

const visionSchema = z.object({
  learn: z.string().optional(),
  have: z.string().optional(),
  be: z.string().optional(),
  try: z.string().optional(),
  see: z.string().optional(),
  do: z.string().optional(),
  go: z.string().optional(),
  create: z.string().optional(),
  contribute: z.string().optional(),
  overcome: z.string().optional(),
  oneDay: z.string().optional(),
});

visionRouter.post('/', requireAuth, async (req: any, res) => {
  const parse = visionSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const data = parse.data;
  
  try {
    const vision = await prisma.vision.create({ data: { ...data, userId: req.userId } });
    res.json(vision);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save vision' });
  }
});

visionRouter.get('/latest', requireAuth, async (req: any, res) => {
  const vision = await prisma.vision.findFirst({
    where: { userId: req.userId },
    orderBy: { createdAt: 'desc' },
  });
  res.json(vision);
});



