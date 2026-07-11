"use client";

import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import { CalendarEventForm } from "@/components/calendar/CalendarEventForm";
import type {
  CalendarCompanyOption,
  CalendarEventItem,
} from "@/components/calendar/types";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/components/ui/Icons";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  addJstDays,
  formatJstDateKey,
  formatJstTime,
  getJstDateKey,
  getJstMonthMatrix,
  getJstWeekDays,
} from "@/lib/calendar/time";
import { cn } from "@/lib/utils";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  toggleCalendarTaskCompleted,
  updateCalendarEvent,
} from "@/server/actions/calendar";

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];
const HOURS = Array.from({ length: 24 }, (_, index) => index);
const TIMELINE_HEIGHT = "200%";
const VIEW_OPTIONS = [
  { value: "day", label: "日" },
  { value: "week", label: "週" },
  { value: "month", label: "月" },
] as const;

export type CalendarView = "day" | "week" | "month";
type CalendarDay = {
  dateKey: string;
  day: number;
  inMonth?: boolean;
};
type DragSelection = {
  startY: number;
  currentY: number;
};
type DetailState = {
  event: CalendarEventItem;
  x: number;
  y: number;
};
type DayPopoverState = {
  dateKey: string;
  x: number;
  y: number;
};

type DrawerState =
  | {
      mode: "create";
      dateKey: string;
      startsAt?: string;
      endsAt?: string;
      event?: never;
    }
  | {
      mode: "edit";
      dateKey?: never;
      event: CalendarEventItem;
    };

