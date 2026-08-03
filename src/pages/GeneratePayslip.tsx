import {useDispatch, useSelector} from "react-redux";
import {loadEmployees, selectEmployees} from "../redux/employee.slice.ts";
import {Plus, Save, Trash2} from "lucide-react";
import {calculateNetSalary, formatCurrency} from "../utils/SalaryUtils.ts";
import {loadSinglePayslip, selectSelectedPayslip} from "../redux/payslip.slice.ts";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
import {Configuration, EmployeeApiFp} from "../types/people";
import {INVOICES_BACKEND_HOST, PEOPLE_BACKEND_HOST} from "../Constants.ts";
import axios from "axios";
import {handleError} from "../redux/error.slice.ts";
import {InvoicingMonthApiFp, PayslipApiFp} from "../types/invoices";
import {selectPayslipMonth, setPayslipMonth} from "../redux/invoicingMonth.slice.ts";
import moment from "moment";

function GeneratePayslip() {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const payslipMonth = useSelector(selectPayslipMonth);
    const employees = useSelector(selectEmployees);
    const selectedPayslip = useSelector(selectSelectedPayslip);

    function updateAllowance(i: number, field: "label" | "amount", val: string | number) {
        dispatch(loadSinglePayslip({
            ...selectedPayslip,
            allowances: selectedPayslip.allowances.map((a, idx) => idx === i ? {
                ...a,
                [field]: field === "label" ? val : Number(val)
            } : a)
        }));
    }

    async function fetchEmployees() {
        const employeeList = await EmployeeApiFp(new Configuration({basePath: PEOPLE_BACKEND_HOST})).employeesList();
        try {
            const employeeListResponse = await employeeList(axios);
            dispatch(loadEmployees(employeeListResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    async function fetchPayslipMonth() {
        const payslipMonth = await InvoicingMonthApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).getCurrentPayslipMonth();
        try {
            const payslipMonthResponse = await payslipMonth(axios);
            dispatch(setPayslipMonth(payslipMonthResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    useEffect(() => {
        if (payslipMonth) {
            dispatch(loadSinglePayslip({...selectedPayslip, month: payslipMonth}))
        }
    }, [payslipMonth])

    useEffect(() => {
        const employee = employees.filter((emp) => emp.id === selectedPayslip.employeeId).pop();
        if (employee) {
            dispatch(loadSinglePayslip({...selectedPayslip, grossSalary: employee.grossWage}));
        }
    }, [employees, selectedPayslip.employeeId])

    useEffect(() => {
        fetchEmployees()
        fetchPayslipMonth();
    }, []);

    async function savePayslip() {
        const generatePayslip = await PayslipApiFp(new Configuration({basePath: INVOICES_BACKEND_HOST})).generatePayslip(selectedPayslip);
        try {
            await generatePayslip(axios);
            window.location.href = "/payslips";
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    return <div className="grid grid-cols-2 gap-4 p-5">
        <div className="col-span-2">
            <label
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t('generate_payslip.labels.employee')}</label>
            <select
                className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring appearance-none cursor-pointer"
                value={selectedPayslip.employeeId}
                onChange={e => dispatch(loadSinglePayslip({...selectedPayslip, employeeId: e.target.value}))}>
                {employees.map(e => <option key={e.id} value={e.id}>{e.firstName + " " + e.lastName}</option>)}
            </select>
        </div>
        <div className="col-span-2">
            <label
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t('generate_payslip.labels.month')}</label>
            <input type="month"
                   className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                   min={moment(payslipMonth, "yyyy-MM-dd").format("yyyy-MM")}
                   value={moment(selectedPayslip.month, "yyyy-MM-dd").format("yyyy-MM")}
                   onChange={e => dispatch(loadSinglePayslip({
                       ...selectedPayslip,
                       month: moment(e.target.value, "yyyy-MM").format("yyyy-MM-dd")
                   }))}/>
        </div>
        <div className="col-span-2">
            <label
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t('generate_payslip.labels.gross_wage')}
                (€)</label>
            <input type="number" min="0" step="50"
                   className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                   value={selectedPayslip.grossSalary} onChange={e => dispatch(loadSinglePayslip({
                ...selectedPayslip,
                grossSalary: Number(e.target.value)
            }))}/>
        </div>
        <div className="col-span-2">
            <label
                className="block text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">{t('generate_payslip.labels.tax_rate')}
                (%)</label>
            <input type="number" min="0" max="100" step="0.01"
                   className="w-full bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                   value={selectedPayslip.taxRate}
                   onChange={e => dispatch(loadSinglePayslip({...selectedPayslip, taxRate: Number(e.target.value)}))}/>
        </div>

        {/* Allowances */}
        <div className="col-span-2">
            <label
                className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{t('generate_payslip.labels.allowances')}</label>
            <div className="space-y-2">
                {selectedPayslip.allowances.map((a, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                        <input
                            className="col-span-8 bg-input-background text-foreground placeholder:text-muted-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                            placeholder="Omschrijving" value={a.label}
                            onChange={e => updateAllowance(i, "label", e.target.value)}/>
                        <input type="number" min="0" step="1"
                               className="col-span-3 bg-input-background text-foreground text-sm rounded-md px-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                               placeholder="€" value={a.amount}
                               onChange={e => updateAllowance(i, "amount", e.target.value)}/>
                        <button onClick={() => dispatch(loadSinglePayslip({
                            ...selectedPayslip,
                            allowances: selectedPayslip.allowances.filter((_, idx) => idx !== i)
                        }))}
                                className="col-span-1 p-2 rounded-md hover:bg-destructive/15 hover:text-destructive text-muted-foreground disabled:opacity-20 transition-colors">
                            <Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                ))}
            </div>
            <button onClick={() => dispatch(loadSinglePayslip({
                ...selectedPayslip,
                allowances: [...selectedPayslip.allowances, {label: "", amount: 0}]
            }))}
                    className="mt-2 flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors">
                <Plus className="w-3.5 h-3.5"/>{t('generate_payslip.add_allowance')}
            </button>
        </div>

        {/* Net preview */}
        <div
            className="col-span-2 flex items-center justify-between px-4 py-3 bg-primary/10 rounded-md border border-primary/20">
            <span className="text-sm text-primary font-medium">{t('generate_payslip.net_wage_calc')}</span>
            <span className="text-base font-bold text-primary"
                  style={{fontFamily: "'DM Mono', monospace"}}>{formatCurrency(calculateNetSalary(selectedPayslip))}</span>
        </div>

        <div className="col-span-2">
            <button onClick={() => savePayslip()}
                    className="cursor-pointer w-full flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4"/>{t('generate_payslip.save')}
            </button>
        </div>
    </div>
}

export default GeneratePayslip