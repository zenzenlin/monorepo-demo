import { VueExecutorSchema } from './schema';

export default async function runExecutor(options: VueExecutorSchema) {
  console.log('Executor ran for Vue', options);
  return {
    success: true,
  };
}
