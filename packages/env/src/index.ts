import { type ZodError, z } from 'zod';

const serverSchema = z.object({
  SERVER_PORT: z.string(),
  SERVER_HOST: z.string(),
});

function validationError(error: ZodError) {
  console.error('❌ Invalid environment variables:', error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export function serverEnv<T>(
  envProcess?: T extends NodeJS.ProcessEnv ? T : z.infer<typeof serverSchema>,
): z.infer<typeof serverSchema> {
  const parse = serverSchema.safeParse(envProcess || process.env);

  if (!parse.success) {
    return validationError(parse.error) as never;
  }

  return parse.data;
}
