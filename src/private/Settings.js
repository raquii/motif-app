import {
    Alert,
    Box,
    Button,
    Container,
    Divider,
    Grid,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputAdornment,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    Snackbar,
} from "@mui/material"
import SettingsIcon from "@mui/icons-material/Settings";
import SaveIcon from '@mui/icons-material/Save';
import { useSelector } from "react-redux";
import { Formik } from 'formik';
import * as yup from 'yup';

import { useUpdateSettingsMutation } from "../features/api";
import PageHeader from "./components/PageHeader";
import ResponsiveGrid from "./components/ResponsiveGrid";
import { useState } from "react";


const validationSchema = yup.object({
    cancellationDeadline: yup.number()
        .min(0, "Must be a positive number")
        .max(168, "Must be less than 169")
        .integer('Please use a whole number'),
    permitCancellations: yup.boolean(),
    permitEventRegistration: yup.boolean(),
    eventRegistrationDeadline: yup.number()
        .min(0, "Must be a positive number")
        .max(168, "Must be less than 169")
        .integer('Please use a whole number'),
    permitMakeUpCredits: yup.boolean(),
    issueMakeUpCreditBeforeDeadline: yup.boolean(),
    expireMakeUpCredits: yup.boolean(),
    maxCreditAge: yup.number()
        .min(0, "Must be a positive number")
        .max(365, "Must be less than 366")
        .integer('Please use a whole number'),
    limitTotalMakeUpCredits: yup.boolean(),
    maxTotalMakeUpCredits: yup.number()
        .min(0, "Must be a positive number")
        .max(50, "Must be less than 50")
        .integer("Please use a whole number"),
    cancellationPolicySummary: yup.string()
        .nullable(),
    defaultEventVisibility: yup.boolean(),
    defaultLessonPrice: yup.number()
        .min(0, "Must be a positive number")
        .lessThan(1000, "Whew. You're expensive. Must be less than 1000"),
    defaultLessonDuration: yup.number()
        .min(0, "Must be a positive number")
        .integer("Please use a whole number")
        .lessThan(480, "Must be less than 480 minutes"),
    initialView: yup.string()
        .matches(/(dayGridMonth|timeGridWeek|timeGridDay)/, "Invalid selection"),
    slotMinTime: yup.string()
        .matches(/(\d{2}:\d{2})/, "Invalid time selection"),
    slotMaxTime: yup.string()
        .matches(/(\d{2}:\d{2})/, "Invalid time selection"),
    weekends: yup.boolean(),
    location: yup.string()
        .nullable(),
    studentsCanEditProfile: yup.boolean(),
})

