import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { User, type IUser } from '../models/User.js';
import { hashPassword, comparePassword, signJwt } from '../utils/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { ENV } from '../config/env.js';

// In-memory fallback user store when MongoDB is offline/unconfigured
const inMemoryUsers: Map<string, any> = new Map([
  [
    '9876543210',
    {
      _id: '6738c8f0e14a1234567890ab',
      name: 'Ramesh Dattatray Gaikwad',
      nameMr: 'रमेश दत्तात्रय गायकवाड',
      phone: '9876543210',
      email: 'ramesh.gaikwad@gramsathi.in',
      district: 'Pune',
      taluka: 'Baramati',
      village: 'Malegaon Budruk (माळेगाव बुद्रुक)',
      preferredLanguage: 'mr',
      interests: ['agri', 'solar', 'housing'],
      role: 'citizen',
      gender: 'Male',
      occupation: 'Farmer / Shetkari (Small Farmer, 2.5 Acres)',
      landholdingAcres: 2.5,
      socialCategory: 'OBC',
      passwordHash: '$2a$10$WkL6L8hQZp0wZ65aWfG1v.g6JqN8.s5VzB6H5Z7R5z4q3v2u1t0s.', // bcrypt hash for 'demo123'
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
]);

export const RegisterSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    nameMr: z.string().optional(),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit mobile number').optional(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
    district: z.string().min(1, 'District is required').default('Pune'),
    taluka: z.string().min(1, 'Taluka is required').default('Baramati'),
    village: z.string().optional(),
    preferredLanguage: z.enum(['mr', 'hi', 'en']).default('mr'),
    interests: z.array(z.string()).default(['agri', 'solar', 'housing']),
    role: z.enum(['citizen', 'vle']).default('citizen'),
    gender: z.string().optional(),
    occupation: z.string().optional(),
    landholdingAcres: z.number().min(0).optional(),
    socialCategory: z.string().optional(),
  })
  .refine((data) => !!data.phone || !!data.email, {
    message: 'Either phone number or email address must be provided',
    path: ['phone'],
  });

export const LoginSchema = z.object({
  identifier: z.string().min(3, 'Phone number or email required'),
  password: z.string().optional(),
  authMode: z.enum(['mobile', 'aadhaar', 'email']).optional(),
  otp: z.string().optional(),
});

