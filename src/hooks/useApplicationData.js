import React, { useReducer, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_SPOTS = "SET_SPOTS";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.value,
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          ...action.value,
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.value,
        };
      case SET_SPOTS:
        let days = state.days;
        let newSpots = days.map((day) => {
          if (state.day === day.name) {
            let remainingSpots = day.spots + action.value;
            day.spots = remainingSpots;
            return day;
          } else {
            return day;
          }
        });
        return {
          ...state,
          days: newSpots,
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
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
      dispatch({
        type: SET_APPLICATION_DATA,
        value: {
          days: responseArr[0].data,
          appointments: responseArr[1].data,
          interviewers: responseArr[2].data,
        },
      });
    });
  }, []);

  const setDay = (day) => dispatch({ type: SET_DAY, value: day });

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
      dispatch({ type: SET_INTERVIEW, value: appointments });
      dispatch({ type: SET_INTERVIEW, value: -1 });
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    interview = null;

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
      dispatch({ type: SET_SPOTS, value: +1 });
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
