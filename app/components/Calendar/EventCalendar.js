import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import styles from './calendar-jss';

const localizer = momentLocalizer(moment);

function Event(event) {
  return (
    <span className="eventBlock">{event.title}</span>
  );
}

function EventCalendar(props) {
  const eventStyleGetter = event => {
    const backgroundColor = '#' + event.hexColor;
    const style = {
      backgroundColor,
    };
    return {
      style
    };
  };

  const allViews = Object.keys(Views).map(k => Views[k]);

  const {
    classes,
    events,
    handleEventClick
  } = props;
  return (
    <Paper className={classes.root}>
      <Calendar
        localizer={localizer}
        className={classes.calendarWrap}
        selectable
        events={events}
        defaultView="work_week"
        views={allViews}
        step={60}
        showMultiDayTimes
        scrollToTime={new Date()}
        defaultDate={new Date()}
        onSelectEvent={(selectedEvent) => handleEventClick(selectedEvent)}
        eventPropGetter={(eventStyleGetter)}
        onSelectSlot={slotInfo =>
          // eslint-disable-next-line
          console.log(
            // eslint-disable-next-line
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            // eslint-disable-next-line
            `\nend: ${slotInfo.end.toLocaleString()}` +
            `\naction: ${slotInfo.action}`
          )
        }
        components={{
          event: Event
        }}
      />
    </Paper>
  );
}

EventCalendar.propTypes = {
  classes: PropTypes.object.isRequired,
  events: PropTypes.array.isRequired,
  handleEventClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(EventCalendar);