export function CalendarClient({
  companies,
  events,
  initialDateKey,
  initialView,
}: {
  companies: CalendarCompanyOption[];
  events: CalendarEventItem[];
  initialDateKey: string;
  initialView: CalendarView;
}) {
  const router = useRouter();
  const todayKey = getJstDateKey();
  const [cursor, setCursor] = useState(() => {
    const [year, month] = initialDateKey.split("-").map(Number);
    return { year, month };
  });
  const [selectedDateKey, setSelectedDateKey] = useState(initialDateKey);
  const [view, setView] = useState<CalendarView>(initialView);
  const [drawerState, setDrawerState] = useState<DrawerState | null>(null);
  const [detailState, setDetailState] = useState<DetailState | null>(null);
  const [dayPopoverState, setDayPopoverState] = useState<DayPopoverState | null>(null);
  const monthDays = useMemo(
    () => getJstMonthMatrix(cursor.year, cursor.month),
    [cursor],
  );
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();

    for (const event of events) {
      const dateKey = formatJstDateKey(new Date(event.startsAt));
      const current = map.get(dateKey) ?? [];
      current.push(event);
      map.set(dateKey, current);
    }

    for (const current of map.values()) {
      current.sort(
        (left, right) =>
          new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      );
    }

    return map;
  }, [events]);
  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (left, right) =>
          new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime(),
      ),
    [events],
  );
  const groupedEvents = useMemo(() => {
    const groups = new Map<string, CalendarEventItem[]>();

    for (const event of sortedEvents) {
      const dateKey = formatJstDateKey(new Date(event.startsAt));
      const current = groups.get(dateKey) ?? [];
      current.push(event);
      groups.set(dateKey, current);
    }

    return Array.from(groups.entries()).map(([dateKey, groupEvents]) => ({
      dateKey,
      events: groupEvents,
    }));
  }, [sortedEvents]);
  const selectedEvents = eventsByDate.get(selectedDateKey) ?? [];
  const weekDays = useMemo(() => getJstWeekDays(selectedDateKey), [selectedDateKey]);
  const periodLabel = view === "month"
    ? `${cursor.year}年${cursor.month}月`
    : view === "week"
      ? `${formatDateLabel(weekDays[0].dateKey)} - ${formatDateLabel(weekDays[6].dateKey)}`
      : formatDateLabel(selectedDateKey);
  const previousLabel = view === "month"
    ? "前の月"
    : view === "week"
      ? "前の週"
      : "前の日";
  const nextLabel = view === "month"
    ? "次の月"
    : view === "week"
      ? "次の週"
      : "次の日";

  useEffect(() => {
    const [year, month] = initialDateKey.split("-").map(Number);
    setSelectedDateKey(initialDateKey);
    setCursor({ year, month });
    setView(initialView);
  }, [initialDateKey, initialView]);

  function syncUrl(nextView: CalendarView, dateKey: string) {
    router.push(buildCalendarPath(nextView, dateKey), { scroll: false });
  }

  function selectDate(dateKey: string, nextView = view) {
    const [year, month] = dateKey.split("-").map(Number);
    setSelectedDateKey(dateKey);
    setCursor({ year, month });
    syncUrl(nextView, dateKey);
  }

  function changeView(nextValue: string) {
    const nextView = nextValue as CalendarView;
    setView(nextView);
    syncUrl(nextView, selectedDateKey);
  }

  function moveMonth(delta: number) {
    const nextMonthIndex = cursor.month - 1 + delta;
    const nextDate = new Date(Date.UTC(cursor.year, nextMonthIndex, 1));
    const nextDateKey = [
      nextDate.getUTCFullYear(),
      String(nextDate.getUTCMonth() + 1).padStart(2, "0"),
      "01",
    ].join("-");

    selectDate(nextDateKey, "month");
  }

  function movePeriod(delta: number) {
    if (view === "month") {
      moveMonth(delta);
      return;
    }

    selectDate(addJstDays(selectedDateKey, view === "week" ? delta * 7 : delta));
  }

  function moveToday() {
    selectDate(todayKey, view);
  }

  function openCreateAtDate(dateKey: string, defaults?: { startsAt: string; endsAt: string }) {
    const [year, month] = dateKey.split("-").map(Number);
    setSelectedDateKey(dateKey);
    setCursor({ year, month });
    setDrawerState({ mode: "create", dateKey, ...defaults });
  }

  function openDetail(event: CalendarEventItem, point?: { x: number; y: number }) {
    const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;

    setDetailState({
      event,
      x: point?.x ?? viewportWidth - 408,
      y: point?.y ?? 80,
    });
  }

  function openDayPopover(dateKey: string, point: { x: number; y: number }) {
    const [year, month] = dateKey.split("-").map(Number);
    setSelectedDateKey(dateKey);
    setCursor({ year, month });
    setDayPopoverState({ dateKey, x: point.x, y: point.y });
  }

  function getDefaultTimes(dateKey: string) {
    return {
      startsAt: `${dateKey}T09:00`,
      endsAt: `${dateKey}T10:00`,
    };
  }

  return (
    <div className="flex h-[calc(100vh-120px)] min-h-0 flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={moveToday}>
            今日
          </Button>
          <button
            className={buttonClasses({ variant: "ghost", className: "h-9 w-9 px-0" })}
            aria-label={previousLabel}
            type="button"
            onClick={() => movePeriod(-1)}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            className={buttonClasses({ variant: "ghost", className: "h-9 w-9 px-0" })}
            aria-label={nextLabel}
            type="button"
            onClick={() => movePeriod(1)}
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          <div className="ml-2 text-lg font-semibold text-[#111111]">{periodLabel}</div>
        </div>
        <div className="w-28">
          <Dropdown
            options={VIEW_OPTIONS}
            value={view}
            onValueChange={changeView}
          />
        </div>
        <Button onClick={() => setDrawerState({ mode: "create", dateKey: selectedDateKey })}>
          作成
        </Button>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-h-0 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white">
          {view === "month" ? (
            <MonthCalendar
              days={monthDays}
              eventsByDate={eventsByDate}
              openCreateAtDate={openCreateAtDate}
              onOpenDayPopover={openDayPopover}
              onViewEvent={openDetail}
              selectedDateKey={selectedDateKey}
              todayKey={todayKey}
            />
          ) : view === "week" ? (
            <WeekCalendar
              days={weekDays}
              eventsByDate={eventsByDate}
              openCreateAtDate={openCreateAtDate}
              onViewEvent={openDetail}
              selectedDateKey={selectedDateKey}
            />
          ) : (
            <DayCalendar
              dateKey={selectedDateKey}
              events={selectedEvents}
              openCreateAtDate={openCreateAtDate}
              onViewEvent={openDetail}
            />
          )}
        </section>

        <aside className="min-h-0 overflow-auto rounded-lg border border-[#e5e5e5] bg-white">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-[#e5e5e5] bg-white px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-[#111111]">予定一覧</h2>
            </div>
            <button
              className={buttonClasses({ variant: "secondary", className: "h-8 px-3" })}
              type="button"
              onClick={() =>
                setDrawerState({ mode: "create", dateKey: selectedDateKey })
              }
            >
              追加
            </button>
          </div>

          <div className="space-y-4 p-4">
            {groupedEvents.length > 0 ? (
              groupedEvents.map((group) => (
                <div key={group.dateKey}>
                  <div
                    className={cn(
                      "mb-2 text-xs font-medium text-[#111111]",
                      group.dateKey === todayKey && "text-sm font-semibold",
                    )}
                  >
                    <DateWithWeekday dateKey={group.dateKey} />
                  </div>
                  <div className="space-y-2">
                    {group.events.map((event) => (
                      <CalendarListItem
                        key={event.id}
                        event={event}
                        onEdit={openDetail}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed border-[#d4d4d4] px-4 py-8 text-center text-sm text-[#666666]">
                予定はありません
              </div>
            )}
          </div>
        </aside>
      </div>

      {drawerState ? (
        <CalendarEventDrawer
          state={drawerState}
          companies={companies}
          getDefaultTimes={getDefaultTimes}
          onClose={() => setDrawerState(null)}
        />
      ) : null}
      {detailState ? (
        <CalendarEventDetail
          event={detailState.event}
          events={events}
          x={detailState.x}
          y={detailState.y}
          onClose={() => setDetailState(null)}
          onEdit={(event) => {
            setDetailState(null);
            setDrawerState({ mode: "edit", event });
          }}
          onViewEvent={openDetail}
        />
      ) : null}
      {dayPopoverState ? (
        <CalendarDayPopover
          dateKey={dayPopoverState.dateKey}
          events={eventsByDate.get(dayPopoverState.dateKey) ?? []}
          x={dayPopoverState.x}
          y={dayPopoverState.y}
          onClose={() => setDayPopoverState(null)}
          onCreate={(dateKey) => {
            setDayPopoverState(null);
            openCreateAtDate(dateKey);
          }}
          onViewEvent={(event, point) => {
            setDayPopoverState(null);
            openDetail(event, point);
          }}
        />
      ) : null}
    </div>
  );
}

function MonthCalendar({
  days,
  eventsByDate,
  onOpenDayPopover,
  onViewEvent,
  openCreateAtDate,
  selectedDateKey,
  todayKey,
}: {
  days: CalendarDay[];
  eventsByDate: Map<string, CalendarEventItem[]>;
  onOpenDayPopover: (dateKey: string, point: { x: number; y: number }) => void;
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  openCreateAtDate: (
    dateKey: string,
    defaults?: { startsAt: string; endsAt: string },
  ) => void;
  selectedDateKey: string;
  todayKey: string;
}) {
  const rowCount = days.length / 7;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-7 border-b border-[#e5e5e5] bg-[#fafafa]">
        {WEEKDAYS.map((weekday, index) => (
          <div
            key={weekday}
            className={cn(
              "px-2 py-2 text-center text-xs font-medium",
              getWeekendTextClass(index),
            )}
          >
            {weekday}
          </div>
        ))}
      </div>
      <div
        className="grid min-h-0 flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${rowCount}, minmax(0, 1fr))` }}
      >
        {days.map((day) => {
          const dayEvents = eventsByDate.get(day.dateKey) ?? [];
          const dayOfWeek = getDayOfWeek(day.dateKey);

          return (
            <div
              key={day.dateKey}
              className={cn(
                "relative min-h-0 cursor-pointer border-r border-b border-[#eeeeee] p-1.5 pt-8 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#111111]",
                !day.inMonth && "bg-[#fafafa]",
              )}
              role="button"
              tabIndex={0}
              onClick={() => openCreateAtDate(day.dateKey)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openCreateAtDate(day.dateKey);
                }
              }}
            >
              <button
                className={cn(
                  "absolute left-1.5 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs font-medium hover:bg-[#eeeeee]",
                  day.dateKey === todayKey && "bg-[#111111] text-sm font-semibold text-white hover:bg-[#111111]",
                  day.dateKey !== todayKey &&
                    (day.inMonth ? getWeekendTextClass(dayOfWeek) : "text-[#b3b3b3]"),
                )}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpenDayPopover(day.dateKey, {
                    x: event.clientX,
                    y: event.clientY,
                  });
                }}
              >
                {day.day}
              </button>
              <div className="max-h-full space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map((event) => (
                  <EventChip
                    key={event.id}
                    event={event}
                    onEdit={onViewEvent}
                  />
                ))}
                {dayEvents.length > 2 ? (
                  <button
                    className="w-full cursor-pointer truncate rounded px-1 text-left text-xs text-[#666666] hover:bg-[#eeeeee]"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenDayPopover(day.dateKey, {
                        x: event.clientX,
                        y: event.clientY,
                      });
                    }}
                  >
                    他 {dayEvents.length - 2}件
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekCalendar({
  days,
  eventsByDate,
  onViewEvent,
  openCreateAtDate,
  selectedDateKey,
}: {
  days: CalendarDay[];
  eventsByDate: Map<string, CalendarEventItem[]>;
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  openCreateAtDate: (
    dateKey: string,
    defaults?: { startsAt: string; endsAt: string },
  ) => void;
  selectedDateKey: string;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="border-r border-[#e5e5e5]" />
        {days.map((day, index) => (
          <div
            key={day.dateKey}
            className={cn(
              "px-2 py-2 text-center text-xs font-medium",
              getWeekendTextClass(index),
              day.dateKey === selectedDateKey && "bg-[#f5f5f5]",
            )}
          >
            {WEEKDAYS[index]} {day.day}
          </div>
        ))}
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[52px_repeat(7,minmax(0,1fr))] overflow-y-auto">
        <TimeColumn />
        {days.map((day) => {
          const dayEvents = eventsByDate.get(day.dateKey) ?? [];

          return (
            <TimelineColumn
              key={day.dateKey}
              dateKey={day.dateKey}
              events={dayEvents}
              isSelected={day.dateKey === selectedDateKey}
              onViewEvent={onViewEvent}
              openCreateAtDate={openCreateAtDate}
            />
          );
        })}
      </div>
    </div>
  );
}

function DayCalendar({
  dateKey,
  events,
  onViewEvent,
  openCreateAtDate,
}: {
  dateKey: string;
  events: CalendarEventItem[];
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  openCreateAtDate: (
    dateKey: string,
    defaults?: { startsAt: string; endsAt: string },
  ) => void;
}) {
  const dayOfWeek = getDayOfWeek(dateKey);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-[52px_minmax(0,1fr)] border-b border-[#e5e5e5] bg-[#fafafa]">
        <div className="border-r border-[#e5e5e5]" />
        <div className="flex items-center gap-2 px-3 py-2">
          <span
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
              getWeekendTextClass(dayOfWeek),
            )}
          >
            {Number(dateKey.slice(-2))}
          </span>
          <div className={cn("text-sm font-semibold", getWeekendTextClass(dayOfWeek))}>
            {formatDateLabel(dateKey)}
          </div>
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[52px_minmax(0,1fr)] overflow-y-auto">
        <TimeColumn />
        <TimelineColumn
          dateKey={dateKey}
          events={events}
          onViewEvent={onViewEvent}
          openCreateAtDate={openCreateAtDate}
        />
      </div>
    </div>
  );
}

function TimelineColumn({
  dateKey,
  events,
  isSelected,
  onViewEvent,
  openCreateAtDate,
}: {
  dateKey: string;
  events: CalendarEventItem[];
  isSelected?: boolean;
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  openCreateAtDate: (
    dateKey: string,
    defaults?: { startsAt: string; endsAt: string },
  ) => void;
}) {
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);

  function startSelection(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    const y = getPointerYInElement(event.currentTarget, event.clientY);
    setDragSelection({ startY: y, currentY: y });
  }

  function moveSelection(event: PointerEvent<HTMLDivElement>) {
    if (!dragSelection) {
      return;
    }

    const currentY = getPointerYInElement(event.currentTarget, event.clientY);
    setDragSelection((current) =>
      current
        ? {
            ...current,
            currentY,
          }
        : null,
    );
  }

  function finishSelection(event: PointerEvent<HTMLDivElement>) {
    if (!dragSelection) {
      return;
    }

    const currentY = getPointerYInElement(event.currentTarget, event.clientY);
    const defaults = getDragDefaultTimes(
      dateKey,
      dragSelection.startY,
      currentY,
      event.currentTarget.getBoundingClientRect().height,
    );
    setDragSelection(null);
    openCreateAtDate(dateKey, defaults);
  }

  return (
    <div
      className={cn(
        "relative cursor-pointer border-r border-[#eeeeee] outline-none focus-visible:ring-2 focus-visible:ring-[#111111]",
        isSelected && "bg-[#f5f5f5]",
      )}
      role="button"
      style={{ height: TIMELINE_HEIGHT }}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openCreateAtDate(dateKey);
        }
      }}
      onPointerCancel={() => setDragSelection(null)}
      onPointerDown={startSelection}
      onPointerMove={moveSelection}
      onPointerUp={finishSelection}
    >
      <HourLines />
      {dragSelection ? <DragRange selection={dragSelection} /> : null}
      <div className="absolute inset-0">
        {events.map((event) => (
          <TimedEvent
            key={event.id}
            event={event}
            onEdit={onViewEvent}
          />
        ))}
      </div>
    </div>
  );
}

