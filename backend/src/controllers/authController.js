import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { users } from '../data/seedData.js';

export const register = async (req, res) => {
  const { fullName, role, nationalId, phone, kraPin, username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    fullName,
    role,
    nationalId,
    phone,
    kraPin,
    username,
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(user);
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.status(201).json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }
  });
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }
  });
};

export const getMe = async (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    role: user.role
  });
};