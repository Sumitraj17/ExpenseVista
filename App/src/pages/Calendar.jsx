import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import Details from "./Details.jsx";
import Form from "../components/Form.jsx";
import axios from "axios";
import { toast } from "react-hot-toast"; // Import react-hot-toast

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function MonthlyExpensesCalendar() {
  const [events, setEvents] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentViewDate, setCurrentViewDate] = useState(new Date()); // Tracks the currently viewed month

  // Handle selecting an event from the calendar
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDetailsOpen(true);
  };

  // Closes the details modal
  const update = (event, isOpen) => {
    setSelectedEvent(event);
    setIsDetailsOpen(isOpen);
  };

  // Closes the form modal
  const onFormClose = () => {
    setIsFormOpen(false);
  };

  // Handles submitting a new bill
  const handleSubmit = async (form) => {
    try {
      const resp = await axios.post(
        "http://localhost:5000/expense/addBill",
        { title: form.title, cost: form.cost, description: form.description, date: form.date },
        { withCredentials: true }
      );
      console.log("Bill added:", resp.data);
      // Show success toast
      toast.success("Bill added successfully!");
    } catch (error) {
      console.error("Error adding bill:", error);
      // Show error toast
      toast.error("Error adding bill. Please try again.");
    } finally {
      setIsFormOpen(false);
      setTrigger(!trigger); // Trigger re-fetch of data
    }
  };

  // Fetch events for the currently selected month and year
  const fetchEvents = async (month, year) => {
    try {
      const resp = await axios.post(
        "http://localhost:5000/expense/monthly",
        { month, year },
        { withCredentials: true }
      );

      const data = resp.data.data;
      console.log("Fetched data:", data);

      // Format the events for the calendar
      const fetchedEvents = data.map((event) => {
        const parsedDate = parse(event.date, "dd-MM-yyyy", new Date());
        return {
          title: `₹${event.total}`,
          start: parsedDate,
          end: parsedDate,
          date: event.date,
          bills: event.bills.map((bill) => ({
            title: bill.title,
            cost: bill.cost,
            description: bill.description,
          })),
        };
      });

      setEvents(fetchedEvents);
      // Show success toast
    } catch (error) {
      console.error("Error fetching events:", error);
      // Show error toast
      // toast.error("Error fetching events. Please try again.");
    }
  };

  // Fetch events whenever the month changes or a new bill is added
  useEffect(() => {
    const month = currentViewDate.getMonth() + 1;
    const year = currentViewDate.getFullYear();
    fetchEvents(month, year);
  }, [trigger, currentViewDate]);

  // Handle month navigation in the calendar
  const handleMonthChange = (date) => {
    setCurrentViewDate(date);
  };

  return (
    <div className="container mx-auto px-4 py-6 relative">
      <h1 className="text-3xl font-bold text-center mb-4">Monthly Expenses Calendar</h1>
      <button
        className="bg-black text-white rounded-lg p-2 m-3 text-xl hover:text-gray-400"
        onClick={() => setIsFormOpen(true)}
      >
        Add Bill
      </button>

      {/* Calendar Section */}
      <div className="relative">
        <div
          className={`${
            isDetailsOpen || isFormOpen ? "blur-sm pointer-events-none" : ""
          } bg-white shadow-md rounded-lg p-4 transition duration-300`}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={handleSelectEvent}
            onNavigate={handleMonthChange} // Triggers on month change
          />
        </div>

        {/* Event Details Modal */}
        {isDetailsOpen && <Details data={selectedEvent} update={update} />}

        {/* Event Form Modal */}
        {isFormOpen && <Form onSubmit={handleSubmit} onClose={onFormClose} />}
      </div>
    </div>
  );
}

export default MonthlyExpensesCalendar;