function TimeColumn() {
  return (
    <div
      className="grid grid-rows-[repeat(24,minmax(0,1fr))] border-r border-[#e5e5e5] bg-white"
      style={{ height: TIMELINE_HEIGHT }}
    >
      {HOURS.map((hour) => (
        <div
          key={hour}
          className="relative border-b border-[#eeeeee]"
        >
          <span className="absolute right-2 top-1 text-[11px] text-[#999999]">
            {formatHour(hour)}
          </span>
        </div>
      ))}
    </div>
  );
}

function HourLines() {
  return (
    <div className="grid h-full grid-rows-[repeat(24,minmax(0,1fr))]">
      {HOURS.map((hour) => (
        <div key={hour} className="border-b border-[#eeeeee]" />
      ))}
    </div>
  );
}

function DragRange({ selection }: { selection: DragSelection }) {
  const top = Math.min(selection.startY, selection.currentY);
  const height = Math.max(8, Math.abs(selection.currentY - selection.startY));

  return (
    <div
      className="pointer-events-none absolute left-1 right-1 z-10 rounded border border-[#2563eb] bg-[#2563eb]/15"
      style={{ top, height }}
    />
  );
}

function TimedEvent({
  event,
  onEdit,
}: {
  event: CalendarEventItem;
  onEdit: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
}) {
  const placement = getEventPlacement(event);

  return (
    <div
      className={cn(
        "absolute left-1 right-1 z-10 flex cursor-pointer items-start gap-1.5 overflow-hidden rounded px-2 py-1 text-left text-xs shadow-sm hover:bg-[#f5f5f5]",
        getItemSurfaceClass(event),
        isPastEvent(event) && "opacity-50",
      )}
      style={{
        ...getItemStyle(event),
        top: `${placement.top}%`,
        height: `${placement.height}%`,
      }}
      onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onEdit(event, { x: clickEvent.clientX, y: clickEvent.clientY });
      }}
    >
      {event.type === "TASK" ? <TaskCompleteButton event={event} /> : null}
      <div
        className={cn(
          "min-w-0 truncate font-medium text-[#111111]",
          event.completed && "text-[#999999] line-through",
        )}
      >
        {formatCalendarCellText(event)}
      </div>
    </div>
  );
}

