/**
 * Midnight at the start of the day the given date falls in, in local time.
 *
 * @param {Date} date
 * @returns {Date}
 */
function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * @param {Date} fromDate
 * @param {Date} [now]
 * @returns {{ totalDays: number, years: number, months: number, days: number }}
 */
export function dateSpan(fromDate, now = new Date()) {
    const diff = { totalDays: 0, years: 0, months: 0, days: 0 };

    if (now <= fromDate) return diff;

    /*
     * Count whole calendar days, not elapsed milliseconds.
     *
     * `Math.floor((now - fromDate) / 86400000)` looks equivalent and is not.
     * The clean date is local midnight while `now` carries a time of day, so
     * when a daylight saving change falls between them the span is an hour
     * short of (or long by) a whole number of days. The time of day usually
     * absorbs that hour — but not in the first hour after midnight, where the
     * count floors to one day FEWER, nor in the last hour before it, where it
     * floors to one day MORE.
     *
     * That is a narrow window and it is the worst possible one: midnight is
     * exactly when someone checks whether they have made 90 days. Before this
     * change, someone clean since 1 January 2021 looking at 00:30 on 1 April
     * was told 89 days.
     *
     * Normalising both ends to local midnight removes the offset before it can
     * be truncated away. Math.round rather than floor, because the day the
     * clocks change leaves the division at N.958 or N.042 rather than exactly N.
     */
    diff.totalDays = Math.round((startOfDay(now).getTime() - startOfDay(fromDate).getTime()) / 86400000);

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