export default function Settings() {
    const settings = useSelector(state => state.settings.attributes)
    const id = useSelector(state => state.settings.id)
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);
    const [updateSettings] = useUpdateSettingsMutation();

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccess(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenError(false);
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} variant="filled" elevation={6} severity="success" sx={{ width: '100%' }}>
                    Changes Saved!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
                <Alert onClose={handleCloseError} variant="filled" elevation={6} severity="error" sx={{ width: '100%' }}>
                    Uh oh! Something went wrong.
                </Alert>
            </Snackbar>
            <PageHeader
                icon={<SettingsIcon fontSize="large" sx={{ mr: 1 }} color="primary" />}
                page="Settings"
            />
            <Formik
                initialValues={settings}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                    const castValues = { id: id, ...validationSchema.cast(values) }
                    updateSettings(castValues)
                    .unwrap()
                    .then((p)=> setOpenSuccess(true))
                    .catch((error) => setOpenError(true))
                }}
            >
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <Box component="form" sx={{ textAlign: 'left', display: 'flex', flexFlow: 'column' }}>
                        {/* Studio Settings */}
                        <Paper sx={{ p: 2, mb: 2, }}>
                            <ResponsiveGrid container spacing={2}>

                                <Grid item xs={12} md={12}>
                                    <Typography variant="h4" component="h2" gutterBottom color="primary">Studio Settings</Typography>
                                    <Divider />
                                </Grid>
                                <ResponsiveGrid container item xs={12} md={5}>
                                    <Grid item>
                                        <Typography variant="button" color="initial">
                                            Default Lesson Price
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Used when creating new students.
                                            <br />
                                            You can always change the price for individual students.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={3} alignSelf='center'>
                                    <TextField
                                        id="defaultLessonPrice"
                                        name="defaultLessonPrice"
                                        sx={{ width: 140 }}
                                        hiddenLabel
                                        size="small"
                                        value={values.defaultLessonPrice}
                                        error={touched.defaultLessonPrice && Boolean(errors.defaultLessonPrice)}
                                        helperText={touched.defaultLessonPrice && errors.defaultLessonPrice}
                                        onChange={handleChange}
                                        inputProps={{ style: { textAlign: 'center' }, }}
                                        InputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                        }}
                                    />
                                </Grid>

                                <ResponsiveGrid item container xs={12} md={5}>
                                    <Grid item>
                                        <Typography variant="button" color="initial">
                                            Default Lesson Duration
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <Typography variant="caption" color="initial">
                                            Used when creating new events.
                                            <br />
                                            You can always change how long individual events are.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={3} alignSelf='center'>
                                    <TextField
                                        id="defaultLessonDuration"
                                        name="defaultLessonDuration"
                                        hiddenLabel
                                        size="small"
                                        sx={{ width: 140 }}
                                        value={values.defaultLessonDuration}
                                        error={touched.defaultLessonDuration && Boolean(errors.defaultLessonDuration)}
                                        helperText={touched.defaultLessonDuration && errors.defaultLessonDuration}
                                        onChange={handleChange}
                                        inputProps={{
                                            inputMode: 'numeric',
                                            pattern: '[0-9]*',
                                            style: { textAlign: 'center' }
                                        }}
                                        InputProps={{ endAdornment: <InputAdornment position="end">minutes</InputAdornment> }}
                                    />
                                </Grid>

                                <ResponsiveGrid item xs={12} md={5}>
                                    <Grid item>
                                        <Typography variant="button" color="initial">
                                            Studio Location
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Visible to students and parents.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={5}>
                                    <TextField
                                        id="location"
                                        size="small"
                                        hiddenLabel
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        value={values.location}
                                        error={touched.location && Boolean(errors.location)}
                                        helperText={touched.location && errors.location}
                                        onChange={handleChange}
                                    />
                                </Grid>

                                <ResponsiveGrid item container xs={12} md={5} alignSelf='center'>
                                    <Grid item>
                                        <Typography variant="button" color="initial">
                                            Students Can Edit Their Profiles
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Allow students in your studio to edit their own profile information.
                                        </Typography>
                                    </Grid>

                                </ResponsiveGrid>
                                <Grid item xs={12} md={5} alignSelf='center'>
                                    <FormControl component="fieldset">
                                        <RadioGroup row
                                            aria-label="students-can-edit-profile"
                                            id="studentsCanEditProfile"
                                            name="studentsCanEditProfile"
                                            value={values.studentsCanEditProfile.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </ResponsiveGrid>
                        </Paper>

                        {/* cancellation policy */}
                        <Paper sx={{ p: 2, mb: 2, }} >
                            <ResponsiveGrid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Typography variant="h4" component="h2" gutterBottom color="primary">Cancellation Policies</Typography>
                                    <Divider />
                                </Grid>
                                <ResponsiveGrid item container xs={12} md={5}>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Cancellation Policy Summary
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            A typed summary of your cancellation and make-up policy, visible to students and parents.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={6} alignSelf='center'>
                                    <TextField
                                        id="cancellationPolicySummary"
                                        name="cancellationPolicySummary"
                                        fullWidth
                                        hiddenLabel
                                        multiline
                                        minRows={3}
                                        value={values.cancellationPolicySummary}
                                        error={touched.cancellationPolicySummary && Boolean(errors.cancellationPolicySummary)}
                                        helperText={touched.cancellationPolicySummary && errors.cancellationPolicySummary}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                <ResponsiveGrid item container xs={12} md={5}>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Allow Cancellations
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Permit students to cancel via the app.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={5} alignSelf='center'>
                                    <FormControl component="fieldset">
                                        <RadioGroup row
                                            aria-label="allow-cancellations"
                                            name="permitCancellations"
                                            id="permitCancellations"
                                            value={values.permitCancellations.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                {(values.permitCancellations === 'true' || values.permitCancellations === true) &&
                                    <>
                                        <ResponsiveGrid item container xs={12} md={5} alignSelf='center'>
                                            <Grid item >
                                                <Typography variant="button" color="initial">
                                                    Cancellation Deadline
                                                </Typography>
                                            </Grid>
                                        </ResponsiveGrid>

                                        <Grid item xs={12} md={3} alignSelf='center'>
                                            <TextField
                                                id="cancellationDeadline"
                                                name="cancellationDeadline"
                                                hiddenLabel
                                                size="small"
                                                sx={{ width: 140 }}
                                                value={values.cancellationDeadline}
                                                error={touched.cancellationDeadline && Boolean(errors.cancellationDeadline)}
                                                helperText={touched.cancellationDeadline && errors.cancellationDeadline}
                                                onChange={handleChange}
                                                inputProps={{ style: { textAlign: 'center' }, }}
                                                InputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    </>
                                }
                                <ResponsiveGrid item container xs={12} md={5} alignSelf='center'>
                                    <Grid item>
                                        <Typography variant="button" color="initial">
                                            Allow Make-Up Credits
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>

                                <Grid item xs={12} md={5} alignSelf='center'>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup row
                                            aria-label="allow-makeups"
                                            name="permitMakeUpCredits"
                                            id="permitMakeUpCredits"
                                            value={values.permitMakeUpCredits.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </FormControl>
                                </Grid>
                                {(values.permitMakeUpCredits === 'true' || values.permitMakeUpCredits === true) && <>
                                    <ResponsiveGrid item container xs={12} md={5}>
                                        <Grid item >
                                            <Typography variant="button" color="initial">
                                                Expire Make-Up Credits
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="caption" color="initial">
                                                Set maximum age for make-up credits.
                                            </Typography>
                                        </Grid>
                                    </ResponsiveGrid>
                                    <Grid item xs={12} md={3} alignSelf='center'>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend"></FormLabel>
                                            <RadioGroup row
                                                aria-label="expire-makeups"
                                                name="expireMakeUpCredits"
                                                id="expireMakeUpCredits"
                                                value={values.expireMakeUpCredits.toString()}
                                                onChange={handleChange}>
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                    {(values.expireMakeUpCredits === 'true' || values.expireMakeUpCredits === true) && <>
                                        <ResponsiveGrid item container xs={12} md={2} alignSelf='center'>
                                            <Grid item sx={{ textAlign: 'right' }}>
                                                <Typography variant="button" color="initial">
                                                    Make-Up Credit Lifespan
                                                </Typography>
                                            </Grid>
                                        </ResponsiveGrid>
                                        <Grid item xs={12} md={2} alignSelf='center'>
                                            <TextField
                                                id="maxCreditAge"
                                                name="maxCreditAge"
                                                hiddenLabel
                                                sx={{ width: 120 }}
                                                size="small"
                                                value={values.maxCreditAge}
                                                error={touched.maxCreditAge && Boolean(errors.maxCreditAge)}
                                                helperText={touched.maxCreditAge && errors.maxCreditAge}
                                                onChange={handleChange}
                                                inputProps={{ style: { textAlign: 'center' }, }}
                                                InputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    </>}
                                    <ResponsiveGrid item container xs={12} md={5}>
                                        <Grid item >
                                            <Typography variant="button" color="initial">
                                                Limit Accrued Make-Up Credits
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="caption" color="initial">
                                                Set a maximum allowance of accrued make-up credits.
                                            </Typography>
                                        </Grid>
                                    </ResponsiveGrid>
                                    <Grid item xs={12} md={3} alignSelf='center'>
                                        <FormControl component="fieldset">
                                            <FormLabel component="legend"></FormLabel>
                                            <RadioGroup row
                                                aria-label="limit-makeups"
                                                name="limitTotalMakeUpCredits"
                                                id="limitTotalMakeUpCredits"
                                                value={values.limitTotalMakeUpCredits.toString()}
                                                onChange={handleChange}>
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>

                                        </FormControl>
                                    </Grid>
                                    {(values.limitTotalMakeUpCredits === 'true' || values.limitTotalMakeUpCredits === true) && <>
                                        <ResponsiveGrid item container xs={12} md={2} alignSelf='center'>
                                            <Grid item sx={{ textAlign: 'right' }}>
                                                <Typography variant="button" color="initial">
                                                    Max Accrued Make-Up Credits
                                                </Typography>
                                            </Grid>
                                        </ResponsiveGrid>
                                        <Grid item xs={12} md={2} alignSelf='center'>
                                            <TextField
                                                id="maxTotalMakeUpCredits"
                                                name="maxTotalMakeUpCredits"
                                                hiddenLabel
                                                size="small"
                                                sx={{ width: 120 }}
                                                value={values.maxTotalMakeUpCredits}
                                                error={touched.maxTotalMakeUpCredits && Boolean(errors.maxTotalMakeUpCredits)}
                                                helperText={touched.maxTotalMakeUpCredits && errors.maxTotalMakeUpCredits}
                                                onChange={handleChange}
                                                inputProps={{ style: { textAlign: 'center' }, }}
                                                InputProps={{
                                                    inputMode: 'numeric',
                                                    pattern: '[0-9]*',
                                                    endAdornment: <InputAdornment position="end">credits</InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    </>}
                                    <ResponsiveGrid item container xs={12} md={5} alignSelf='center'>
                                        <Grid item >
                                            <Typography variant="button" color="initial">
                                                Issue Make-Up Credits Automatically
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="caption" color="initial">
                                                If a student cancels before the <strong>cancellation deadline</strong>, a credit will automatically be issued.
                                            </Typography>
                                        </Grid>
                                    </ResponsiveGrid>
                                    <Grid item xs={12} md={5} alignSelf='center'>
                                        <FormControl component="fieldset">
                                            <RadioGroup row
                                                aria-label="limit-makeups"
                                                name="issueMakeUpCreditBeforeDeadline"
                                                value={values.issueMakeUpCreditBeforeDeadline.toString()}
                                                onChange={handleChange}>
                                                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="false" control={<Radio />} label="No" />
                                            </RadioGroup>

                                        </FormControl>
                                    </Grid>
                                </>}
                            </ResponsiveGrid>
                        </Paper>

                        {/* Calendar Settings */}
                        <Paper sx={{ p: 2, mb: 2, }} >
                            <ResponsiveGrid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Typography variant="h4" component="h2" gutterBottom color="primary">Calendar Settings</Typography>
                                    <Divider />
                                </Grid>
                                <ResponsiveGrid item container xs={12} md={5}>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Default Calendar View
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={5} alignSelf='center'>
                                    <TextField
                                        id="initialView"
                                        name="initialView"
                                        select
                                        hiddenLabel
                                        size="small"
                                        value={values.initialView}
                                        aria-label="initial-calendar-view-setting"
                                        error={touched.initialView && Boolean(errors.initialView)}
                                        helperText={touched.initialView && errors.initialView}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="dayGridMonth">Month</MenuItem>
                                        <MenuItem value="timeGridWeek">Week</MenuItem>
                                        <MenuItem value="timeGridDay">Day</MenuItem>
                                    </TextField>

                                </Grid>
                                <ResponsiveGrid item container xs={12} md={5}>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Calendar Display Hours
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Set the hours visible on your calendar when in 'Week' or 'Day' view.
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <ResponsiveGrid container item xs={12} md={4} alignItems='center'>
                                    <Grid item xs={3}>
                                        <TextField
                                            id="slotMinTime"
                                            name="slotMinTime"
                                            hiddenLabel
                                            select
                                            variant="standard"
                                            size="small"
                                            value={values.slotMinTime}
                                            error={touched.slotMinTime && Boolean(errors.slotMinTime)}
                                            helperText={touched.slotMinTime && errors.slotMinTime}
                                            onChange={handleChange}
                                            aria-label="start-time-calendar-display"
                                        >
                                            <MenuItem value="00:00">12 am</MenuItem>
                                            <MenuItem value="01:00">1 am</MenuItem>
                                            <MenuItem value="02:00">2 am</MenuItem>
                                            <MenuItem value="03:00">3 am</MenuItem>
                                            <MenuItem value="04:00">4 am</MenuItem>
                                            <MenuItem value="05:00">5 am</MenuItem>
                                            <MenuItem value="06:00">6 am</MenuItem>
                                            <MenuItem value="07:00">7 am</MenuItem>
                                            <MenuItem value="08:00">8 am</MenuItem>
                                            <MenuItem value="09:00">9 am</MenuItem>
                                            <MenuItem value="10:00">10 am</MenuItem>
                                            <MenuItem value="11:00">11 am</MenuItem>
                                            <MenuItem value="12:00">12 pm</MenuItem>
                                            <MenuItem value="13:00">1 pm</MenuItem>
                                            <MenuItem value="14:00">2 pm</MenuItem>
                                            <MenuItem value="15:00">3 pm</MenuItem>
                                            <MenuItem value="16:00">4 pm</MenuItem>
                                            <MenuItem value="17:00">5 pm</MenuItem>
                                            <MenuItem value="18:00">6 pm</MenuItem>
                                            <MenuItem value="19:00">7 pm</MenuItem>
                                            <MenuItem value="20:00">8 pm</MenuItem>
                                            <MenuItem value="21:00">9 pm</MenuItem>
                                            <MenuItem value="22:00">10 pm</MenuItem>
                                            <MenuItem value="23:00">11 pm</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={2} >
                                        <Typography variant="button" component="p" color="initial">
                                            to
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <TextField
                                            id="slotMaxTime"
                                            name="slotMaxTime"
                                            select
                                            hiddenLabel
                                            variant="standard"
                                            value={values.slotMaxTime}
                                            size="small"
                                            aria-label="end-time-calendar-display"
                                            error={touched.slotMaxTime && Boolean(errors.slotMaxTime)}
                                            helperText={touched.slotMaxTime && errors.slotMaxTime}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="00:00">12 am</MenuItem>
                                            <MenuItem value="01:00">1 am</MenuItem>
                                            <MenuItem value="02:00">2 am</MenuItem>
                                            <MenuItem value="03:00">3 am</MenuItem>
                                            <MenuItem value="04:00">4 am</MenuItem>
                                            <MenuItem value="05:00">5 am</MenuItem>
                                            <MenuItem value="06:00">6 am</MenuItem>
                                            <MenuItem value="07:00">7 am</MenuItem>
                                            <MenuItem value="08:00">8 am</MenuItem>
                                            <MenuItem value="09:00">9 am</MenuItem>
                                            <MenuItem value="10:00">10 am</MenuItem>
                                            <MenuItem value="11:00">11 am</MenuItem>
                                            <MenuItem value="12:00">12 pm</MenuItem>
                                            <MenuItem value="13:00">1 pm</MenuItem>
                                            <MenuItem value="14:00">2 pm</MenuItem>
                                            <MenuItem value="15:00">3 pm</MenuItem>
                                            <MenuItem value="16:00">4 pm</MenuItem>
                                            <MenuItem value="17:00">5 pm</MenuItem>
                                            <MenuItem value="18:00">6 pm</MenuItem>
                                            <MenuItem value="19:00">7 pm</MenuItem>
                                            <MenuItem value="20:00">8 pm</MenuItem>
                                            <MenuItem value="21:00">9 pm</MenuItem>
                                            <MenuItem value="22:00">10 pm</MenuItem>
                                            <MenuItem value="23:00">11 pm</MenuItem>
                                        </TextField>
                                    </Grid>
                                </ResponsiveGrid>
                                <ResponsiveGrid item container xs={12} md={5} alignItems='center'>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Show Weekends
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={5} alignItems='center'>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup row
                                            aria-label="display-weekends"
                                            name="weekends"
                                            id="weekends"
                                            value={values.weekends.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>

                                <ResponsiveGrid item container xs={12} md={5} alignItems='center'>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Default Event Visibility
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Toggle the default visibility of new calendar events.
                                            <br />
                                            <em>Students can always see events they are registered for.</em>
                                        </Typography>
                                    </Grid>
                                </ResponsiveGrid>
                                <Grid item xs={12} md={5} alignItems='center'>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup row
                                            aria-label="default-event-visiblity"
                                            name="defaultEventVisibility"
                                            id="defaultEventVisibility"
                                            value={values.defaultEventVisibility.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Public" />
                                            <FormControlLabel value="false" control={<Radio />} label="Private" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} md={5}>
                                    <Grid item >
                                        <Typography variant="button" color="initial">
                                            Allow Students to Register for Events
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={9}>
                                        <Typography variant="caption" color="initial">
                                            Allow students to register for events with open student slots.
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={5} alignItems='center'>
                                    <FormControl component="fieldset">
                                        <FormLabel component="legend"></FormLabel>
                                        <RadioGroup row
                                            aria-label="permit-event-registration"
                                            name="permitEventRegistration"
                                            id="permitEventRegistration"
                                            value={values.permitEventRegistration.toString()}
                                            onChange={handleChange}>
                                            <FormControlLabel value="true" control={<Radio />} label="Yes" />
                                            <FormControlLabel value="false" control={<Radio />} label="No" />
                                        </RadioGroup>

                                    </FormControl>
                                </Grid>
                                {(values.permitEventRegistration === 'true' || values.permitEventRegistration === true) && <>
                                    <ResponsiveGrid container item xs={12} md={5}>
                                        <Grid item >
                                            <Typography variant="button" color="initial">
                                                Event Registration Deadline
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={9}>
                                            <Typography variant="caption" color="initial">
                                                Specify how soon before an event a student must register.
                                            </Typography>
                                        </Grid>
                                    </ResponsiveGrid>
                                    <Grid item xs={12} md={5} alignItems='center'>
                                        <TextField
                                            id="eventRegistrationDeadline"
                                            name="eventRegistrationDeadline"
                                            hiddenLabel
                                            size="small"
                                            sx={{ width: 140 }}
                                            value={values.eventRegistrationDeadline}
                                            error={touched.eventRegistrationDeadline && Boolean(errors.eventRegistrationDeadline)}
                                            helperText={touched.eventRegistrationDeadline && errors.eventRegistrationDeadline}
                                            onChange={handleChange}
                                            inputProps={{ style: { textAlign: 'center' }, }}
                                            InputProps={{
                                                inputMode: 'numeric',
                                                pattern: '[0-9]*',
                                                endAdornment: <InputAdornment position="end">hours</InputAdornment>,
                                            }}
                                        />
                                    </Grid>
                                </>}

                            </ResponsiveGrid>
                        </Paper>
                        <Box sx={{
                            position: 'sticky',
                            bottom: 10,
                            zIndex: 100,
                            alignSelf: 'end'
                        }}>
                            <Button
                                size='large'
                                variant="contained"
                                color="secondary"
                                type="submit"
                                onClick={handleSubmit}
                                startIcon={<SaveIcon />}
                                sx={{ borderRadius: 10 }}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box >
                )
                }
            </Formik >
        </Container >
    )
}
