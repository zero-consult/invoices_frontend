import {useEffect, useMemo, useState} from "react";
import {type Invoice, InvoiceApiFp, type InvoiceStatus} from "../types/invoices";
import Pagination, {PAGE_SIZE} from "../components/Pagination.tsx";
import {Download, LoaderCircle, Pencil, Plus, Receipt, Search, Trash2} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {loadInvoices, selectInvoices} from "../redux/invoice.slice.ts";
import {loadCustomers, selectCustomers} from "../redux/customer.slice.ts";
import {formatCurrency} from "../utils/SalaryUtils.ts";
import moment from "moment";
import SortIcon from "../components/SortIcon.tsx";
import {Link} from "react-router";
import {useTranslation} from "react-i18next";
import {INVOICES_BACKEND_HOST, PEOPLE_BACKEND_HOST} from "../Constants.ts";
import {Configuration, CustomerApiFp} from "../types/people";
import axios from "axios";
import {handleError} from "../redux/error.slice.ts";
import {selectToken} from "../redux/account.slice.ts";

const INV_STATUS_COLORS: Record<InvoiceStatus, string> = {
    Concept: "bg-gray-500/15 text-gray-400",
    Sent: "bg-sky-500/15 text-sky-400",
    Paid: "bg-emerald-500/15 text-emerald-400"
};

