import { Frequency } from '../types';
import dateutil from '../dateutil';
import { Weekday } from '../weekday';
// tslint:disable-next-line:variable-name
var weekday_map = {
    MO: 0,
    TU: 1,
    WE: 2,
    TH: 3,
    FR: 4,
    SA: 5,
    SU: 6
};
export function handle_DTSTART(rrkwargs, _, value) {
    var parms = /^DTSTART(?:;TZID=([^:=]+))?(?::|=)(.*)/.exec(value);
    var ___ = parms[0], tzid = parms[1], dtstart = parms[2];
    rrkwargs['dtstart'] = dateutil.untilStringToDate(dtstart);
    if (tzid) {
        rrkwargs['tzid'] = tzid;
    }
}
export function handle_int(rrkwargs, name, value) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = parseInt(value, 10);
}
export function handle_int_list(rrkwargs, name, value) {
    // @ts-ignore
    rrkwargs[name.toLowerCase()] = value.split(',').map(function (x) { return parseInt(x, 10); });
}
export function handle_FREQ(rrkwargs, _, value) {
    rrkwargs['freq'] = Frequency[value];
}
export function handle_UNTIL(rrkwargs, _, value) {
    try {
        rrkwargs['until'] = dateutil.untilStringToDate(value);
    }
    catch (error) {
        throw new Error('invalid until date');
    }
}
export function handle_WKST(rrkwargs, _, value) {
    rrkwargs['wkst'] = weekday_map[value];
}
export function handle_BYWEEKDAY(rrkwargs, _, value) {
    // Two ways to specify this: +1MO or MO(+1)
    var splt;
    var i;
    var j;
    var n;
    var w;
    var wday;
    var l = [];
    var wdays = value.split(',');
    for (i = 0; i < wdays.length; i++) {
        wday = wdays[i];
        if (wday.indexOf('(') > -1) {
            // If it's of the form TH(+1), etc.
            splt = wday.split('(');
            w = splt[0];
            n = parseInt(splt.slice(1, -1)[0], 10);
        }
        else {
            // # If it's of the form +1MO
            for (j = 0; j < wday.length; j++) {
                if ('+-0123456789'.indexOf(wday[j]) === -1)
                    break;
            }
            n = wday.slice(0, j) || null;
            w = wday.slice(j);
            if (n)
                n = parseInt(n, 10);
        }
        var weekday = new Weekday(weekday_map[w], n);
        l.push(weekday);
    }
    rrkwargs['byweekday'] = l;
}
export var handlers = {
    BYDAY: handle_BYWEEKDAY,
    INTERVAL: handle_int,
    COUNT: handle_int,
    FREQ: handle_FREQ,
    UNTIL: handle_UNTIL,
    WKST: handle_WKST,
    BYSETPOS: handle_int_list,
    BYMONTH: handle_int_list,
    BYWEEKDAY: handle_BYWEEKDAY,
    BYMONTHDAY: handle_int_list,
    BYYEARDAY: handle_int_list,
    BYEASTER: handle_int_list,
    BYWEEKNO: handle_int_list,
    BYHOUR: handle_int_list,
    BYMINUTE: handle_int_list,
    BYSECOND: handle_int_list
};
//# sourceMappingURL=handlers.js.map