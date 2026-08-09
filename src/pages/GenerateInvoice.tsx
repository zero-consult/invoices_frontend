import {useDispatch, useSelector} from "react-redux";
import {loadCustomerIds, loadCustomers, selectCustomerIds, selectCustomers} from "../redux/customer.slice.ts";
import {
    loadSingleInvoice,
    loadSingleInvoiceCustomerId,
    resetSingleInvoice,
    selectSelectedInvoice
} from "../redux/invoice.slice.ts";
import moment, {type Moment} from "moment";
import {InvoiceApiFp, type InvoiceStatus, InvoicingMonthApiFp} from "../types/invoices";
import {formatCurrency} from "../utils/SalaryUtils.ts";
import {loadTimesheetEntries, selectTimesheetEntries} from "../redux/timesheet.slice.ts";
import {useEffect, useState} from "react";
import {Configuration, CustomerApiFp} from "../types/people";
import {INVOICES_BACKEND_HOST, PEOPLE_BACKEND_HOST, TIMESHEET_BACKEND_HOST} from "../Constants.ts";
import axios from "axios";
import {handleError} from "../redux/error.slice.ts";
import {TimesheetApiFp} from "../types/timesheet";
import {Save} from "lucide-react";
import {useTranslation} from "react-i18next";
import {selectPayslipMonthFormatted, setPayslipMonth} from "../redux/invoicingMonth.slice.ts";
import {useParams} from "react-router";

