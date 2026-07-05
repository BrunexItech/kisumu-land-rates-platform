import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.POSTGRES_DB || 'kisumu_rates',
  process.env.POSTGRES_USER || 'kisumu_user',
  process.env.POSTGRES_PASSWORD || 'secure_password_here',
  {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: process.env.POSTGRES_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

export default sequelize;