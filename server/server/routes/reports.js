const router = require('express').Router();
const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient();             


router.post('/', async (req, res) => {
  const report = await prisma.report.create({
    data: {
      reason: req.body.reason,
      targetId: req.body.targetId,
      reportType: req.body.reportType,
      reporterId: req.user.id 
    }
  });
  res.status(201).json(report);
});


router.get('/my-reports', async (req, res) => {
  const reports = await prisma.report.findMany({
    where: { reporterId: req.user.id } 
  });
  res.json(reports);
});

module.exports = router;