import React from "react";
import { getAllScheduleEvents, type ScheduleEvent } from "@/lib/directus";

export const revalidate = 300;

interface ScheduleEventItemProps {
  event: ScheduleEvent;
}

function ScheduleEventItem({ event }: ScheduleEventItemProps): React.JSX.Element {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventIcon = (type: string): string => {
    switch (type) {
      case 'registration_open':
      case 'registration_close':
        return '📝';
      case 'season_start':
      case 'season_end':
        return '🏆';
      case 'game':
        return '🥏';
      case 'practice':
        return '⚡';
      case 'tournament':
        return '🏅';
      default:
        return '📅';
    }
  };

  return (
    <div className="border border-white/20 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-colors">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getEventIcon(event.event_type)}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
          <div className="text-sm text-white/70 mt-1">
            <p>{formatDate(event.date)}</p>
            <p>{formatTime(event.date)}</p>
          </div>
          {event.location && (
            <p className="text-sm text-white/80 mt-1">📍 {event.location}</p>
          )}
          {event.description && (
            <p className="text-sm text-white/90 mt-2">{event.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface MonthGroup {
  month: string;
  events: ScheduleEvent[];
}

function groupEventsByMonth(events: ScheduleEvent[]): MonthGroup[] {
  const groups = new Map<string, ScheduleEvent[]>();
  
  events.forEach(event => {
    const date = new Date(event.date);
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!groups.has(monthKey)) {
      groups.set(monthKey, []);
    }
    const eventList = groups.get(monthKey);
    if (eventList) {
      eventList.push(event);
    }
  });

  return Array.from(groups.entries()).map(([month, events]) => ({
    month,
    events
  }));
}

interface CalendarViewProps {
  events: ScheduleEvent[];
}

function CalendarView({ events }: CalendarViewProps): React.JSX.Element {
  const monthGroups = groupEventsByMonth(events);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Calendar View</h2>
      {monthGroups.length > 0 ? (
        monthGroups.map((group) => (
          <div key={group.month} className="card">
            <h3 className="text-xl font-semibold text-white mb-4">{group.month}</h3>
            <div className="space-y-3">
              {group.events.map((event) => (
                <ScheduleEventItem key={event.id} event={event} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="card">
          <p className="text-white/90">No events scheduled yet.</p>
        </div>
      )}
    </div>
  );
}

interface ListViewProps {
  events: ScheduleEvent[];
}

function ListView({ events }: ListViewProps): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">All Events</h2>
      {events.length > 0 ? (
        <div className="space-y-3">
          {events.map((event) => (
            <ScheduleEventItem key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="card">
          <p className="text-white/90">No events scheduled yet.</p>
        </div>
      )}
    </div>
  );
}

export default async function SchedulePage(): Promise<React.JSX.Element> {
  const currentYear = 2026;
  const events = await getAllScheduleEvents(currentYear);

  // Provide static content as fallback if no events from Directus
  const staticSchedule = [
    {
      month: "November 2025",
      description: "Pre-Registration Opens"
    },
    {
      month: "January 2026",
      description: "Park District assigns fields. Practice time & location to be announced"
    },
    {
      month: "February 2026",
      description: "Final Registration & uniform orders due"
    },
    {
      month: "March, April, May 2026",
      title: "Spring Season",
      items: [
        "Practice once a week for 12 weeks",
        "Time & Location TBD",
        "Skills, drills, and scrimmages",
        "Opportunity to attend 3-4 tournaments"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">2026 Season Schedule</h1>
        <p className="text-white/90">Stay up to date with all upcoming events and important dates</p>
      </div>

      {events.length > 0 ? (
        <>
          <CalendarView events={events} />
          <ListView events={events} />
        </>
      ) : (
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4 text-white">Season Timeline</h2>
            <div className="space-y-4">
              {staticSchedule.map((item, idx) => (
                <div key={idx} className="border-l-4 border-white/30 pl-4">
                  <h3 className="text-lg font-semibold text-white">{item.month}</h3>
                  {item.description && (
                    <p className="text-white/90 mt-1">{item.description}</p>
                  )}
                  {item.title && (
                    <>
                      <p className="text-white/90 font-medium mt-2">{item.title}</p>
                      {item.items && (
                        <ul className="list-disc list-inside mt-2 space-y-1 text-white/80 ml-2">
                          {item.items.map((listItem, i) => (
                            <li key={i}>{listItem}</li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white/10">
            <h2 className="text-xl font-semibold mb-2 text-white">Important Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-white/90">
              <li>Practice schedule will be announced after Park District field assignments</li>
              <li>Tournament dates and locations will be shared as they are finalized</li>
              <li>Check back for regular updates throughout the season</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
