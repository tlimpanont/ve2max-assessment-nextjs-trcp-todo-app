import {z} from 'zod';
import {PrismaClient} from '@prisma/client';
import {publicProcedure, router} from "@/server/trpc";

const prisma = new PrismaClient();

export const taskRouter = router({
    getAll: publicProcedure.query(async () => {
        return prisma.task.findMany({})
    }),
    create: publicProcedure
        .input(z.object({title: z.string()}))
        .mutation(async ({input}) => {
            return prisma.task.create({
                data: {title: input.title},
            });
        }),
    update: publicProcedure
        .input(z.object({id: z.number(), completed: z.boolean()}))
        .mutation(async ({input}) => {
            return prisma.task.update({
                where: {id: input.id},
                data: {completed: input.completed},
            });
        }),
    delete: publicProcedure
        .input(z.object({id: z.number()}))
        .mutation(async ({input}) => {
            return prisma.task.delete({
                where: {id: input.id},
            });
        }),
});