function GenerateInvoice() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {invoiceId} = useParams();
    const customers = useSelector(selectCustomers);
    const customerIds = useSelector(selectCustomerIds);
    const invoice = useSelector(selectSelectedInvoice);
    const payslipMonth = useSelector(selectPayslipMonthFormatted);
    const timesheetEntries = useSelector(selectTimesheetEntries)
    const [invoiceFrom, setInvoiceFrom] = useState(moment() as Moment | undefined);

    const totalHours = timesheetEntries.reduce((s, entry) => s + moment(entry.endTime, "hh:mm").diff(moment(entry.startTime, "hh:mm"), "hours"), 0);

    const hiringRatePerHour = customers.find(c => c.id === invoice.customerId)?.hiringRatePerHour;

    async function fetchCustomers() {
        const customersList = await CustomerApiFp(new Configuration({basePath: PEOPLE_BACKEND_HOST})).customersList();
        try {
            const customersListListResponse = await customersList(axios);
            dispatch(loadCustomers(customersListListResponse.data));
            if (customersListListResponse.data.length > 0) {
                dispatch(loadSingleInvoiceCustomerId(customersListListResponse.data[0].id!))
            }
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    async function fetchCustomerDate() {
        if (invoice.customerId) {
            const invoicingDateCustomer = await InvoiceApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).getInvoiceDateOfCustomer(invoice.customerId, invoice.id);
            try {
                const invoiceDateCustomerResponse = await invoicingDateCustomer(axios);
                if (invoiceDateCustomerResponse.status === 200) {
                    setInvoiceFrom(moment(invoiceDateCustomerResponse.data, "YYYY-MM-DD").add(1, "day"));
                } else {
                    setInvoiceFrom(undefined)
                }
            } catch (error) {
                dispatch(handleError(error))
            }
        }
    }

    async function fetchTimesheets() {
        if (invoiceFrom && invoiceFrom.isSameOrAfter(moment(payslipMonth).subtract(1, "day"))) {
            dispatch(loadTimesheetEntries([]));
        } else {
            const timesheetList = await TimesheetApiFp(new Configuration({basePath: TIMESHEET_BACKEND_HOST})).timesheetsList((invoiceFrom || moment().subtract(5, "years")).format("YYYY-MM-DD"), invoice.invoiceUntil, undefined, invoice.customerId);
            try {
                const timesheetListResponse = await timesheetList(axios);
                dispatch(loadTimesheetEntries(timesheetListResponse.data));
            } catch (error) {
                dispatch(handleError(error))
            }
        }
    }

    async function fetchPayslipMonth() {
        const payslipMonth = await InvoicingMonthApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).getCurrentPayslipMonth();
        try {
            const payslipMonthResponse = await payslipMonth(axios);
            dispatch(setPayslipMonth(payslipMonthResponse.data));
            if (moment(payslipMonthResponse.data, "YYYY-MM-DD").isBefore(moment(invoice.invoiceUntil, "YYYY-MM-DD"))) {
                dispatch(loadSingleInvoice({
                    ...invoice,
                    invoiceUntil: moment(payslipMonthResponse.data, "YYYY-MM-DD").subtract(1, "day").format("YYYY-MM-DD")
                }));
            }
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    async function fetchCustomerIdsWithConceptInvoice() {
        if (!invoiceId) {
            const customersWithConceptInvoiceList = await InvoiceApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).getCustomersWithConceptInvoices();
            try {
                const customersWithConceptInvoiceListResponse = await customersWithConceptInvoiceList(axios);
                dispatch(loadCustomerIds(customersWithConceptInvoiceListResponse.data));
            } catch (error) {
                dispatch(handleError(error))
            }
        }
    }

    useEffect(() => {
        fetchPayslipMonth();
        fetchCustomers();
        fetchCustomerIdsWithConceptInvoice();
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchCustomerDate();
    }, [invoice.customerId, invoice.id]);

    useEffect(() => {
        fetchTimesheets();
    }, [invoiceFrom, invoice.customerId, invoice.invoiceUntil])

    async function fetchInvoice(invoiceId: string) {
        const invoiceFetch = await InvoiceApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).getInvoice(invoiceId);
        try {
            const invoiceFetchResponse = await invoiceFetch(axios);
            dispatch(loadSingleInvoice(invoiceFetchResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    useEffect(() => {
        if (typeof invoiceId !== "undefined") {
            fetchInvoice(invoiceId);
        } else {
            dispatch(resetSingleInvoice())
        }
    }, [invoiceId]);

    async function saveInvoice() {
        if (invoice.id && typeof invoice.id !== "undefined") {
            const editInvoice = await InvoiceApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).editInvoice(invoice.id, invoice);
            try {
                await editInvoice(axios);
                window.location.href = "/invoices"
            } catch (error) {
                dispatch(handleError(error));
            }
        } else {
            const generateInvoice = await InvoiceApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).generateInvoice(invoice);
            try {
                await generateInvoice(axios);
                window.location.href = "/invoices"
            } catch (error) {
                dispatch(handleError(error));
            }
        }
    }

    return <>
        <div className="grid grid-cols-3 gap-4 mb-5 p-5 pb-0">
            <div className="col-span-3">
                <label
                    className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.labels.customer")}</label>
                <select
                    className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                    value={invoice.customerId}
                    onChange={e => dispatch(loadSingleInvoice({...invoice, customerId: e.target.value}))}>
                    {customers.filter(customer => {
                        return !customerIds.includes(customer.id || "")
                    }).map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
            </div>
            <div>
                <label
                    className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.labels.invoice_date")}</label>
                <input readOnly={true} type="date"
                       className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                       value={moment().format("YYYY-MM-DD")}/>
            </div>
            <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.labels.invoice_until")}</label>
                <input type="date"
                       className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                       min={(invoiceFrom || moment().subtract(5, "years")).format("YYYY-MM-DD")}
                       max={moment(payslipMonth).subtract(1, "day").format("YYYY-MM-DD")}
                       value={invoice.invoiceUntil}
                       onChange={e => dispatch(loadSingleInvoice({...invoice, invoiceUntil: e.target.value}))}/>
            </div>
            <div>
                <label
                    className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.labels.expiration_date")}</label>
                <input type="date"
                       className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                       value={invoice.expireDate}
                       onChange={e => dispatch(loadSingleInvoice({...invoice, expireDate: e.target.value}))}/>
            </div>
            <div className="col-span-3">
                <label
                    className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.labels.status")}</label>
                <select
                    className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                    value={invoice.status}
                    onChange={e => dispatch(loadSingleInvoice({...invoice, status: e.target.value as InvoiceStatus}))}>
                    {(["Concept", "Sent", "Paid"] as InvoiceStatus[]).map(s => <option key={s}>{s}</option>)}
                </select>
            </div>
        </div>

        {/* Totaal preview */}
        <div className="flex w-full justify-start pl-5 pr-5">
            <div className="space-y-1 w-full text-sm w-48">
                {[[t("generate_invoice.hours"), totalHours], [t("generate_invoice.hiring_rate_per_hour"), formatCurrency(hiringRatePerHour || 0)], [t("generate_invoice.subtotal"), formatCurrency(totalHours * (hiringRatePerHour || 0))], [t("generate_invoice.vat", {percent: invoice.vatPercent}), formatCurrency(totalHours * (hiringRatePerHour || 0) * (invoice.vatPercent) / 100)], [t("generate_invoice.total"), formatCurrency(totalHours * (hiringRatePerHour || 0) * (invoice.vatPercent + 100) / 100)]].map(([l, v], i) => (
                    <div key={l}
                         className={`flex w-full justify-between ${i === 4 ? "font-semibold border-t border-border pt-1 mt-1 text-foreground" : "text-muted-foreground"}`}>
                        <span>{l}</span><span style={i === 4 ? {
                        fontFamily: "'DM Mono', monospace",
                        color: "var(--primary)"
                    } : {fontFamily: "'DM Mono', monospace"}}>{v}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className={"pl-5 pr-5 pt-5"}>
            <label
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t("generate_invoice.notes")}</label>
            <textarea
                className="w-full bg-input-background text-foreground placeholder:text-muted-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                rows={2} placeholder={t("generate_invoice.optional_remarks")} value={invoice.notes}
                onChange={e => dispatch(loadSingleInvoice({...invoice, notes: e.target.value}))}/>
        </div>

        <div className="col-span-2 p-5">
            {
                !invoiceFrom || invoiceFrom.isBefore(moment(payslipMonth).subtract(1, "day")) ?
                    <button onClick={() => saveInvoice()}
                            className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                        <Save className="w-4 h-4"/>{t('generate_invoice.save')}
                    </button>
                    :
                    <></>
            }
        </div>
    </>
}

export default GenerateInvoice;