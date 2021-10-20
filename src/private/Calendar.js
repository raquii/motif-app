import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Container, Paper, Grid } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

import './calendar/calendar.css';

import PageHeader from './components/PageHeader';
import CalendarToolbar from './calendar/CalendarToolbar';
import EventTypes from './calendar/EventTypes';
import EventForm from './calendar/EventForm';
import EventSummary from './calendar/EventSummary';

export default function Calendar() {
  const settings = useSelector(state => state.settings.attributes);
  const events = useSelector(state => state.events);

  const [selectedEvent, setSelectedEvent] = useState({});

  const calendarRef = useRef();

  const [openMenu, setOpenMenu] = useState({
    eventTypes: false,
    eventSummary: false,
  });

  const handleMenus = (menu) => {
    switch (menu) {
      case 'eventTypes':
        setOpenMenu({ ...openMenu, eventTypes: true })
        break;
      case 'eventSummary':
        setOpenMenu({ ...openMenu, eventSummary: true })
        break;

      default:
        setOpenMenu({
          eventTypes: false,
          eventSummary: false,
        })
        break;
    }
  };

  const handleEventClick = (e) => {
    const id = e.event.id;
    const event = events.find(evt=> evt.id === id);
    setSelectedEvent(event);
    handleMenus('eventSummary')
  };

  const { path, url } = useRouteMatch();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {openMenu.eventTypes &&
        <EventTypes
          closeMenu={handleMenus}
          open={openMenu.eventTypes}
        />
      }
      {openMenu.eventSummary &&
        <EventSummary 
        event={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        closeMenu={handleMenus}
        open={openMenu.eventSummary}
        url={url} 
        />
      }
      <Switch>
        <Route exact path={`${path}/event-details`}>
          <EventForm />
        </Route >
        <Route path={`${path}/event-details/:id`}>
          <EventForm event={selectedEvent} setSelectedEvent={setSelectedEvent} />
        </Route >
        <Route path={`${path}/default-event-details`}>
          <EventForm defaultLesson={true}/>
        </Route >
        <Route exact path={`${path}`}>
          <PageHeader icon={<EventIcon fontSize="large" sx={{ mr: 1 }} />} page="Calendar" />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <CalendarToolbar
                  handleMenus={handleMenus}
                  calendarRef={calendarRef}
                  url={url}
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, height: 'auto' }}>
                <div id='calendar'>
                  <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin]}
                    initialView={settings.initialView}
                    weekends={false}
                    ref={calendarRef}
                    events={events}
                    eventClick={handleEventClick}
                    nowIndicator={true}
                    slotMinTime={settings.slotMinTime}
                    slotMaxTime={settings.slotMaxTime}
                    eventColor="#ee7d68"
                    height='auto'
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </Container>
  )
}
