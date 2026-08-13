import Pagination, {PAGE_SIZE} from "../components/Pagination.tsx";
import {Download, LoaderCircle, Plus, Search, Sparkles, Trash2} from "lucide-react";
import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import moment from "moment";
import SortIcon from "../components/SortIcon.tsx";
import {loadEmployees, selectEmployees} from "../redux/employee.slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {loadPayslips, selectPayslips} from "../redux/payslip.slice.ts";
import {Link} from "react-router";
import {InvoicingMonthApiFp, type Payslip, PayslipApiFp} from "../types/invoices";
import {Configuration, EmployeeApiFp} from "../types/people";
import {INVOICES_BACKEND_HOST, PEOPLE_BACKEND_HOST} from "../Constants.ts";
import axios from "axios";
import {handleError} from "../redux/error.slice.ts";
import {selectPayslipMonthFormatted, setPayslipMonth} from "../redux/invoicingMonth.slice.ts";
import {calculateNetSalary, formatCurrency} from "../utils/SalaryUtils.ts";
import {selectToken} from "../redux/account.slice.ts";
import {getInitials} from "../utils/NameUtils.ts";

const INITIALS_COLORS = [
    "bg-blue-600", "bg-violet-600", "bg-rose-600",
    "bg-amber-600", "bg-teal-600", "bg-indigo-600",
];

function getAvatarColor(name: string) {
    return INITIALS_COLORS[name.charCodeAt(0) % INITIALS_COLORS.length];
}


