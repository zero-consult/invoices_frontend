import type {Payslip} from "../types/invoices";

export function calculateNetSalary(p: Payslip) {
    let netSalary = p.grossSalary - (p.grossSalary * p.taxRate / 100);
    for(const allowance of p.allowances) {
        netSalary += allowance.amount;
    }
    return netSalary;
}

export function formatCurrency(n: number) {
    return new Intl.NumberFormat("nl-NL", {style: "currency", currency: "EUR"}).format(n);
}