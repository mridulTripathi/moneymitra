/**
 * @jest-environment node
 */
import { POST } from '@/app/api/subscribe/route';

const insertMock = jest.fn();

jest.mock('@/lib/supabase', () => ({
  createServiceClient: () => ({
    from: () => ({ insert: (...args: unknown[]) => insertMock(...args) }),
  }),
}));

function makeReq(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/subscribe', {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  }) as unknown as Parameters<typeof POST>[0];
}

describe('POST /api/subscribe', () => {
  beforeEach(() => {
    insertMock.mockReset();
    insertMock.mockResolvedValue({ error: null });
  });

  it('rejects an invalid email', async () => {
    const res = await POST(makeReq({ email: 'nope', source_page: 'emi' }, { 'x-forwarded-for': '1.1.1.1' }));
    expect(res.status).toBe(400);
  });

  it('accepts a valid email', async () => {
    const res = await POST(makeReq({ email: 'a@b.com', source_page: 'emi' }, { 'x-forwarded-for': '2.2.2.2' }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(insertMock).toHaveBeenCalled();
  });

  it('treats duplicate as success', async () => {
    insertMock.mockResolvedValue({ error: { message: 'duplicate key value' } });
    const res = await POST(makeReq({ email: 'dup@b.com', source_page: 'emi' }, { 'x-forwarded-for': '3.3.3.3' }));
    expect(res.status).toBe(200);
  });

  it('rate limits after 3 requests from the same IP', async () => {
    const ip = '4.4.4.4';
    for (let i = 0; i < 3; i++) {
      await POST(makeReq({ email: `u${i}@b.com`, source_page: 'emi' }, { 'x-forwarded-for': ip }));
    }
    const res = await POST(makeReq({ email: 'x@b.com', source_page: 'emi' }, { 'x-forwarded-for': ip }));
    expect(res.status).toBe(429);
  });
});