function Invoicelist() {
    const dispatch = useDispatch();
    const {t, i18n} = useTranslation();
    const token = useSelector(selectToken);
    const invoices = useSelector(selectInvoices);
    const customers = useSelector(selectCustomers);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "All">("All");
    const [sortKey, setSortKey] = useState<keyof Invoice>("invoiceDate");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [monthOffset, setMonthOffset] = useState(0);

    const filtered = useMemo(() => {
        let list = [...invoices];
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(inv => ("" + inv.invoiceNumber).includes(q) || customers.find(c => c.id === inv.customerId)?.companyName.toLowerCase().includes(q));
        }
        if (statusFilter !== "All") list = list.filter(inv => inv.status === statusFilter);
        list.sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [invoices, search, statusFilter, sortKey, sortDir]);

    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function handleSort(k: keyof Invoice) {
        if (sortKey === k) setSortDir(d => d === "asc" ? "desc" : "asc"); else {
            setSortKey(k);
            setSortDir("asc");
        }
        setCurrentPage(1);
    }

    const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.totalWithoutVat, 0);
    const openAmount = invoices.filter(i => i.status === "Sent").reduce((s, i) => s + i.totalWithoutVat, 0);

    async function downloadInvoiceFile(inv: Invoice) {
        window.open(INVOICES_BACKEND_HOST + "/invoice/" + inv.id + "/file", '_blank')!.focus()
    }

    async function fetchInvoices() {
        const monthStart = moment().add(monthOffset, "month");
        const day = parseInt(moment(monthStart).format("D"));
        monthStart.subtract(day - 1, "days");
        const monthEnd = moment(monthStart).add(1, "month").subtract(1, "day")
        const invoicesList = await InvoiceApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).invoiceList(monthStart.format("YYYY-MM-DD"), monthEnd.format("YYYY-MM-DD"));
        try {
            const invoicesListResponse = await invoicesList(axios);
            dispatch(loadInvoices(invoicesListResponse.data));
            let requiresRefresh = false;
            for (const invoice of invoicesListResponse.data) {
                if (!invoice.invoiceFile) {
                    requiresRefresh = true;
                }
            }
            if (requiresRefresh) {
                setTimeout(() => {
                    fetchInvoices();
                }, 60 * 1000)
            }
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [monthOffset])

    async function fetchCustomers() {
        const customersList = await CustomerApiFp(new Configuration({accessToken: token, basePath: PEOPLE_BACKEND_HOST})).customersList();
        try {
            const customersListListResponse = await customersList(axios);
            dispatch(loadCustomers(customersListListResponse.data));
        } catch (error) {
            dispatch(handleError(error))
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    // Month range
    const today = moment();
    const dayOfMonth = parseInt(today.format("D"));
    const monthStart = moment().subtract(dayOfMonth - 1, "days").add(monthOffset, "months");
    const monthEnd = moment(monthStart).add(1, "month").subtract(1, "day");
    const monthLabel = `${monthStart.locale(i18n.resolvedLanguage || "en").format("D MMM")} – ${monthEnd.locale(i18n.resolvedLanguage || "en").format("D MMM YYYY")}`;

    async function deleteInvoice(inv: Invoice) {
        if (inv.id) {
            const deleteInvoice = await InvoiceApiFp(new Configuration({accessToken: token, basePath: INVOICES_BACKEND_HOST})).deleteInvoice(inv.id);
            try {
                await deleteInvoice(axios);
                fetchInvoices()
            } catch (error) {
                dispatch(handleError(error))
            }
        }
    }

    return <>
        <header className="px-8 py-6 border-b border-border flex items-center justify-between">
            <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight"
                    style={{fontFamily: "'Instrument Sans', sans-serif"}}>{t("menu.invoices")}</h1>
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
                            style={{fontFamily: "'DM Mono', monospace"}}>{t('invoicelist.today')}
                    </button>
                    <button onClick={() => {
                        setMonthOffset((w) => w + 1);
                        setCurrentPage(1);
                    }}
                            className="px-2.5 py-1 rounded text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">›
                    </button>
                </div>
                <Link to={"/invoices/generate"}
                      className={"flex items-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors "}>
                    <Plus className="w-4 h-4"/> {t("invoicelist.generate")}
                </Link>
            </div>
        </header>

        <div className="px-8 py-5 grid grid-cols-4 gap-4 border-b border-border">
            {([
                {label: t("invoicelist.cards.total"), value: invoices.length, sub: t("invoicelist.cards.invoices"), mono: false},
                {label: t("invoicelist.cards.received"), value: formatCurrency(totalRevenue), sub: t("invoicelist.cards.paid"), mono: true},
                {label: t("invoicelist.cards.outstanding"), value: formatCurrency(openAmount), sub: t("invoicelist.cards.to_receive"), mono: true},
                {
                    label: t("invoicelist.cards.overdue"),
                    value: invoices.filter(i => i.status === "Sent" && moment().isAfter(moment(i.expireDate, "YYYY-MM-DD"))).length,
                    sub: t("invoicelist.cards.too_late"),
                    mono: false
                },
            ] as const).map(({label, value, sub, mono}) => (
                <div key={label} className="bg-card rounded-lg px-5 py-4 border border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1"
                       style={{fontFamily: "'DM Mono', monospace"}}>{label}</p>
                    <p className={`text-2xl font-semibold text-foreground ${mono ? "text-lg" : "text-2xl"}`}
                       style={{fontFamily: "'Instrument Sans', sans-serif"}}>{value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
            ))}
        </div>

        <div className="px-8 py-4 flex items-center gap-3 border-b border-border flex-wrap">
            <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
                <input
                    className="w-full bg-input-background text-foreground placeholder:text-muted-foreground text-sm rounded-md pl-9 pr-3 py-2 border border-border focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder={t("invoicelist.search.placeholder")} value={search} onChange={e => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                }}/>
            </div>
            <div className="flex items-center gap-2">
                {(["All", "Concept", "Sent", "Paid"] as const).map(s => (
                    <button key={s} onClick={() => {
                        setStatusFilter(s);
                        setCurrentPage(1);
                    }}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>{t("invoicelist.status." + s.toLowerCase())}</button>
                ))}
            </div>
        </div>

        <Pagination page={currentPage} total={filtered.length} onChange={setCurrentPage}/>

        <div className="overflow-x-auto px-8 py-4">
            <table className="w-full border-collapse text-sm">
                <thead>
                <tr className="border-b border-border">
                    {([["number", t("invoicelist.table.headers.number")], ["customerId", t("invoicelist.table.headers.customer")], ["date", t("invoicelist.table.headers.date")], ["dueDate", t("invoicelist.table.headers.expiration_date")], ["status", t("invoicelist.table.headers.status")]] as [keyof Invoice, string][]).map(([k, l]) => (
                        <th key={k}
                            className="text-left py-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-widest cursor-pointer select-none hover:text-foreground transition-colors"
                            style={{fontFamily: "'DM Mono', monospace"}} onClick={() => handleSort(k)}>
                            <span className="inline-flex items-center gap-1">{l}<SortIcon active={sortKey === k}
                                                                                          dir={sortDir}/></span>
                        </th>
                    ))}
                    <th className="py-3 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-widest"
                        style={{fontFamily: "'DM Mono', monospace"}}>{t("invoicelist.table.headers.amount")}
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-widest"
                        style={{fontFamily: "'DM Mono', monospace"}}>{t("invoicelist.table.headers.actions")}
                    </th>
                </tr>
                </thead>
                <tbody>
                {filtered.length === 0 && <tr>
                    <td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">
                        {t("invoicelist.table.empty")}
                    </td>
                </tr>}
                {paginated.map((inv, i) => {
                    const customer = customers.find(c => c.id === inv.customerId);
                    const overdue = inv.status === "Sent" && moment().isAfter(moment(inv.expireDate, "YYYY-MM-DD"));
                    return (
                        <tr key={inv.id}
                            className={`border-b border-border/50 hover:bg-card/60 transition-colors group ${i % 2 !== 0 ? "bg-muted/20" : ""}`}>
                            <td className="py-3.5 px-3">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center flex-shrink-0">
                                        <Receipt className="w-3.5 h-3.5 text-primary"/></div>
                                    <span className="font-medium text-foreground" style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "0.8rem"
                                    }}>{moment(inv.invoiceDate, "YYYY-MM-DD").format("YYYY")}-{inv.invoiceNumber}</span>
                                </div>
                            </td>
                            <td className="py-3.5 px-3">
                                <p className="font-medium text-foreground">{customer?.companyName}</p>
                                <p className="text-xs text-muted-foreground">{customer?.contactPersonFirstName + " " + customer?.contactPersonLastName}</p>
                            </td>
                            <td className="py-3.5 px-3 text-muted-foreground"
                                style={{fontFamily: "'DM Mono', monospace", fontSize: "0.8rem"}}>
                                {new Date(inv.invoiceDate).toLocaleDateString("nl-NL", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </td>
                            <td className="py-3.5 px-3"
                                style={{fontFamily: "'DM Mono', monospace", fontSize: "0.8rem"}}>
                    <span className={overdue ? "text-red-400" : "text-muted-foreground"}>
                      {new Date(inv.expireDate).toLocaleDateString("nl-NL", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                      })}
                    </span>
                            </td>
                            <td className="py-3.5 px-3"><span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${INV_STATUS_COLORS[inv.status]}`}>{t("invoicelist.status." + inv.status.toLowerCase())}</span>
                            </td>
                            <td className="py-3.5 px-3 text-right font-semibold text-foreground"
                                style={{fontFamily: "'DM Mono', monospace"}}>{formatCurrency(inv.totalWithoutVat)}</td>
                            <td className="py-3.5 px-3 text-right">
                                <div
                                    className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {
                                        inv.invoiceFile && typeof inv.invoiceFile !== "undefined" ?
                                            <button
                                                className="p-1.5 rounded-md hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors"
                                                onClick={() => downloadInvoiceFile(inv)}
                                                title={t('payslipslist.action.download')}><Download
                                                className="w-3.5 h-3.5"/>
                                            </button>
                                            :
                                            <div
                                                className={"p-1.5 rounded-md hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors"}>
                                                <LoaderCircle className={"w-3.5 h-3.5 animate-spin"}/></div>
                                    }
                                    {inv.status != "Paid" ?
                                        <Link to={"/invoices/" + inv.id + "/edit"}
                                              className="p-1.5 rounded-md hover:bg-primary/15 hover:text-primary text-muted-foreground transition-colors">
                                            <Pencil className="w-3.5 h-3.5"/>
                                        </Link>
                                        :
                                        <></>
                                    }
                                    {inv.status === "Concept" ?
                                        <button
                                            onClick={() => deleteInvoice(inv)}
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

export default Invoicelist;