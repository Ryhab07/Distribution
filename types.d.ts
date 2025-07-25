// types.d.ts
import { NextApiRequest } from 'next';
import { File } from 'multer';

interface MulterRequest extends NextApiRequest {
  files: File[];
}
