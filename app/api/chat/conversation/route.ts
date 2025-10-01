import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get or create active conversation for user
    let conversation = await db.conversation.findFirst({
      where: {
        userId: payload.userId,
        isActive: true,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      conversation = await db.conversation.create({
        data: {
          userId: payload.userId,
          title: 'New Chat',
          isActive: true,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Delete all messages in active conversation
    await db.message.deleteMany({
      where: {
        conversation: {
          userId: payload.userId,
          isActive: true,
        },
      },
    });

    // Create new conversation
    const newConversation = await db.conversation.create({
      data: {
        userId: payload.userId,
        title: 'New Chat',
        isActive: true,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error('Error clearing conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}