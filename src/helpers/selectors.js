export function getAppointmentsForDay(state, day) {
  const apptArr = [];
  const filteredDays = state.days.filter((dayFilter) => dayFilter.name === day);

  if (filteredDays.length === 0) {
    return apptArr;
  }

  filteredDays[0].appointments.map((id) => {
    if (state.appointments[id]) {
      apptArr.push(state.appointments[id]);
    }
  });

  return apptArr;
}

export function getInterviewersForDay(state, day) {
  const filteredDays = state.days.map((dayArr) => dayArr.name);

  if (!day || !filteredDays.includes(day)) {
    return [];
  }

  const today = state.days.filter((dayObj) => dayObj.name === day)[0];

  const interviewersArr = today.interviewers.map(
    (interviewerId) => state.interviewers[interviewerId]
  );
  return interviewersArr;
}

export function getInterview(state, interview) {
  if (!state.interviewers || !interview) {
    return null;
  }

  return {
    interviewer: state.interviewers[interview.interviewer],
    student: interview.student,
  };
}
