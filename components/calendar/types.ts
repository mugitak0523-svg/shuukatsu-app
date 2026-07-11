export type CalendarEventItem = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  type: "EVENT" | "TASK" | "DEADLINE";
  completed: boolean;
  color: string;
  companyId: string | null;
  company: {
    id: string;
    name: string;
    color: string;
  } | null;
  location: string | null;
  description: string | null;
};

export type CalendarCompanyOption = {
  id: string;
  name: string;
};
