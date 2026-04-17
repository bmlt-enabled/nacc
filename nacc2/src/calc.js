/**
 * @param {Date} fromDate
 * @param {Date} [now]
 * @returns {{ totalDays: number, years: number, months: number, days: number }}
 */
export function dateSpan(fromDate, now = new Date()) {
    const diff = { totalDays: 0, years: 0, months: 0, days: 0 };

    if (now <= fromDate) return diff;

    diff.totalDays = Math.floor((now.getTime() - fromDate.getTime()) / 86400000);

    diff.years = now.getFullYear() - fromDate.getFullYear();
    diff.months = now.getMonth() - fromDate.getMonth();
    diff.days = now.getDate() - fromDate.getDate();

    if (diff.days < 0) {
        const numDays = new Date(fromDate.getFullYear(), fromDate.getMonth() + 1, 0).getDate();
        diff.months -= 1;
        diff.days += numDays;
    }

    if (diff.months < 0) {
        diff.months += 12;
        diff.years -= 1;
    }

    return diff;
}
