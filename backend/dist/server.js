"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const packageRoutes_1 = __importDefault(require("./routes/packageRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const shippingRateRoutes_1 = __importDefault(require("./routes/shippingRateRoutes"));
const postalZoneRoutes_1 = __importDefault(require("./routes/postalZoneRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
    dotenv_1.default.config({ path: '.env.production' });
}
else {
    dotenv_1.default.config({ path: '.env.development' });
}
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/packages', packageRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/shipping_rates', shippingRateRoutes_1.default); // Add this line
app.use('/api/postal_zones', postalZoneRoutes_1.default);
// Connect to the database and start the server
(0, database_1.connectDB)().then(() => {
    const PORT = process.env.PORT || 5100;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
