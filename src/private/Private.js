import { Route, Switch } from "react-router";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard"
import Students from "./Students";
import Calendar from "./Calendar"
import Settings from "./Settings";
import Profile from "./Profile";
import Billing from "./Billing";


export default function Private() {
  
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box 
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    mt: 8
                }} 
            >
                <Switch>
                    <Route path='/dashboard'>
                        <Dashboard />
                    </Route>
                    <Route path='/students'>
                        <Students />
                    </Route>
                    <Route path='/calendar'>
                        <Calendar />
                    </Route>
                    <Route path='/billing'>
                        <Billing />
                    </Route>
                    <Route path='/settings'>
                        <Settings />
                    </Route>
                    <Route path='/profile'>
                        <Profile />
                    </Route>

                </Switch>
            </Box>
        </Box>
    )
}
