// client.ts
import type { App } from '@/app/api/[[...slug]]/route';
import { treaty } from '@elysiajs/eden';

const enviroment = String(process.env['NEXT_PUBLIC_ENVIRONMENT']);
export const client = treaty<App>(enviroment);
