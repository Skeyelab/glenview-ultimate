/** @jest-environment jsdom */

import React from 'react';
import { render } from '@testing-library/react';
import SchedulePage from '@/app/schedule/page';

// Mock directus functions
jest.mock('@/lib/directus', () => ({
  getSchedule: jest.fn(),
}));

// Mock schedule utils
jest.mock('@/lib/schedule-utils', () => ({
  selectUpcomingEvents: jest.fn((events) => events.filter((e: any) => e.date >= new Date().toISOString())),
  groupEventsByMonth: jest.fn((events) => ({ '2024-01': events })),
}));

// Mock components
jest.mock('@/components/schedule/schedule-header', () => ({
  ScheduleHeader: () => <div data-testid="schedule-header">Schedule Header</div>,
}));

jest.mock('@/components/schedule/upcoming-events-card', () => ({
  UpcomingEventsCard: ({ events }: any) => <div data-testid="upcoming-events">{events?.length || 0} events</div>,
}));

jest.mock('@/components/schedule/highlights-card', () => ({
  SeasonHighlightsCard: ({ highlights }: any) => <div data-testid="highlights">{highlights?.length || 0} highlights</div>,
}));

jest.mock('@/components/schedule/season-timeline', () => ({
  SeasonTimeline: ({ events }: any) => <div data-testid="timeline">{events?.length || 0} events</div>,
}));

jest.mock('@/components/schedule/season-calendar', () => ({
  SeasonCalendar: ({ groups }: any) => <div data-testid="calendar">{Object.keys(groups || {}).length} months</div>,
}));

describe('SchedulePage', () => {
  const { getSchedule } = require('@/lib/directus');
  const { selectUpcomingEvents, groupEventsByMonth } = require('@/lib/schedule-utils');

  beforeEach(() => {
    jest.clearAllMocks();
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
