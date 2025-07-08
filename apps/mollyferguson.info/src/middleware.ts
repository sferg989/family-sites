import type { MiddlewareHandler } from 'astro';

export const onRequest: MiddlewareHandler = async (context, next) => {
  const url = new URL(context.request.url);
  if (url.pathname !== '/' && 
      !url.pathname.endsWith('/') && 
      !url.pathname.startsWith('/_image')) {
    return context.redirect(`${url.pathname}/`);
  }
  return next();
};
