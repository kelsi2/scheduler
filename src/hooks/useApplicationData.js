import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  useEffect(() => {
    const promiseDays = axios.get("/api/days");
    const promiseAppts = axios.get("/api/appointments");
    const promiseInts = axios.get("/api/interviewers");
    const promises = [promiseDays, promiseAppts, promiseInts];

    Promise.all(promises).then((responseArr) => {
      setState((prev) => ({
        ...prev,
        days: responseArr[0].data,
        appointments: responseArr[1].data,
        interviewers: responseArr[2].data,
      }));
    });
  }, []);

  const setDay = (day) => setState({ ...state, day });

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    interview = null;
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
      setState({
        ...state,
        appointments,
      });
    });
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
