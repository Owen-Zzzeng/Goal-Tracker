import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from './auth';

const prisma = new PrismaClient();
export const summariesRouter = Router();

const upsertSchema = z.object({
  year: z.number().int(),
  quarter: z.number().int().min(1).max(4),
  achievements: z.string().optional(),
  reflection: z.string().optional(),
});

summariesRouter.post('/', requireAuth, async (req: any, res) => {
  const parse = upsertSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { year, quarter, achievements, reflection } = parse.data;
  const summary = await prisma.quarterlySummary.upsert({
    where: { userId_year_quarter: { userId: req.userId, year, quarter } },
    update: { achievements, reflection },
    create: { userId: req.userId, year, quarter, achievements, reflection },
  });
  res.json(summary);
});

summariesRouter.get('/:year/:quarter', requireAuth, async (req: any, res) => {
  const year = Number(req.params.year);
  const quarter = Number(req.params.quarter);
  const summary = await prisma.quarterlySummary.findUnique({
    where: { userId_year_quarter: { userId: req.userId, year, quarter } },
  });
  res.json(summary);
});