function Paysliplist() {
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const token = useSelector(selectToken);
    const payslipMonthFormatted = useSelector(selectPayslipMonthFormatted);
    const [monthOffset, setMonthOffset] = useState(-1);
    const payslips = useSelector(selectPayslips);
    const employees = useSelector(selectEmployees);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<keyof Payslip>("month");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);

    async function fetchEmployees() {
        const employeeList = await EmployeeApiFp(new Configuration({accessToken: token, basePath: PEOPLE_BACKEND_HOST})).employeesList();
        try {
            const employeeListResponse = await employeeList(axios);
            dispatch(loadEmployees(employeeListResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    async function fetchPayslips() {
        const monthStart = moment().add(monthOffset, "month");
        const day = parseInt(moment(monthStart).format("D"));
        monthStart.subtract(day - 1, "days");
        const monthEnd = moment(monthStart).add(1, "month").subtract(1, "day")
        const payslipsList = await PayslipApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).payslipsList(monthStart.format("YYYY-MM-DD"), monthEnd.format("YYYY-MM-DD"));
        try {
            const payslipsListResponse = await payslipsList(axios);
            dispatch(loadPayslips(payslipsListResponse.data));
            let requiresRefresh = false;
            for(const payslip of payslipsListResponse.data) {
                if(!payslip.payslipFile) {
                    requiresRefresh = true;
                }
            }
            if(requiresRefresh) {
                setTimeout(() => {
                    fetchPayslips();
                }, 60 * 1000)
            }
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    async function fetchPayslipMonth() {
        const payslipMonth = await InvoicingMonthApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).getCurrentPayslipMonth();
        try {
            const payslipMonthResponse = await payslipMonth(axios);
            dispatch(setPayslipMonth(payslipMonthResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    useEffect(() => {
        fetchEmployees()
        fetchPayslipMonth();
    }, []);

    useEffect(() => {
        fetchPayslips()
    }, [monthOffset])

    const filtered = useMemo(() => {
        let list = [...payslips];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p => {
                const matchingEmployee = employees.find(e => e.id === p.employeeId);
                return (matchingEmployee?.firstName + ' ' + matchingEmployee?.lastName).toLowerCase().includes(q)
            });
        }
        list.sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [payslips, search, employees, sortKey, sortDir]);

    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSort(k: keyof Payslip) {
        if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else {
            setSortKey(k);
            setSortDir("asc");
        }
        setCurrentPage(1);
    }

    // Month range
    const today = moment();
    const dayOfMonth = parseInt(today.format("D"));
    const monthStart = moment().subtract(dayOfMonth - 1, "days").add(monthOffset, "months");
    const monthEnd = moment(monthStart).add(1, "month").subtract(1, "day");
    const monthLabel = `${monthStart.locale(i18n.resolvedLanguage || "en").format("D MMM")} – ${monthEnd.locale(i18n.resolvedLanguage || "en").format("D MMM YYYY")}`;

    const totalGrossThisMonth = payslips.reduce((s, p) => s + p.grossSalary, 0);
    const totalNetThisMonth = payslips.reduce((s, p) => s + calculateNetSalary(p), 0);

    async function downloadPayslipFile(ps: Payslip) {
        window.open(INVOICES_BACKEND_HOST + "/payslips/" + ps.id + "/file", '_blank')!.focus()
    }

    async function deletePayslip(ps: Payslip) {
        if(ps.id) {
            const deletePayslip = await PayslipApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).deletePayslip(ps.id);
            try {
                await deletePayslip(axios);
                fetchPayslips()
            } catch (error) {
                dispatch(handleError(error))
            }
        }
    }

    async function closePayslipMonth() {
        const closePayslipMonth = await InvoicingMonthApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).closeCurrentPayslipMonth();
        try {
            const closePayslipMonthResponse = await closePayslipMonth(axios);
            dispatch(setPayslipMonth(closePayslipMonthResponse.data))
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    return <>
        <header className="px-8 py-6 border-b border-border flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight"
                    style={{fontFamily: "'Instrument Sans', sans-serif"}}>{t('menu.payslips')}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">{monthLabel}</p>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-secondary rounded-md p-1">
                    <button onClick={() => {
                        setMonthOffset((w) => w - 1);
                        setCurrentPage(1);
                    }}
                            className="px-2.5 py-1 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">‹
                    </button>
                    <button onClick={() => {
                        setMonthOffset(0);
                        setCurrentPage(1);
                    }}
                            className="px-3 py-1 rounded text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                            style={{fontFamily: "'DM Mono', monospace"}}>{t('payslipslist.today')}
                    </button>
                    <button onClick={() => {
                        setMonthOffset((w) => w + 1);
                        setCurrentPage(1);
                    }}
                            className="px-2.5 py-1 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">›
                    </button>
                </div>
                {payslipMonthFormatted.isAfter(monthStart) ?
                    <button
                        disabled={true}
                        onClick={(event => event.stopPropagation())}
                        className={"cursor-not-allowed flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors "}>
                        <Plus className="w-4 h-4"/> {t('payslipslist.generate')}
                    </button>
                    :
                    <Link to={"/payslips/generate"}
                          onClick={(event => event.stopPropagation())}
                          className={"flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors "}>
                        <Plus className="w-4 h-4"/> {t('payslipslist.generate')}
                    </Link>
                }

            </div>
        </header>

        <div className="px-8 py-5 grid grid-cols-3 gap-4 border-b border-border">
            {[
                {label: t('payslipslist.card.total'), value: payslips.length, sub: t('menu.payslips')},
                {label: t('payslipslist.card.gross_total'), value: formatCurrency(totalGrossThisMonth), sub: ""},
                {label: t('payslipslist.card.net_total'), value: formatCurrency(totalNetThisMonth), sub: ""},
            ].map(({label, value, sub}) => (
                <div key={label} className="bg-card rounded-lg px-5 py-4 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1"
                       style={{fontFamily: "'DM Mono', monospace"}}>{label}</p>
                    <p className="text-2xl font-semibold text-foreground"
                       style={{fontFamily: "'Instrument Sans', sans-serif"}}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
            ))}
        </div>

        <div className="px-8 py-4 flex items-center gap-3 border-b border-border flex-wrap justify-between">
            <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <input
                    id={'search'}
                    className="w-full bg-input-background text-foreground placeholder:text-muted-foreground text-sm rounded-md pl-9 pr-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={t('payslipslist.search.placeholder')} value={search} onChange={e => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}/>
            </div>
            <button
                onClick={() => closePayslipMonth()}
                disabled={payslipMonthFormatted.format("YYYY-MM") !== monthStart.format("YYYY-MM")}
                className={(payslipMonthFormatted.format("YYYY-MM") !== monthStart.format("YYYY-MM") ? "cursor-not-allowed" : "cursor-pointer") + " flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"}>
                <Sparkles className="w-4 h-4"/>{t('payslipslist.close_month')}
            </button>
        </div>
        <Pagination page={currentPage} total={filtered.length} onChange={setCurrentPage}/>

        <div className="overflow-x-auto px-8 py-4">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="border-b border-border">
                    {([["employeeId", t('payslipslist.table.headers.employee')], ["month", t('payslipslist.table.headers.period')], ["grossSalary", t('payslipslist.table.headers.gross_salary')]] as [keyof Payslip, string][]).map(([k, l]) => (
                        <th key={k}
                            className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                            style={{fontFamily: "'DM Mono', monospace"}} onClick={() => handleSort(k)}>
                            <span className="inline-flex items-center gap-1">{l}<SortIcon active={sortKey === k}
                                                                                          dir={sortDir}/></span>
                        </th>
                    ))}
                    <th className="py-3 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-widest"
                        style={{fontFamily: "'DM Mono', monospace"}}>{t('payslipslist.table.headers.net_salary')}
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-widest"
                        style={{fontFamily: "'DM Mono', monospace"}}>{t('payslipslist.table.headers.actions')}
                    </th>
                </tr>
                </thead>
                <tbody>
                {filtered.length === 0 && <tr>
                    <td colSpan={6}
                        className="py-16 text-center text-muted-foreground text-sm">{t('payslipslist.table.empty')}
                    </td>
                </tr>}
                {paginated.map((ps, i) => {
                    const emp = employees.find(e => e.id === ps.employeeId);
                    const payslipMonth = moment(ps.month, "DD-MM-YYYY").format("MMMM YYYY");
                    return (
                        <tr key={ps.id}
                            className={`border-b border-border/50 hover:bg-card/60 transition-colors group ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
                            <td className="py-3.5 px-3">
                                {emp && (
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${getAvatarColor(emp.firstName + " " + emp.lastName)}`}>{getInitials(emp.firstName + " " + emp.lastName)}</div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{emp.firstName + " " + emp.lastName}</p>
                                            <p className="text-xs text-muted-foreground">{emp.functionTitle}</p>
                                        </div>
                                    </div>
                                )}
                            </td>
                            <td className="py-3.5 px-3 text-muted-foreground"
                                style={{fontFamily: "'DM Mono', monospace", fontSize: "0.8rem"}}>
                                {payslipMonth}
                            </td>
                            <td className="py-3.5 px-3 text-muted-foreground" style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.8rem"
                            }}>{formatCurrency(ps.grossSalary)}</td>
                            <td className="py-3.5 px-3 text-right font-semibold text-foreground"
                                style={{fontFamily: "'DM Mono', monospace"}}>{formatCurrency(calculateNetSalary(ps))}</td>
                            <td className="py-3.5 px-3 text-right">
                                <div
                                    className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {
                                        ps.payslipFile && typeof ps.payslipFile !== "undefined" ?
                                            <button
                                                className="p-1.5 rounded-md hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors"
                                                onClick={() => downloadPayslipFile(ps)}
                                                title={t('payslipslist.action.download')}><Download
                                                className="w-3.5 h-3.5"/>
                                            </button>
                                            :
                                            <div className={"p-1.5 rounded-md hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors"}><LoaderCircle className={"w-3.5 h-3.5 animate-spin"}/></div>
                                    }

                                    {moment(ps.month, "YYYY-MM-DD").isSameOrAfter(moment(payslipMonthFormatted, "YYYY-MM-DD")) ?
                                        <button
                                            id={'delete-' + ps.id}
                                            onClick={() => deletePayslip(ps)}
                                            className="p-1.5 rounded-md hover:bg-destructive/15 hover:text-destructive text-muted-foreground transition-colors">
                                            <Trash2 className="w-3.5 h-3.5"/></button>
                                        :
                                        <></>
                                    }

                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>

    </>
}

export default Paysliplist;