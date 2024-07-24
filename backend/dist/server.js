"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const shippingRateRoutes_1 = __importDefault(require("./routes/shippingRateRoutes"));
const postalZoneRoutes_1 = __importDefault(require("./routes/postalZoneRoutes"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./config/logger"));
const zipCodeDataRoutes_1 = __importDefault(require("./routes/zipCodeDataRoutes"));
// Load environment variables from .env file
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
    dotenv_1.default.config({ path: '.env.production' });
}
else {
    dotenv_1.default.config({ path: '.env.development' });
}
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    path: '/api/socket.io/',
    cors: {
        origin: '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
    },
});
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Allow all requests
app.use((0, compression_1.default)());
// Routes
app.use('/api/zipcodes/', zipCodeDataRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/shipping_rates', shippingRateRoutes_1.default);
app.use('/api/postal_zones', postalZoneRoutes_1.default);
app.use('/api/packages', (req, _res, next) => {
    req.io = io;
    next();
}, packageRoutes_1.default);
// Connect to the database and start the server
(0, database_1.connectDB)().then(() => {
    const PORT = process.env.PORT || 5100;
    server.listen(PORT, () => {
        logger_1.default.info(`Server running on port ${PORT}`);
    });
});
io.on('connection', (socket) => {
    logger_1.default.info('a user connected');
    socket.on('disconnect', () => {
        logger_1.default.info('user disconnected');
    });
});