function CalendarListItem({
  event,
  onEdit,
}: {
  event: CalendarEventItem;
  onEdit: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "block w-full cursor-pointer overflow-hidden rounded-md border border-[#e5e5e5] p-3 text-left hover:bg-[#f5f5f5]",
        getItemSurfaceClass(event),
        isPastEvent(event) && "opacity-50",
      )}
      style={getItemStyle(event)}
      onClick={(clickEvent) => onEdit(event, { x: clickEvent.clientX, y: clickEvent.clientY })}
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === "Enter" || keyEvent.key === " ") {
          keyEvent.preventDefault();
          onEdit(event);
        }
      }}
    >
      <div className="flex min-w-0 items-start gap-2">
        {event.type === "TASK" ? <TaskCompleteButton event={event} /> : null}
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "truncate text-sm font-medium text-[#111111]",
              event.completed && "text-[#999999] line-through",
            )}
          >
            {getItemTypeLabel(event)} {event.title}
          </div>
          <div className="mt-1 truncate text-xs text-[#666666]">
            {formatListTimeLabel(event)} / {event.company?.name ?? "-"}
          </div>
          <div className="mt-1 truncate text-xs text-[#999999]">
            {formatUntilStart(event)}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarEventDetail({
  event,
  events,
  onClose,
  onEdit,
  onViewEvent,
  x,
  y,
}: {
  event: CalendarEventItem;
  events: CalendarEventItem[];
  onClose: () => void;
  onEdit: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  x: number;
  y: number;
}) {
  const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const popoverWidth = Math.min(360, viewportWidth - 32);
  const popoverHeight = Math.min(520, viewportHeight - 32);
  const left = Math.min(Math.max(16, x + 12), viewportWidth - popoverWidth - 16);
  const top = Math.min(Math.max(16, y + 12), viewportHeight - popoverHeight - 16);
  const detailStyle: CSSProperties =
    event.type === "DEADLINE"
      ? {
          backgroundColor: mixHexWithWhite(event.color, 0.9),
          left,
          top,
          maxHeight: popoverHeight,
        }
      : { left, top, maxHeight: popoverHeight };
  const relatedEvents = event.companyId
    ? events
        .filter(
          (relatedEvent) =>
            relatedEvent.companyId === event.companyId && relatedEvent.id !== event.id,
        )
        .sort(
          (leftEvent, rightEvent) =>
            new Date(leftEvent.startsAt).getTime() -
            new Date(rightEvent.startsAt).getTime(),
        )
    : [];

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="閉じる"
        className="absolute inset-0 cursor-default bg-transparent"
        type="button"
        onClick={onClose}
      />
      <div
        className="absolute w-[360px] max-w-[calc(100vw-32px)] overflow-auto rounded-lg border border-[#e5e5e5] bg-white p-4 shadow-lg"
        style={detailStyle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              {event.type === "TASK" ? (
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
              ) : event.type === "EVENT" || event.type === "DEADLINE" ? (
                <span
                  aria-hidden="true"
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
              ) : null}
              <h2
                className={cn(
                  "truncate text-sm font-semibold text-[#111111]",
                  event.completed && "text-[#999999] line-through",
                )}
              >
                {event.title}
              </h2>
            </div>
          </div>
          <button
            className={buttonClasses({ variant: "secondary", className: "h-8 px-3" })}
            type="button"
            onClick={() => onEdit(event)}
          >
            編集
          </button>
        </div>
        <div className="mt-4 space-y-2 text-sm text-[#666666]">
          <div>種別: {getItemTypeLabel(event)}</div>
          <div>時間: {formatEventTimeLabel(event)}</div>
          <div>企業: {event.company?.name ?? "-"}</div>
          <div>場所: {event.location ?? "-"}</div>
          <div>状態: {event.completed ? "完了" : "未完了"}</div>
          <div className="whitespace-pre-wrap break-words">
            メモ: {event.description ?? "-"}
          </div>
        </div>
        <div className="mt-4 border-t border-[#e5e5e5] pt-3">
          <div className="text-xs font-semibold text-[#111111]">
            この企業のその他の予定
          </div>
          <div className="mt-2 space-y-1.5">
            {relatedEvents.length > 0 ? (
              relatedEvents.map((relatedEvent) => (
                <button
                  key={relatedEvent.id}
                  className={cn(
                    "block w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-xs hover:bg-[#f5f5f5]",
                    isPastEvent(relatedEvent) && "opacity-50",
                  )}
                  type="button"
                  onClick={() =>
                    onViewEvent(relatedEvent, {
                      x,
                      y,
                    })
                  }
                >
                  <div className="truncate font-medium text-[#111111]">
                    {formatListTimeLabel(relatedEvent)} {getItemTypeLabel(relatedEvent)} {relatedEvent.title}
                  </div>
                  <div className="mt-0.5 truncate text-[#999999]">
                    {formatUntilStart(relatedEvent)}
                  </div>
                </button>
              ))
            ) : (
              <div className="text-xs text-[#999999]">その他の予定はありません</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarDayPopover({
  dateKey,
  events,
  onClose,
  onCreate,
  onViewEvent,
  x,
  y,
}: {
  dateKey: string;
  events: CalendarEventItem[];
  onClose: () => void;
  onCreate: (dateKey: string) => void;
  onViewEvent: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
  x: number;
  y: number;
}) {
  const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
  const viewportHeight = typeof window === "undefined" ? 800 : window.innerHeight;
  const popoverWidth = Math.min(440, viewportWidth - 32);
  const popoverHeight = Math.min(520, viewportHeight - 32);
  const left = Math.min(Math.max(16, x + 12), viewportWidth - popoverWidth - 16);
  const top = Math.min(Math.max(16, y + 12), viewportHeight - popoverHeight - 16);
  const sortedDayEvents = [...events].sort(
    (leftEvent, rightEvent) =>
      new Date(leftEvent.startsAt).getTime() - new Date(rightEvent.startsAt).getTime(),
  );

  return (
    <div className="fixed inset-0 z-40">
      <button
        aria-label="閉じる"
        className="absolute inset-0 cursor-default bg-transparent"
        type="button"
        onClick={onClose}
      />
      <div
        className="absolute w-[440px] max-w-[calc(100vw-32px)] overflow-auto rounded-lg border border-[#e5e5e5] bg-white p-5 shadow-lg"
        style={{ left, top, maxHeight: popoverHeight }}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-[#666666]">
              {WEEKDAYS[getDayOfWeek(dateKey)]}曜日
            </div>
            <div className="mt-1 text-2xl font-semibold text-[#111111]">
              {formatDateLabel(dateKey)}
            </div>
          </div>
          <Button variant="secondary" onClick={onClose}>
            閉じる
          </Button>
        </div>

        <div className="space-y-2">
          {sortedDayEvents.length > 0 ? (
            sortedDayEvents.map((event) => (
              <button
                key={event.id}
                className={cn(
                  "block w-full cursor-pointer rounded-md border border-[#d7d7d7] p-3 text-left hover:bg-[#f5f5f5]",
                  getItemSurfaceClass(event),
                  isPastEvent(event) && "opacity-50",
                )}
                style={getItemStyle(event)}
                type="button"
                onClick={(clickEvent) =>
                  onViewEvent(event, { x: clickEvent.clientX, y: clickEvent.clientY })
                }
              >
                <div className="truncate text-sm font-semibold text-[#111111]">
                  {formatEventTimeLabel(event)} {getDayPopoverTitle(event)}
                </div>
                <div className="mt-1 truncate text-xs text-[#666666]">
                  {event.company?.name ?? "-"} / {event.type === "DEADLINE" ? "インターン締切" : getItemTypeLabel(event)}
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-md border border-dashed border-[#d4d4d4] px-4 py-8 text-center text-sm text-[#666666]">
              予定はありません
            </div>
          )}
        </div>

        <Button className="mt-5" onClick={() => onCreate(dateKey)}>
          この日に予定を追加
        </Button>
      </div>
    </div>
  );
}

function EventChip({
  event,
  onEdit,
}: {
  event: CalendarEventItem;
  onEdit: (event: CalendarEventItem, point?: { x: number; y: number }) => void;
}) {
  return (
    <div
      className={cn(
        "flex h-6 w-full cursor-pointer items-center gap-1.5 truncate rounded px-1.5 text-left text-xs font-medium text-[#111111] hover:bg-[#eeeeee]",
        getItemSurfaceClass(event),
        isPastEvent(event) && "opacity-50",
      )}
      style={getItemStyle(event)}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        onEdit(event, { x: clickEvent.clientX, y: clickEvent.clientY });
      }}
    >
      {event.type === "TASK" ? <TaskCompleteButton event={event} compact /> : null}
      <span className={cn("truncate", event.completed && "text-[#999999] line-through")}>
        {formatCalendarCellText(event)}
      </span>
    </div>
  );
}

function TaskCompleteButton({
  event,
  compact = false,
}: {
  event: CalendarEventItem;
  compact?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={event.completed ? "未完了にする" : "完了にする"}
      className={cn(
        "group/task-check grid shrink-0 place-items-center rounded-full border bg-transparent p-0 leading-none transition",
        compact ? "h-3.5 w-3.5" : "h-4 w-4",
        isPending ? "cursor-wait opacity-60" : "cursor-pointer",
      )}
      style={{
        borderColor: event.color,
        backgroundColor: event.completed ? event.color : "transparent",
        color: event.completed ? "#ffffff" : event.color,
      }}
      type="button"
      disabled={isPending}
      onPointerDown={(pointerEvent) => pointerEvent.stopPropagation()}
      onClick={(clickEvent) => {
        clickEvent.stopPropagation();
        startTransition(() => {
          void toggleCalendarTaskCompleted(event.id, !event.completed).then(() => {
            router.refresh();
          });
        });
      }}
    >
      <CheckIcon
        className={cn(
          compact ? "h-2 w-2" : "h-2.5 w-2.5",
          event.completed ? "opacity-100" : "opacity-0 group-hover/task-check:opacity-100",
        )}
      />
    </button>
  );
}

function getItemTypeLabel(event: CalendarEventItem) {
  if (event.type === "TASK") {
    return "タスク";
  }

  if (event.type === "DEADLINE") {
    return "締切";
  }

  return "予定";
}

function getDayPopoverTitle(event: CalendarEventItem) {
  const title = event.type === "DEADLINE" ? `【締切】 ${event.title}` : event.title;
  return event.company ? `${event.company.name}/${title}` : title;
}

function DateWithWeekday({ dateKey }: { dateKey: string }) {
  const [, month, day] = dateKey.split("-").map(Number);
  const dayOfWeek = getDayOfWeek(dateKey);

  return (
    <>
      {month}月{day}日
      <span>({WEEKDAYS[dayOfWeek]})</span>
    </>
  );
}

function formatDateLabel(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

function getItemPrefix(event: CalendarEventItem) {
  if (event.type === "TASK") {
    return "";
  }

  if (event.type === "DEADLINE") {
    return "締切 ";
  }

  return "";
}

function formatCalendarDisplayText(event: CalendarEventItem) {
  const title = `${getItemPrefix(event)}${event.title}`;

  return [
    formatEventTimeLabel(event),
    event.company ? `${event.company.name}/${title}` : title,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatCalendarCellText(event: CalendarEventItem) {
  const typeLabel = event.type === "DEADLINE" ? "締切 " : "";

  return [
    formatEventTimeLabel(event),
    event.company ? `${event.company.name}/${typeLabel}${event.title}` : `${typeLabel}${event.title}`,
  ]
    .filter(Boolean)
    .join(" ");
}

function formatEventTimeLabel(event: CalendarEventItem) {
  return event.allDay ? "終日" : formatJstTime(new Date(event.startsAt));
}

function formatListTimeLabel(event: CalendarEventItem) {
  const date = new Date(event.startsAt);
  const [, month, day] = formatJstDateKey(date).split("-").map(Number);
  const time = event.allDay ? "終日" : formatJstTime(date);

  return `${month}/${day} ${time}`;
}

function formatUntilStart(event: CalendarEventItem) {
  const diff = new Date(event.startsAt).getTime() - Date.now();
  const abs = Math.abs(diff);
  const day = Math.floor(abs / (24 * 60 * 60 * 1000));
  const hour = Math.floor((abs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minute = Math.floor((abs % (60 * 60 * 1000)) / (60 * 1000));
  const value = day > 0 ? `${day}日${hour}時間` : hour > 0 ? `${hour}時間${minute}分` : `${minute}分`;

  return diff >= 0 ? `開始まで ${value}` : `${value}経過`;
}

function isPastEvent(event: CalendarEventItem) {
  return new Date(event.endsAt).getTime() < Date.now();
}

function getItemSurfaceClass(event: CalendarEventItem) {
  if (event.type === "TASK") {
    return "border-transparent bg-[#f5f5f5]";
  }

  if (event.type === "DEADLINE") {
    return "border-transparent";
  }

  return "border-l-2 bg-white";
}

function getItemStyle(event: CalendarEventItem): CSSProperties {
  if (event.type === "DEADLINE") {
    return {
      backgroundColor: mixHexWithWhite(event.color, 0.88),
      borderLeftColor: event.color,
      borderLeftWidth: 2,
    };
  }

  if (event.type === "TASK") {
    return {};
  }

  return {
    borderLeftColor: event.color,
  };
}

function mixHexWithWhite(hex: string, whiteRatio: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  if (Number.isNaN(value) || normalized.length !== 6) {
    return "#eef4ff";
  }

  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const mix = (channel: number) =>
    Math.round(channel * (1 - whiteRatio) + 255 * whiteRatio);

  return `rgb(${mix(red)}, ${mix(green)}, ${mix(blue)})`;
}

function getDayOfWeek(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
}

function getWeekendTextClass(dayOfWeek: number) {
  if (dayOfWeek === 0) {
    return "text-red-600";
  }

  if (dayOfWeek === 6) {
    return "text-blue-600";
  }

  return "text-[#666666]";
}

function buildCalendarPath(view: CalendarView, dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return `/calendar/${view}/${year}/${month}/${day}`;
}

function formatHour(hour: number) {
  return `${String(hour).padStart(2, "0")}:00`;
}

function getEventPlacement(event: CalendarEventItem) {
  if (event.allDay) {
    return { top: 0, height: 5 };
  }

  const startMinutes = getJstMinutes(new Date(event.startsAt));
  const endMinutes = getJstMinutes(new Date(event.endsAt));
  const duration = Math.max(30, endMinutes - startMinutes);
  const top = Math.min(96, Math.max(0, (startMinutes / 1440) * 100));
  const height = Math.min(100 - top, Math.max(4, (duration / 1440) * 100));

  return { top, height };
}

function getJstMinutes(date: Date) {
  const [hour, minute] = formatJstTime(date).split(":").map(Number);
  return hour * 60 + minute;
}

function getPointerYInElement(element: HTMLElement, clientY: number) {
  const rect = element.getBoundingClientRect();
  return Math.min(rect.height, Math.max(0, clientY - rect.top));
}

function getDragDefaultTimes(
  dateKey: string,
  startY: number,
  currentY: number,
  timelineHeight: number,
) {
  const fromY = Math.min(startY, currentY);
  const toY = Math.max(startY, currentY);
  const startMinutes = snapMinutes((fromY / timelineHeight) * 24 * 60);
  const draggedEndMinutes = snapMinutes((toY / timelineHeight) * 24 * 60);
  const endMinutes = Math.min(
    Math.max(startMinutes + 30, draggedEndMinutes || startMinutes + 60),
    23 * 60 + 59,
  );

  return {
    startsAt: formatDateTimeLocalFromMinutes(dateKey, startMinutes),
    endsAt: formatDateTimeLocalFromMinutes(dateKey, endMinutes),
  };
}

function snapMinutes(minutes: number) {
  return Math.min(23 * 60 + 30, Math.max(0, Math.round(minutes / 30) * 30));
}

function formatDateTimeLocalFromMinutes(dateKey: string, minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${dateKey}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function CalendarEventDrawer({
  companies,
  getDefaultTimes,
  onClose,
  state,
}: {
  companies: CalendarCompanyOption[];
  getDefaultTimes: (dateKey: string) => { startsAt: string; endsAt: string };
  onClose: () => void;
  state: DrawerState;
}) {
  const dateKey = state.mode === "create"
    ? state.dateKey
    : formatJstDateKey(new Date(state.event.startsAt));
  const defaultTimes = state.mode === "create" && state.startsAt && state.endsAt
    ? { startsAt: state.startsAt, endsAt: state.endsAt }
    : getDefaultTimes(dateKey);
  const action = state.mode === "create"
    ? createCalendarEvent
    : updateCalendarEvent.bind(null, state.event.id);
  const router = useRouter();

  async function submitCalendarEvent(formData: FormData) {
    await action(formData);
    onClose();
    router.refresh();
  }

  async function submitDeleteCalendarEvent() {
    if (state.mode !== "edit") {
      return;
    }

    await deleteCalendarEvent(state.event.id);
    onClose();
    router.refresh();
  }

  return (
    <Drawer
      open
      title={state.mode === "create" ? "予定を作成" : "予定を編集"}
      onClose={onClose}
    >
      <CalendarEventForm
        action={submitCalendarEvent}
        companies={companies}
        defaultStartsAt={defaultTimes.startsAt}
        defaultEndsAt={defaultTimes.endsAt}
        event={state.mode === "edit" ? state.event : undefined}
        onCancel={onClose}
      />
      {state.mode === "edit" ? (
        <form action={submitDeleteCalendarEvent} className="mt-4">
          <SubmitButton pendingLabel="削除中..." variant="danger">
            削除
          </SubmitButton>
        </form>
      ) : null}
    </Drawer>
  );
}
