import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import tenantRoutes from './routes/tenantRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedData } from './data/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Seed data on startup
seedData();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/tenants', tenantRoutes);

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});