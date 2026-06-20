const { getStore } = require('@netlify/blobs');

const STORE_NAME = 'mmv-pdfs';
const INDEX_KEY = 'index.json';
const MAX_PDF_BYTES = 20 * 1024 * 1024;

function getPdfStore() {
  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN || process.env.NETLIFY_AUTH_TOKEN;
  if (siteID && token) return getStore({ name: STORE_NAME, siteID, token });
  return getStore(STORE_NAME);
}

function json(statusCode, payload) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(payload),
  };
}

function safeFilename(name) {
  return String(name || '')
    .split(/[\\/]/)
    .pop()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function decodeBase64Pdf(content) {
  const clean = String(content || '').includes(',')
    ? String(content).split(',', 2)[1]
    : String(content || '');
  const buffer = Buffer.from(clean, 'base64');
  if (!buffer.length || !buffer.subarray(0, 4).equals(Buffer.from('%PDF'))) {
    throw new Error('El archivo no parece ser un PDF válido.');
  }
  if (buffer.length > MAX_PDF_BYTES) {
    throw new Error('El PDF supera el máximo permitido de 20 MB.');
  }
  return buffer;
}

async function readIndex(store) {
  return (await store.get(INDEX_KEY, { type: 'json' })) || [];
}

exports.handler = async (event) => {
  const store = getPdfStore();
  const method = event.httpMethod;

  if (method === 'GET') {
    const params = event.queryStringParameters || {};
    if (params.file) {
      const index = await readIndex(store);
      const item = index.find((entry) => entry.id === params.file);
      if (!item) return json(404, { ok: false, error: 'PDF no encontrado.' });

      const data = await store.get(item.key, { type: 'arrayBuffer' });
      if (!data) return json(404, { ok: false, error: 'PDF no encontrado.' });

      const disposition = params.download === '1' ? 'attachment' : 'inline';
      return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `${disposition}; filename="${item.filename}"`,
          'Cache-Control': 'public, max-age=300',
        },
        body: Buffer.from(data).toString('base64'),
      };
    }
    const pdfs = await readIndex(store);
    return json(200, {
      ok: true,
      pdfs: pdfs.map((item) => ({
        id: item.id,
        title: item.title,
        filename: item.filename,
        size: item.size,
        uploadedAt: item.uploadedAt,
        viewUrl: `/.netlify/functions/pdfs?file=${encodeURIComponent(item.id)}`,
        downloadUrl: `/.netlify/functions/pdfs?file=${encodeURIComponent(item.id)}&download=1`,
      })),
    });
  }

  if (method !== 'POST') return json(405, { ok: false, error: 'Método no permitido.' });

  const adminPassword = process.env.PDF_ADMIN_PASSWORD;
  if (!adminPassword) return json(500, { ok: false, error: 'Falta configurar PDF_ADMIN_PASSWORD en Netlify.' });

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { ok: false, error: 'Pedido inválido.' });
  }

  if (body.password !== adminPassword) return json(403, { ok: false, error: 'Clave incorrecta.' });

  const filename = safeFilename(body.filename);
  if (!filename || !filename.toLowerCase().endsWith('.pdf')) {
    return json(400, { ok: false, error: 'Solo se pueden cargar archivos PDF.' });
  }

  try {
    const pdf = decodeBase64Pdf(body.content);
    const now = new Date().toISOString();
    const id = `${Date.now()}-${filename.toLowerCase()}`;
    const key = `files/${id}`;
    const title = String(body.title || filename.replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ')).trim();
    const index = await readIndex(store);
    const item = { id, key, title, filename, size: pdf.length, uploadedAt: now };

    await store.set(key, pdf, { metadata: { filename, title, uploadedAt: now } });
    await store.setJSON(INDEX_KEY, [item, ...index]);

    return json(200, { ok: true, pdf: item });
  } catch (error) {
    return json(400, { ok: false, error: error.message || 'No se pudo cargar el PDF.' });
  }
};
