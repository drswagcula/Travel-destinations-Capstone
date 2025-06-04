const router = require('express').Router();
const prisma = require('../utils/prismaClient');
const { authenticateToken } = require('../middleware/auth');

const authRoutes = require('../routes/auth')
const destinationRoutes =  require('../routes/destinations')
const reviewRoutes = require('../routes/reviews')
const reportRoutes = require('../routes/reports')
const userRoutes = require('../routes/users')


router.use(async (req, res, next) => {
    try {
        
        if (!req.user?.id) return next();

        
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { 
                id: true, 
                email: true, 
                username: true, 
                role: true,
                isActive: true 
            }
        });

        if (!user) {
            console.warn(`Authenticated user not found in DB`, { 
                userId: req.user.id 
            });
            return res.status(401).json({ 
                error: 'Invalid user credentials',
                code: 'INVALID_USER'
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                error: 'Account deactivated',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        
        req.dbUser = user;
        next();
    } catch (error) {
        console.error('User verification error:', {
            error: error.message,
            userId: req.user?.id,
            path: req.path
        });
        next(error);
    }
});


//const apiRoutes = [
//    { path: '/auth', route: require('../routes/auth') },
//    { path: '/destinations', route: require('../routes/destinations') },
//    { path: '/reviews', route: require('../routes/reviews') },
//    { path: '/reports', route: require('../routes/reports') },
//    { path: userRoutes = require('../routes/users')}
//];


router.use('/auth', authRoutes); 
router.use('/users', userRoutes);
router.use('/destinations', destinationRoutes); 
router.use('/reviews', reviewRoutes); 
router.use('/reports', reportRoutes);

//apiRoutes.forEach(({ path, route }) => {
 //   router.use(path, route);
//});


router.use((req, res, next) => {
    res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        availableEndpoints: apiRoutes.map(r => r.path)
    });
});


router.use((error, req, res, next) => {
    const status = error.status || 500;
    const isProduction = process.env.NODE_ENV === 'production';

    console.error('API Error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        userId: req.user?.id
    });

    res.status(status).json({
        error: isProduction ? 'Internal server error' : error.message,
        ...(!isProduction && { details: error.stack }),
        ...(error.code && { code: error.code })
    });
});

module.exports = router;