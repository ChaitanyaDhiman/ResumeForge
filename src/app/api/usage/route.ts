import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getRemainingOptimizations } from '@/lib/auth';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const remaining = await getRemainingOptimizations(session.user.id);

        return NextResponse.json({
            remaining,
            role: session.user.role,
            unlimited: remaining === null
        });
    } catch (error) {
        console.error('Error fetching usage:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
