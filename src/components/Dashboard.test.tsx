import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../components/Dashboard';
import { LegalStoreProvider } from '../contexts/LegalStoreContext';
import { ToastProvider } from '../contexts/ToastContext';
import { MemoryRouter } from 'react-router-dom';

// Mock CounselAgent component
vi.mock('../components/CounselAgent', () => ({
  CounselAgent: ({ onNavigate }: { onNavigate: (view: any) => void }) => (
    <div data-testid="counsel-agent">Counsel Agent Mock</div>
  ),
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <LegalStoreProvider>
        <ToastProvider>
          {component}
        </ToastProvider>
      </LegalStoreProvider>
    </MemoryRouter>
  );
};

describe('Dashboard', () => {
  const mockOnNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with stats', () => {
    renderWithProviders(<Dashboard onNavigate={mockOnNavigate} />);
    
    expect(screen.getByText(/Active Matters/i)).toBeInTheDocument();
    expect(screen.getByText(/Research Queries/i)).toBeInTheDocument();
    expect(screen.getByText(/Documents Drafted/i)).toBeInTheDocument();
  });

  it('displays the header with intelligence status', () => {
    renderWithProviders(<Dashboard onNavigate={mockOnNavigate} />);
    
    expect(screen.getByText(/Intelligence Online/i)).toBeInTheDocument();
    expect(screen.getByText(/Good Morning,/i)).toBeInTheDocument();
  });

  it('has case focus selector', () => {
    renderWithProviders(<Dashboard onNavigate={mockOnNavigate} />);
    
    expect(screen.getByLabelText(/Case Focus Selector/i)).toBeInTheDocument();
  });

  it('shows legislative briefings section', () => {
    renderWithProviders(<Dashboard onNavigate={mockOnNavigate} />);
    
    expect(screen.getByText(/Legislative Intelligence Briefings/i)).toBeInTheDocument();
    expect(screen.getByText(/CAMA 2020 Protocol/i)).toBeInTheDocument();
  });
});
