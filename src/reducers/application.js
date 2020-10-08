export default function reducer(state, action) {
  // const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const setSpots = (state, action) => {
    const days = state.days;
    let numSpotsChanged;

    if (action.value.type === "newAppt") {
      numSpotsChanged = -1;
    } else if (action.value.type === "editAppt") {
      numSpotsChanged = 0;
    } else if (action.value.type === "cancelAppt") {
      numSpotsChanged = +1;
    }

    const spotsChanged = days.map((day) => {
      if (state.day === day.name) {
        const remSpots = day.spots + numSpotsChanged;
        day.spots = remSpots;
        return {...day};
      } else {
        return day;
      }
    });
    return {...state, days: spotsChanged};
  };

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
      const initialState = {
        ...state,
        appointments: action.value.appointments,
      };
      const days = setSpots(initialState, action);
      return {
        ...initialState,
        ...days,
      };
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}
