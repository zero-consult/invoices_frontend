import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";
import type {TimesheetEntry} from "../types/timesheet";

export type TimesheetState = {
    timesheetEntries: TimesheetEntry[]
}

const initialState: TimesheetState = {
    timesheetEntries: [],
}


const timesheetSlice = createSlice({
    name: 'timesheet',
    initialState: initialState,
    reducers: {
        loadTimesheetEntries: (state, action: PayloadAction<TimesheetEntry[]>) => {
            state.timesheetEntries = action.payload
        },
    },
    selectors: {
        selectTimesheetEntries: state => state.timesheetEntries,
    }
})

export const {loadTimesheetEntries} = timesheetSlice.actions

export const {
    selectTimesheetEntries
} = timesheetSlice.getSelectors((rootState: RootState) => rootState.timesheet)

export default timesheetSlice