import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { Files, Fields } from 'formidable';
import FormData from 'form-data';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiToken = process.env.AUDD_API_TOKEN;
  if (!apiToken) {
    return res.status(500).json({ error: 'AudD API key not configured.' });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      return res.status(400).json({ error: 'Error parsing form data' });
    }
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(file.filepath), file.originalFilename);
      formData.append('api_token', apiToken);
      const apiRes = await fetch('https://api.audd.io/', {
        method: 'POST',
        body: formData as any,
        headers: formData.getHeaders(),
      });
      const data = await apiRes.json();
      console.log("AudD API response:", data);
      res.status(200).json(data);
    } catch (err) {
      console.error('AudD error:', err);
      res.status(500).json({ error: 'Failed to identify song' });
    }
  });
} 