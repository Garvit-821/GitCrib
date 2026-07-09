import handler from '../../api/index.ts';

export default async (req: Request) => {
  return handler(req);
};
