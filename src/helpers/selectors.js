export default function getAppointmentsForDay(state, day) {
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
