import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailCapture from '@/components/EmailCapture';

describe('EmailCapture', () => {
  beforeEach(() => {
    localStorage.clear();
    (global.fetch as unknown) = jest.fn().mockResolvedValue({ ok: true, status: 200 });
  });

  it('renders the email input', () => {
    render(<EmailCapture sourcePage="test" />);
    expect(screen.getByPlaceholderText('you@email.com')).toBeInTheDocument();
  });

  it('submits the email and shows confirmation', async () => {
    render(<EmailCapture sourcePage="test" />);
    fireEvent.change(screen.getByPlaceholderText('you@email.com'), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByText('Notify me →'));
    await waitFor(() => expect(screen.getByText(/You're in!/i)).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', expect.objectContaining({ method: 'POST' }));
    expect(localStorage.getItem('mm_email_captured')).toBe('a@b.com');
  });

  it('shows confirmation immediately if already captured', () => {
    localStorage.setItem('mm_email_captured', 'x@y.com');
    render(<EmailCapture />);
    expect(screen.getByText(/You're in!/i)).toBeInTheDocument();
  });
});
