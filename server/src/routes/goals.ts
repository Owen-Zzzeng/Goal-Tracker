import { Router } from 'express';
import { PrismaClient, Status } from '@prisma/client';
import { z } from 'zod';
import { requireAuth } from './auth';

const prisma = new PrismaClient();
export const goalsRouter = Router();

const goalSchema = z.object({
  title: z.string().min(1),
  why: z.string().optional(),
  expectedCompletionDate: z.string().datetime(),
  strategies: z
    .array(
      z.object({
        title: z.string().min(1),
        actions: z.array(z.object({ description: z.string().min(1) })).max(10).optional(),
      })
    )
    .max(10)
    .optional(),
});

goalsRouter.post('/', requireAuth, async (req: any, res) => {
  try {
    console.log('Creating goal with data:', req.body);
    
    const { title, why, expectedCompletionDate, strategies } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Count only active goals (not COMPLETE)
    const activeGoalCount = await prisma.goal.count({ 
      where: { 
        userId: req.userId,
        status: { not: Status.COMPLETE }
      } 
    });
    if (activeGoalCount >= 5) return res.status(400).json({ error: 'You already have 5 active goals. Please complete at least one goal before adding a new one.' });

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        title,
        why,
        expectedCompletionDate: new Date(expectedCompletionDate),
        status: Status.UNBEGUN,
        strategies: strategies && strategies.length > 0
          ? {
              create: strategies.map((s: any) => ({
                title: s.title,
                status: Status.UNBEGUN,
                actions: s.actions && s.actions.length > 0 
                  ? { create: s.actions.map((a: any) => ({ 
                      description: a.description,
                      status: Status.UNBEGUN 
                    })) } 
                  : undefined,
              })),
            }
          : undefined,
      },
      include: { strategies: { include: { actions: true } } },
    });
    
    console.log('Goal created successfully:', goal);
    res.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

goalsRouter.get('/', requireAuth, async (req: any, res) => {
  try {
    console.log('Loading goals for user:', req.userId);
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      include: { strategies: { include: { actions: true } }, milestones: true },
      orderBy: { createdAt: 'desc' },
    });
    console.log('Found goals:', goals);
    res.json(goals);
  } catch (error) {
    console.error('Error loading goals:', error);
    res.status(500).json({ error: 'Failed to load goals' });
  }
});

const statusSchema = z.object({ status: z.enum(['UNBEGUN', 'IN_PROGRESS', 'PAUSED', 'COMPLETE']) });

goalsRouter.patch('/:goalId/status', requireAuth, async (req: any, res) => {
  const { goalId } = req.params;
  const parse = statusSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const next = parse.data.status as Status;
  const data: any = { status: next };
  if (next === 'IN_PROGRESS') data.startDate = new Date();
  if (next === 'COMPLETE') data.completedAt = new Date();
  const goal = await prisma.goal.update({ where: { id: goalId, userId: req.userId }, data });
  res.json(goal);
});

const strategySchema = z.object({ title: z.string().min(1) });
goalsRouter.post('/:goalId/strategies', requireAuth, async (req: any, res) => {
  const { goalId } = req.params;
  const parse = strategySchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const strategy = await prisma.strategy.create({
    data: { goalId, title: parse.data.title, status: Status.UNBEGUN },
  });
  res.json(strategy);
});

const actionSchema = z.object({ description: z.string().min(1) });
goalsRouter.post('/strategies/:strategyId/actions', requireAuth, async (req: any, res) => {
  const { strategyId } = req.params;
  const parse = actionSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const action = await prisma.actionStep.create({
    data: { strategyId, description: parse.data.description, status: Status.UNBEGUN },
  });
  res.json(action);
});

const progressSchema = z.object({ status: z.enum(['UNBEGUN', 'IN_PROGRESS', 'PAUSED', 'COMPLETE']) });
goalsRouter.patch('/strategies/:strategyId/status', requireAuth, async (req: any, res) => {
  const { strategyId } = req.params;
  const parse = progressSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const next = parse.data.status as Status;
  const data: any = { status: next };
  if (next === 'IN_PROGRESS') data.startDate = new Date();
  if (next === 'COMPLETE') data.completedAt = new Date();
  const strategy = await prisma.strategy.update({ where: { id: strategyId }, data });
  res.json(strategy);
});

goalsRouter.patch('/actions/:actionId/status', requireAuth, async (req: any, res) => {
  const { actionId } = req.params;
  const parse = progressSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const next = parse.data.status as Status;
  const data: any = { status: next };
  if (next === 'IN_PROGRESS') data.startDate = new Date();
  if (next === 'COMPLETE') data.completedAt = new Date();
  const action = await prisma.actionStep.update({ where: { id: actionId }, data });
  res.json(action);
});

const milestoneSchema = z.object({ note: z.string().min(1) });
goalsRouter.post('/:goalId/milestones', requireAuth, async (req: any, res) => {
  const { goalId } = req.params;
  const parse = milestoneSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const ms = await prisma.milestone.create({ data: { goalId, note: parse.data.note } });
  // placeholder: send congratulations notification
  res.json(ms);
});

// Update entire milestones array
goalsRouter.patch('/:goalId/milestones', requireAuth, async (req: any, res) => {
  const { goalId } = req.params;
  const { milestones } = req.body;
  
  try {
    // First, delete all existing milestones for this goal
    await prisma.milestone.deleteMany({
      where: { goalId }
    });
    
    // Then create new milestones
    if (milestones && milestones.length > 0) {
      await prisma.milestone.createMany({
        data: milestones.map((milestone: any) => ({
          goalId,
          note: typeof milestone === 'string' ? milestone : milestone.text,
          reachedAt: new Date(milestone.timestamp || Date.now())
        }))
      });
    }
    
    // Return the updated goal with milestones
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
      include: { milestones: true }
    });
    
    res.json(goal);
  } catch (error) {
    console.error('Error updating milestones:', error);
    res.status(500).json({ error: 'Failed to update milestones' });
  }
});




