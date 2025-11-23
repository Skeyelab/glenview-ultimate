import React from 'react';
import { render } from '@testing-library/react';
import { beforeEach, vi } from 'vitest';
import SchedulePage from '@/app/schedule/page';
import * as directusModule from '@/lib/directus';
import * as scheduleUtilsModule from '@/lib/schedule-utils';

// Mock directus functions
vi.mock('@/lib/directus', () => ({
  getSchedule: vi.fn(),
}));

// Mock schedule utils
vi.mock('@/lib/schedule-utils', () => ({
  selectUpcomingEvents: vi.fn((events) => events.filter((e: any) => e.date >= new Date().toISOString())),
  groupEventsByMonth: vi.fn((events) => ({ '2024-01': events })),
}));

// Mock components
vi.mock('@/components/schedule/schedule-header', () => ({
  ScheduleHeader: () => <div data-testid="schedule-header">Schedule Header</div>,
}));

vi.mock('@/components/schedule/upcoming-events-card', () => ({
  UpcomingEventsCard: ({ events }: any) => <div data-testid="upcoming-events">{events?.length || 0} events</div>,
}));

vi.mock('@/components/schedule/highlights-card', () => ({
  SeasonHighlightsCard: ({ highlights }: any) => <div data-testid="highlights">{highlights?.length || 0} highlights</div>,
}));

vi.mock('@/components/schedule/season-timeline', () => ({
  SeasonTimeline: ({ events }: any) => <div data-testid="timeline">{events?.length || 0} events</div>,
}));

vi.mock('@/components/schedule/season-calendar', () => ({
  SeasonCalendar: ({ groups }: any) => <div data-testid="calendar">{Object.keys(groups || {}).length} months</div>,
}));

describe('SchedulePage', () => {
  const getSchedule = vi.mocked(directusModule.getSchedule);
  const selectUpcomingEvents = vi.mocked(scheduleUtilsModule.selectUpcomingEvents);
  const groupEventsByMonth = vi.mocked(scheduleUtilsModule.groupEventsByMonth);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with empty schedule', async () => {
    getSchedule.mockResolvedValue({ events: [], highlights: [] });
    selectUpcomingEvents.mockReturnValue([]);
    groupEventsByMonth.mockReturnValue({});

    const page = await SchedulePage();
    const { getByTestId } = render(page);

    expect(getByTestId('schedule-header')).toBeInTheDocument();
    expect(getByTestId('upcoming-events')).toBeInTheDocument();
    expect(getByTestId('highlights')).toBeInTheDocument();
  });

  it('should render with schedule data', async () => {
    const mockSchedule = {
      events: [
        { id: '1', title: 'Event 1', date: '2024-12-01' },
        { id: '2', title: 'Event 2', date: '2024-12-15' },
      ],
      highlights: [{ id: '1', title: 'Highlight 1' }],
    };

    getSchedule.mockResolvedValue(mockSchedule);
    selectUpcomingEvents.mockReturnValue(mockSchedule.events);
    groupEventsByMonth.mockReturnValue({ '2024-12': mockSchedule.events });

    const page = await SchedulePage();
    const { getByTestId } = render(page);

    expect(getByTestId('upcoming-events')).toHaveTextContent('2 events');
    expect(getByTestId('highlights')).toHaveTextContent('1 highlights');
  });

  it('should fetch schedule data', async () => {
    getSchedule.mockResolvedValue({ events: [], highlights: [] });

    await SchedulePage();

    expect(getSchedule).toHaveBeenCalledTimes(1);
  });
});
