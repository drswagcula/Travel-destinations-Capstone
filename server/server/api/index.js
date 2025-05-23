const router = require("express").Router();
const prisma = require('../utils/prismaClient'); 
const { authenticateToken } = require('../middleware/auth'); 


router.use(async (req, res, next) => {
    if (req.user && req.user.id) { 
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.id
                },
                select: { id: true, email: true, username: true, role: true } 
            });

            if (!user) {
                
                console.warn(`Authenticated user ID ${req.user.id} not found in DB.`);
                return res.status(401).send('Invalid User / User not found.');
            }
            req.dbUser = user; 
            next();
        } catch (error) {
            console.error("Error in user verification middleware:", error);
            next(error); 
        }
    } else {
        
        next();
    }
});



router.use("/auth", require("../routes/auth"));
router.use("/destinations", require("../routes/destinations"));
router.use("/reviews", require("../routes/reviews"));
router.use("/reports", require("../routes/reports"));



router.use((req, res, next) => {
    const error = new Error('API Route Not Found');
    error.status = 404;
    next(error);
});

module.exports = router;