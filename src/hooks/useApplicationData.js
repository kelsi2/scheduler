import {useReducer, useEffect} from "react";
import axios from "axios";
import reducer from "reducer/application";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
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
        }
      });
    });
  }, []);

  const setDay = (day) => dispatch({type: SET_DAY, value: day});

  function bookInterview(id, interview, adding) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    // depending if a user is adding or editing an appointment, this will determine is a spot is added or not
    const type = adding ? "newAppt" : "editAppt";
    return axios.put(`/api/appointments/${id}`, appointment).then(() => {
      dispatch({type: SET_INTERVIEW, value: {appointments, type}});
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview},
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios.delete(`/api/appointments/${id}`, appointment).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        value: {appointments: appointments, type: "cancelAppt"},
      });
    });
  }
  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
