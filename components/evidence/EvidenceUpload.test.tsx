import { render, screen, fireEvent } from '@testing-library/react';
import { EvidenceUpload } from './EvidenceUpload';
import type { ActivityId } from '@/lib/types/student';

describe('EvidenceUpload', () => {
  const defaultProps = {
    activityId: 'ACT-001' as ActivityId,
    onUpload: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders 4 upload options', () => {
      render(<EvidenceUpload {...defaultProps} />);
      expect(screen.getByTestId('upload-photo')).toBeInTheDocument();
      expect(screen.getByTestId('upload-voice')).toBeInTheDocument();
      expect(screen.getByTestId('upload-file')).toBeInTheDocument();
      expect(screen.getByTestId('upload-note')).toBeInTheDocument();
    });

    it('renders photo button with camera icon', () => {
      render(<EvidenceUpload {...defaultProps} />);
      const photoButton = screen.getByTestId('upload-photo');
      expect(photoButton).toContainElement(screen.getByTestId('icon-camera'));
    });

    it('renders voice button with microphone icon', () => {
      render(<EvidenceUpload {...defaultProps} />);
      const voiceButton = screen.getByTestId('upload-voice');
      expect(voiceButton).toContainElement(screen.getByTestId('icon-microphone'));
    });

    it('renders file button with document icon', () => {
      render(<EvidenceUpload {...defaultProps} />);
      const fileButton = screen.getByTestId('upload-file');
      expect(fileButton).toContainElement(screen.getByTestId('icon-document'));
    });

    it('renders note button with pencil icon', () => {
      render(<EvidenceUpload {...defaultProps} />);
      const noteButton = screen.getByTestId('upload-note');
      expect(noteButton).toContainElement(screen.getByTestId('icon-pencil'));
    });

    it('renders labels for each option', () => {
      render(<EvidenceUpload {...defaultProps} />);
      expect(screen.getByText('Photo')).toBeInTheDocument();
      expect(screen.getByText('Voice')).toBeInTheDocument();
      expect(screen.getByText('File')).toBeInTheDocument();
      expect(screen.getByText('Note')).toBeInTheDocument();
    });
  });

  describe('layout', () => {
    it('has 2x2 grid layout', () => {
      render(<EvidenceUpload {...defaultProps} data-testid="grid" />);
      const grid = screen.getByTestId('grid');
      expect(grid).toHaveClass('grid', 'grid-cols-2');
    });

    it('has large touch targets (minimum 88px)', () => {
      render(<EvidenceUpload {...defaultProps} />);
      const photoButton = screen.getByTestId('upload-photo');
      expect(photoButton).toHaveClass('min-w-[88px]', 'min-h-[88px]');
    });
  });

  describe('mocked interaction', () => {
    it('shows coming soon toast when photo clicked', () => {
      render(<EvidenceUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('upload-photo'));
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
    });

    it('shows coming soon toast when voice clicked', () => {
      render(<EvidenceUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('upload-voice'));
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
    });

    it('shows coming soon toast when file clicked', () => {
      render(<EvidenceUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('upload-file'));
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
    });

    it('shows coming soon toast when note clicked', () => {
      render(<EvidenceUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('upload-note'));
      expect(screen.getByText('Coming soon')).toBeInTheDocument();
    });

    it('hides toast after interaction', async () => {
      jest.useFakeTimers();
      render(<EvidenceUpload {...defaultProps} />);
      fireEvent.click(screen.getByTestId('upload-photo'));
      expect(screen.getByText('Coming soon')).toBeInTheDocument();

      // Advance timers and wait for state update
      await jest.advanceTimersByTimeAsync(2000);
      expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
      jest.useRealTimers();
    });
  });

  describe('accessibility', () => {
    it('all buttons have accessible names', () => {
      render(<EvidenceUpload {...defaultProps} />);
      expect(screen.getByRole('button', { name: /add photo/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add voice/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add file/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
    });
  });
});
