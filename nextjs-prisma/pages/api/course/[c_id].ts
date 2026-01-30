import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { c_id } = req.query;
    if (!c_id || Array.isArray(c_id)) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    const id = parseInt(c_id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid course id' });
    }
    const course = await prisma.course.findUnique({
        where: { c_id: id },
        select: {
            c_id: true,
            c_name: true,
            c_category: true,
            c_duration: true,
            c_price: true,
            c_description: true,
        },
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
}
