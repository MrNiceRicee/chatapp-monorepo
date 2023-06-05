import { type ZodError, z } from 'zod';

const serverSchema = z.object({
  SERVER_PORT: z.coerce.number().min(1).max(65535),
  SERVER_HOST: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
});

const clientSchema = z.object({
  VITE_SERVER_URL: z.string().url(),
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

export function clientEnv<T>(
  envProcess?: T extends ImportMeta['env'] ? T : z.infer<typeof clientSchema>,
): z.infer<typeof clientSchema> {
  const parse = clientSchema.safeParse(envProcess || process.env);

  if (!parse.success) {
    return validationError(parse.error) as never;
  }

  return parse.data;
}
