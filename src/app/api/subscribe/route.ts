import { NextRequest, NextResponse } from 'next/server';
import MailerLite from '@mailerlite/mailerlite-nodejs';

const mailerlite = new MailerLite({
    api_key: process.env.MAILERLITE_API_TOKEN || '',
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        const params: any = {
            email,
            groups: process.env.MAILERLITE_GROUP_ID ? [process.env.MAILERLITE_GROUP_ID] : [],
        };

        const response = await mailerlite.subscribers.createOrUpdate(params);

        return NextResponse.json({
            success: true,
            data: response.data
        });

    } catch (error: any) {
        console.error('MailerLite Error:', error);

        const errorMessage = error.response?.data?.message || 'Something went wrong';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
