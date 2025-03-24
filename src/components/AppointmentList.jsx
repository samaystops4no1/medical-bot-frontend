import { getAppointments } from "../utilities/backend";
import { Box } from "@mui/material";
import ListNavigation from "./ListNavigation";
import { useState, useEffect } from "react";

function AppointmentList({}) {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    setAppointments(getAppointments());
  }, []);

  return (
    <Box>
      <ListNavigation 
        listArray={appointments}
        mode="appointment" 
      />
    </Box>
  );
}

export default AppointmentList;
