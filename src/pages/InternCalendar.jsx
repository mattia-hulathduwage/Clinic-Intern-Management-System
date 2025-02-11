import React, { useState, useEffect } from "react";
import SidebarIntern from "../components/SidebarIntern";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const InternCalendar = () => {
  const [events, setEvents] = useState([]); // State to store the events

  const localizer = momentLocalizer(moment);

  // Fetch task data (you can use useEffect or any other method)
  useEffect(() => {
      const fetchTasks = async () => {
        try {
          const doctorId = localStorage.getItem("trainee_id"); // ✅ Moved inside function
    
          if (!doctorId) {
            console.warn("Doctor ID not found in localStorage");
            return;
          }
    
          const urls = [
            `http://localhost:5000/api/internlabtasks?trainee_id=${doctorId}`,
            `http://localhost:5000/api/tasks/internwardvisit?trainee_id=${doctorId}`,
            `http://localhost:5000/api/completeinternlabtasks?trainee_id=${doctorId}`,
            `http://localhost:5000/api/tasks/completeinternwardvisit?trainee_id=${doctorId}`,
          ];
    
          const responses = await Promise.all(urls.map((url) => fetch(url)));
          const data = await Promise.all(responses.map((res) => res.json()));
    
          console.log("API Responses:", data);
    
          const formatTasks = (tasks, backgroundColor, borderColor = "none") =>
            tasks
              .map((task) => {
                let taskDate = moment(task.task_date, ["DD/MM/YYYY", "YYYY-MM-DDTHH:mm:ss.SSSZ"], true);
    
                if (!taskDate.isValid()) {
                  console.warn("Invalid task date:", task.task_date);
                  return null;
                }
    
                taskDate = moment.utc(taskDate).local();
    
                const shiftStartTime = task.shift_start ? moment(task.shift_start, "HH:mm:ss") : null;
                const shiftEndTime = task.shift_end ? moment(task.shift_end, "HH:mm:ss") : null;
    
                const taskStartDate = taskDate.toDate();
                const taskEndDate = taskDate.toDate();
    
                if (shiftStartTime && shiftEndTime) {
                  if (!shiftStartTime.isValid() || !shiftEndTime.isValid()) {
                    console.warn("Invalid shift times:", task.shift_start, task.shift_end);
                    return null;
                  }
                  if (shiftEndTime.isBefore(shiftStartTime)) {
                    console.warn("Shift end time before start time:", task);
                    return null;
                  }
                  taskStartDate.setHours(shiftStartTime.hours(), shiftStartTime.minutes(), 0);
                  taskEndDate.setHours(shiftEndTime.hours(), shiftEndTime.minutes(), 0);
                } else {
                  const [hours, minutes] = task.due_time ? task.due_time.split(":").map(Number) : [8, 0];
                  taskStartDate.setHours(hours, minutes, 0);
                  taskEndDate.setTime(taskStartDate.getTime() + 60 * 60 * 1000);
                }
    
                console.log("Event being added:", {
                  title: task.task_title,
                  start: taskStartDate,
                  end: taskEndDate,
                });
    
                return {
                  title: `${task.task_title} by #T00${task.trainee}`,
                  start: taskStartDate,
                  end: taskEndDate,
                  style: {
                    backgroundColor,
                    color: "black",
                    borderRadius: "10px",
                    padding: "7px",
                    fontSize: "12px",
                    whiteSpace: "pre-line",
                    border: borderColor !== "none" ? `0px solid ${borderColor}` : "none", // ✅ Conditional border
                    outline: "none",
                  },                
                };
              })
              .filter((event) => event !== null);
    
          const formattedEvents = [
            ...formatTasks(data[0]?.tasks || [], "#DAD2FF"),
            ...formatTasks(data[1]?.tasks || [], "#ffdd57"),
            ...formatTasks(data[2]?.tasks || [], "#B0A7E6", "transparent"),
            ...formatTasks(data[3]?.tasks || [], "#E6C14D", "transparent"),
          ];
    
          const uniqueEvents = formattedEvents.filter(
            (event, index, self) =>
              index === self.findIndex((e) => e.start.getTime() === event.start.getTime() && e.end.getTime() === event.end.getTime())
          );
    
          console.log("Final Events:", uniqueEvents);
    
          setEvents(uniqueEvents);
        } catch (error) {
          console.error("Error fetching tasks:", error);
        }
      };
    
      fetchTasks();
    }, []); // ✅ Empty dependency array since doctorId is retrieved inside

  

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Poppins, sans-serif",
    },
    content: {
      marginLeft: "290px",
      flex: 1,
      padding: "20px",
      backgroundColor: "white",
    },
    
  };

  return (
    <div style={styles.container}>
      <SidebarIntern />
      <div style={styles.content}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>Task Calendar</h1>
          
        </div>
        <div
          style={{
            height: "calc(100vh - 160px)",
            width: "1150px",
            marginTop: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "10px",
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            defaultView="week"
            step={60}
            timeslots={1}
            min={new Date(2023, 1, 1, 8, 0)}
            max={new Date(2023, 1, 1, 23, 59)}
            style={{
              height: "100%",
              maxWidth: "100%",
              overflowX: "auto",
            }}
            eventPropGetter={(event) => ({
              style: event.style,
            })}
            tooltipAccessor={(event) => `${event.title}`} // Show the full title as a tooltip
          />
        </div>
      </div>
      
    </div>
  );
};

export default InternCalendar;
