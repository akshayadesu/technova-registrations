'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import * as Dialog from '@radix-ui/react-dialog';
import './calendar.css';
const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    eventDate: '',
    eventName: '',
    description: '',
    templeId: ''
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState({});

  useEffect(() => {
    fetchTemples(); // Fetch temples on component mount
  }, []);

  const fetchTemples = async () => {
    try {
      const response = await axios.get('http://localhost:5000/temples');
      setTemples(response.data);
      // Set default selected temple (first temple in the list)
      setSelectedTemple(response.data[0] || {});
      setNewEvent(prevState => ({
        ...prevState,
        templeId: response.data[0]?.id // Set default templeId for new events
      }));
      fetchEventsForMonth(currentDate, response.data[0]?.id); // Fetch events for default temple
    } catch (error) {
      console.error('Error fetching temples:', error);
    }
  };

  const fetchEventsForMonth = async (date, templeId) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
    try {
      const response = await axios.get('http://localhost:5000/api/events', {
        params: {
          templeId,
          year,
          month
        }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleTempleChange = async (event) => {
    const templeId = event.target.value;
    const selected = temples.find(temple => temple.id === parseInt(templeId));
    setSelectedTemple(selected || {});
    setNewEvent(prevState => ({
      ...prevState,
      templeId
    }));
    fetchEventsForMonth(currentDate, templeId);
  };

  const renderEventsForDate = (date) => {
    const dayEvents = events.filter(event => new Date(event.event_date).toDateString() === date.toDateString());
    return dayEvents.map(event => (
      <Card key={event.id} className="event">
        <div className="event-name">{event.event_name}</div>
        <div className="event-description">{event.description}</div>
        <Button onClick={() => deleteEvent(event.id)}>Delete</Button>
      </Card>
    ));
  };

  const renderCalendar = () => {
    const dates = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Fill dates array with date objects for each day of the month
    for (let date = new Date(startOfMonth); date <= endOfMonth; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    const weeks = [];
    let week = [];

    // Loop through dates array and organize them into weeks (arrays of 7 days)
    dates.forEach((date, index) => {
      // Check if the current date is the start of a new week
      if (date.getDay() === 0 && week.length > 0) {
        weeks.push(week);
        week = []; // Reset week array for the new week
      }

      // Push the current date into the week array
      week.push(date);

      // If it's the last date in the array, push the last week into the weeks array
      if (index === dates.length - 1) {
        weeks.push(week);
      }
    });

    return (
      <div className="calendar-grid">
        {weeks.map((week, index) => (
          <div key={index} className="calendar-week">
            {week.map((date, index) => (
              <div key={index} className="calendar-date">
                <div className="date">{date.getDate()}</div>
                {renderEventsForDate(date)}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const addEvent = async () => {
    try {
      await axios.post('http://localhost:5000/api/events', newEvent);
      setNewEvent({
        eventDate: '',
        eventName: '',
        description: '',
        templeId: selectedTemple.id
      });
      fetchEventsForMonth(currentDate, selectedTemple.id);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await axios.delete('http://localhost:5000/api/events/${eventId}');
      fetchEventsForMonth(currentDate, selectedTemple.id);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <select value={selectedTemple.id || ''} onChange={handleTempleChange}>
          {temples.map(temple => (
            <option key={temple.id} value={temple.id}>{temple.name}</option>
          ))}
        </select>
        <Button onClick={handlePrevMonth}>Previous</Button>
        <div className="h2">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <Button onClick={handleNextMonth}>Next</Button>
      </div>
      <Button onClick={() => setDialogOpen(true)}>Add Event</Button>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title className="dialog-title">Add Event</Dialog.Title>
          <Dialog.Close className="dialog-close" />
          <div className="add-event-form">
            <Input type="date" name="eventDate" value={newEvent.eventDate} onChange={handleInputChange} />
            <Input type="text" name="eventName" placeholder="Event Name" value={newEvent.eventName} onChange={handleInputChange} />
            <Input type="text" name="description" placeholder="Description" value={newEvent.description} onChange={handleInputChange} />
            <Button onClick={addEvent}>Add Event</Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
      {renderCalendar()}
    </div>
  );
};

export default Calendar;