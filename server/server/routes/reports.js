const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/permissions');


router.post('/', authenticateToken, async (req, res, next) => {
    try {
        const { targetId, reportType, reason } = req.body; 
        const reporterId = req.user.id;

        if (!targetId || !reportType || !reason) {
            return res.status(400).send('Target ID, report type, and reason are required.');
        }

        
        if (!['destination', 'review'].includes(reportType)) {
            return res.status(400).send('Invalid report type. Must be "destination" or "review".');
        }

        
        let targetExists = false;
        if (reportType === 'destination') {
            const dest = await prisma.destination.findUnique({ where: { id: targetId } });
            if (dest) targetExists = true;
        } else if (reportType === 'review') {
            const review = await prisma.review.findUnique({ where: { id: targetId } });
            if (review) targetExists = true;
        }

        if (!targetExists) {
            return res.status(404).send('The item you are trying to report does not exist.');
        }

        const newReport = await prisma.report.create({
            data: {
                reporterId,
                targetId,
                reportType,
                reason,
                status: 'pending'
            }
        });
        res.status(201).json(newReport);
    } catch (error) {
        next(error);
    }
});


router.get('/', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const reports = await prisma.report.findMany({
            include: {
                reporter: {
                    select: { id: true, username: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(reports);
    } catch (error) {
        next(error);
    }
});


router.put('/:id/status', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status || !['pending', 'resolved'].includes(status)) {
            return res.status(400).send('Invalid status. Must be "pending" or "resolved".');
        }

        const updatedReport = await prisma.report.update({
            where: { id },
            data: { status }
        });
        res.json(updatedReport);
    } catch (error) {
        next(error);
    }
});


router.delete('/:id', authenticateToken, authorizeRole(['admin']), async (req, res, next) => {
    try {
        const { id } = req.params;
        await prisma.report.delete({
            where: { id }
        });
        res.status(204).send(); 
    } catch (error) {
        next(error);
    }
});

module.exports = router;