function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export class AuthController {
  /**
   * Register a new citizen or VLE account
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const cleanPhone = data.phone?.trim();
      const cleanEmail = data.email?.toLowerCase().trim();

      // Check duplicate accounts
      if (isDbConnected()) {
        const query: any[] = [];
        if (cleanPhone) query.push({ phone: cleanPhone });
        if (cleanEmail) query.push({ email: cleanEmail });

        const existing = await User.findOne({ $or: query });
        if (existing) {
          sendError(
            res,
            'An account with this mobile number or email already exists. Please sign in.',
            'ACCOUNT_ALREADY_EXISTS',
            409
          );
          return;
        }
      } else {
        if ((cleanPhone && inMemoryUsers.has(cleanPhone)) || (cleanEmail && inMemoryUsers.has(cleanEmail))) {
          sendError(
            res,
            'An account with this mobile number or email already exists. Please sign in.',
            'ACCOUNT_ALREADY_EXISTS',
            409
          );
          return;
        }
      }

      const rawPassword = data.password || 'citizenPass2026!';
      const passwordHash = await hashPassword(rawPassword);

      let savedUser: any;

      if (isDbConnected()) {
        const userDoc = new User({
          name: data.name,
          phone: cleanPhone,
          email: cleanEmail,
          passwordHash,
          district: data.district,
          taluka: data.taluka,
          village: data.village || '',
          preferredLanguage: data.preferredLanguage || 'mr',
          interests: data.interests || ['agri', 'solar', 'housing'],
          role: data.role || 'citizen',
          gender: data.gender || 'Male',
          occupation: data.occupation || 'Farmer',
          landholdingAcres: data.landholdingAcres ?? 2.5,
          socialCategory: data.socialCategory || 'OBC',
        });
        savedUser = await userDoc.save();
      } else {
        // In-memory mock
        const newId = new mongoose.Types.ObjectId().toString();
        savedUser = {
          _id: newId,
          name: data.name,
          phone: cleanPhone,
          email: cleanEmail,
          passwordHash,
          district: data.district,
          taluka: data.taluka,
          village: data.village || '',
          preferredLanguage: data.preferredLanguage || 'mr',
          interests: data.interests || ['agri', 'solar', 'housing'],
          role: data.role || 'citizen',
          gender: data.gender || 'Male',
          occupation: data.occupation || 'Farmer',
          landholdingAcres: data.landholdingAcres ?? 2.5,
          socialCategory: data.socialCategory || 'OBC',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        if (cleanPhone) inMemoryUsers.set(cleanPhone, savedUser);
        if (cleanEmail) inMemoryUsers.set(cleanEmail, savedUser);
      }

      const token = signJwt({
        userId: savedUser._id.toString(),
        role: savedUser.role,
        phone: savedUser.phone,
        email: savedUser.email,
        name: savedUser.name,
      });

      // Never expose password hash in response
      const safeUser = {
        id: savedUser._id.toString(),
        name: savedUser.name,
        phone: savedUser.phone,
        email: savedUser.email,
        district: savedUser.district,
        taluka: savedUser.taluka,
        village: savedUser.village,
        preferredLanguage: savedUser.preferredLanguage,
        interests: savedUser.interests,
        role: savedUser.role,
        gender: savedUser.gender,
        occupation: savedUser.occupation,
        landholdingAcres: savedUser.landholdingAcres,
        socialCategory: savedUser.socialCategory,
        createdAt: savedUser.createdAt,
      };

      // Set secure HTTP-only cookie if compatible
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { user: safeUser, token }, { message: 'Registration successful' }, 201);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Sign in an existing citizen
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { identifier, password, otp } = req.body;
      const cleanId = (identifier || '').trim();

      let user: any = null;

      if (isDbConnected()) {
        user = await User.findOne({
          $or: [{ phone: cleanId }, { email: cleanId.toLowerCase() }],
        }).select('+passwordHash');
      } else {
        user = inMemoryUsers.get(cleanId) || inMemoryUsers.get(cleanId.toLowerCase());
      }

      if (!user) {
        // If demo citizen default
        if (cleanId === '9876543210' || cleanId.includes('98765')) {
          user = inMemoryUsers.get('9876543210');
        } else {
          sendError(res, 'No registered account found with this phone number or email', 'USER_NOT_FOUND', 404);
          return;
        }
      }

      // If password provided, verify hash
      if (password && user.passwordHash) {
        const matches = await comparePassword(password, user.passwordHash);
        if (!matches) {
          sendError(res, 'Incorrect password. Please verify credentials.', 'INVALID_CREDENTIALS', 401);
          return;
        }
      } else if (otp) {
        if (ENV.IS_PROD) {
          sendError(
            res,
            'Live SMS OTP verification gateway is currently not configured for production. Please sign in with your registered account password.',
            'LIVE_OTP_NOT_CONFIGURED',
            503
          );
          return;
        }
        // In demonstration civic mode, acknowledge OTP
        if (otp.replace(/\D/g, '').length < 4) {
          sendError(res, 'Please enter a valid verification code', 'INVALID_OTP', 400);
          return;
        }
      }

      const token = signJwt({
        userId: user._id.toString(),
        role: user.role,
        phone: user.phone,
        email: user.email,
        name: user.name,
      });

      const safeUser = {
        id: user._id.toString(),
        name: user.name,
        nameMr: user.nameMr,
        phone: user.phone,
        email: user.email,
        district: user.district,
        taluka: user.taluka,
        village: user.village,
        preferredLanguage: user.preferredLanguage,
        interests: user.interests,
        role: user.role,
        gender: user.gender,
        occupation: user.occupation,
        landholdingAcres: user.landholdingAcres,
        socialCategory: user.socialCategory,
        createdAt: user.createdAt,
      };

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { user: safeUser, token }, { message: 'Authentication successful' });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get authenticated user profile (/api/auth/me)
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authUser = req.user;
      if (!authUser) {
        sendError(res, 'Unauthorized', 'UNAUTHORIZED', 401);
        return;
      }

      let user: any = null;

      if (isDbConnected()) {
        user = await User.findById(authUser.userId);
      } else {
        const found = Array.from(inMemoryUsers.values()).find(
          (u) => u._id.toString() === authUser.userId || u.phone === authUser.phone
        );
        user = found || inMemoryUsers.get('9876543210');
      }

      if (!user) {
        sendError(res, 'User record not found', 'USER_NOT_FOUND', 404);
        return;
      }

      const safeUser = {
        id: user._id.toString(),
        name: user.name,
        nameMr: user.nameMr,
        phone: user.phone,
        email: user.email,
        district: user.district,
        taluka: user.taluka,
        village: user.village,
        preferredLanguage: user.preferredLanguage,
        interests: user.interests,
        role: user.role,
        gender: user.gender,
        occupation: user.occupation,
        landholdingAcres: user.landholdingAcres,
        socialCategory: user.socialCategory,
        createdAt: user.createdAt,
      };

      sendSuccess(res, { user: safeUser });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Sign out current user
   */
  static async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('token');
    sendSuccess(res, { loggedOut: true }, { message: 'Successfully signed out' });
  }
}

