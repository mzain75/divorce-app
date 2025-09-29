import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { validateEmail, validatePassword } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, gender, password, agreeToTerms } = body;

    // Validation
    if (!firstName || !lastName || !email || !gender || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with numbers and symbols' },
        { status: 400 }
      );
    }

    if (!agreeToTerms) {
      return NextResponse.json(
        { error: 'You must agree to the Terms & Conditions' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    
    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        gender,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user);

    // Create response with cookie
    const response = NextResponse.json(user);
    response.headers.set('Set-Cookie', setAuthCookie(token));

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}