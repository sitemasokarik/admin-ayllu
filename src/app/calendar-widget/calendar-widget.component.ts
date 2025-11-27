import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.css'],
  imports: [FullCalendarModule],
})
export class CalendarWidgetComponent {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    editable: true,
    droppable: true,
    selectMirror: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    events: [
      { title: 'All Day Event', date: new Date().toISOString().split('T')[0] },
      { title: 'Meeting', date: new Date(new Date().setHours(10, 30)).toISOString() },
      { title: 'Lunch', date: new Date(new Date().setHours(12, 0)).toISOString() },
      { title: 'Birthday Party', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString() },
    ],
    select: this.onDateSelect.bind(this),
    eventClick: this.onEventClick.bind(this),
    eventDrop: this.onEventDrop.bind(this),
  };

  onDateSelect(selectInfo: DateSelectArg) {
    Swal.fire({
      input: 'text',
      title: 'Event title:',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const calendarApi = selectInfo.view.calendar;

        calendarApi.addEvent({
          title: result.value,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
          allDay: selectInfo.allDay
        });

        Swal.fire('Event Added!', '', 'success');
      } else if (result.isDismissed) {
        // Cancelled
      } else {
        Swal.fire('Title is empty!', '', 'warning');
      }
    });

    selectInfo.view.calendar.unselect();
  }

  onEventClick(clickInfo: EventClickArg) {
    Swal.fire({
      title: `Delete event: "${clickInfo.event.title}"?`,
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        clickInfo.event.remove();
        Swal.fire('Deleted!', '', 'success');
      }
    });
  }

  onEventDrop(dropInfo: EventDropArg) {
    Swal.fire('Event moved!', '', 'success');
  }
}
