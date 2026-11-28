import { render, screen, within } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { App } from './app';

it('links to the platform architecture between the workflow and research', () => {
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  render(<App />);
  getContext.mockRestore();

  const main = screen.getByRole('main');
  const workflow = within(main).getByRole('region', { name: /from trader history/i });
  const platform = within(main).getByRole('region', { name: /from on-chain trades/i });
  const research = within(main).getByRole('region', { name: /how strategies hold up/i });

  expect(workflow.nextElementSibling).toBe(platform);
  expect(platform.nextElementSibling).toBe(research);
  expect(platform.id).toBeTruthy();

  for (const name of ['Main navigation', 'Footer navigation']) {
    const nav = screen.getByRole('navigation', { name });
    expect(within(nav).getByRole('link', { name: 'Platform' })).toHaveAttribute(
      'href',
      `#${platform.id}`,
    );
  }

  const summary = within(platform).getByText('How workers share the load');
  expect(summary).toBeVisible();
  expect(summary.closest('details')).toBeInTheDocument();
});
