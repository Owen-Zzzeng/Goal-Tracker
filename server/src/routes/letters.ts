import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from './auth';

const prisma = new PrismaClient();
export const lettersRouter = Router();

const letterSchema = z.object({
  content: z.string().min(1),
  deliverOn: z.string().datetime(),
  deliveryEmail: z.string().email().optional(),
});

lettersRouter.post('/', requireAuth, async (req: any, res) => {
  const parse = letterSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { content, deliverOn, deliveryEmail } = parse.data;
  const letter = await prisma.futureLetter.create({
    data: { userId: req.userId, content, deliverOn: new Date(deliverOn), deliveryEmail },
  });
  res.json(letter);
});

lettersRouter.get('/', requireAuth, async (req: any, res) => {
  const letters = await prisma.futureLetter.findMany({
    where: { userId: req.userId },
    orderBy: { deliverOn: 'desc' },
  });
  res.json(letters);
});





