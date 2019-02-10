function zip() {
    var args = [].slice.call(arguments);
    var shortest = args.length == 0 ? [] : args.reduce(function (a, b) {
        return a.length < b.length ? a : b
    });

    return shortest.map(function (_, i) {
        return args.map(function (array) { return array[i] })
    });
}

const existy = object => object !== "undefined";

class Week {
    constructor(date) {
        this.date = date || new Date();
        this.dates = get_week_dates(this.date);
    }

    changeDate(date) {
        this.date = date;
        this.dates = get_week_dates(date);
    }
}

const types = [
    "Розваж.",
    "Власний",
    "Кінопоказ",
    "УКР."
];
const default_type = types[0];

const series_names = [
    "Помста1",
    "Помста2",
    "Помста3",
    "Вечірка",
];

let schedule = [
    ["2019-01-01",
        [
            ["01010001", "07:00", "11:00",
                [
                    ["Помста1", 1, 1, "Розваж."],
                    ["Помста2", 2, 5, "Розваж."],
                ]
            ]
        ]
    ],
    ["2019-01-02",
        [
            ["01020001", "07:00", "11:00",
                [
                    ["Помста1", 1, 1, "Розваж."],
                    ["Помста2", 2, 5, "Розваж."],
                ]
            ],
            ["01020002", "19:00", "06:00",
                [
                    ["Помста1", 1, 1, "Розваж."],
                    ["Помста2", 2, 5, "Розваж."],
                ]
            ],
        ]
    ]
]
const dateToString = (date) => date.toISOString().slice(0, 10);
const datestrToBlockId = (str, i) => str.slice(5, 7) + str.slice(8, 10) + i.toString().padStart(4, "0");
const init_schedule = (date) => schedule = (get_week_dates(new Date(date))).map(date => [dateToString(date), []]);
const add_day = (date) => schedule.push([date.dateToString(), [[[]]]]);
const add_block = (date_str, start = "07:00", stop = "11:00") => {
    schedule.forEach((date_row, idx) => {
        if (date_row[0] === date_str) {
            const blocks = schedule[idx][1];
            blocks.push([datestrToBlockId(date_str, blocks.length + 1), start, stop, []]);
        }
    })
}

const add_sery = (sery, date_str, block_id) => {
    schedule.forEach((date_row, row_idx) => {
        if (date_row[0] === date_str) {
            const blocks = schedule[row_idx][1];
            blocks.forEach((block, i) => {
                if (block[0] === block_id) {
                    schedule[row_idx][1][i][3].push(sery)
                }
            })
        }
    })
}

console.log("AUE");
init_schedule("2019-02-07")
schedule.forEach(row => add_block(row[0]));
schedule.forEach(row => {
    console.log("ddddd===", row[0], dateToBlockid(row[0]));
    add_sery(["Помста1", 12, 15, "Розваж."], row[0], dateToBlockid(row[0]))
    console.log("---")
});
// add_block("2019-02-07");
// add_sery(["Помста1", 12, 15, "Розваж."], "2019-02-07", "02070001");

console.log(schedule);
console.log("AUE");


function dateToBlockid(date = new Date(), suffix = "0001") {
    if (date instanceof Date)
        return date.toISOString().slice(5, 7) + date.toISOString().slice(8, 10) + suffix
    if (typeof date == "string")
        return date.slice(5, 7) + date.slice(8, 10) + suffix
}



class SeriesStore {
    types = [
        "Розваж.",
        "Власний",
        "Кінопоказ",
        "УКР."
    ];

    series_names = [
        "Помста1",
        "Помста2",
        "Помста3",
        "Вечірка",
    ];

    default_sery = ["Помста1", 1, 1, "Розваж."];
    // default_content = [["Помста1", 1, 1, "Розваж."]];

    default_init = {
        series: [["Помста1", 1, 1, "Розваж."]],
        date: new Date(),
        block_id: dateToBlockid(),
        start_time: "07:00",
        stop_time: "11:00"
    }

    constructor(props = {}) {
        props = { ...this.default_init, ...props };
        this.series = this.filteredSeries(props.series);
        this.date = props.date;
        this.block_id = props.block_id;
        this.start_time = props.start_time;
        this.stop_time = props.stop_time;
    }

    get rows() { return this.series; }
    get first_idx() { return 1; }
    get last_idx() { return 2; }
    get series_name_idx() { return 0; }
    get type_idx() { return 3; }

    filteredSeries(series) {
        console.log("FILTER", series);
        return series.filter(sery => this.series_names.includes(sery[0]) && this.types.includes(sery[3]) && sery[1] > 0 && (sery[2] >= sery[1]));
    }

    setValue(row, cell, val) {
        if (cell === this.last_idx || cell === this.first_idx) {
            val = parseInt(val);
        }

        this.series[row][cell] = val;
        if (this.series[row][this.first_idx] > this.series[row][this.last_idx]) {
            this.series[row][this.first_idx] = this.series[row][this.last_idx];
        }
        return this;
    }



    push = (sery = this.default_sery) => {
        const [s, f, l, t] = sery;
        this.series.push([s, f, l, t]);
        return this;
    }

    pop = () => {
        this.series.pop();
        return this;
    }
}

class DayScheduleStore {
    default_date = new Date();
    default_series = [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]];

    constructor(props = {}) {
        props = { date: this.default_date, day_schedule: [this.new_seriesStore()], ...props };
        this.date = props.date;
        this.day_schedule = props.day_schedule;
    }

    new_seriesStore = (date = new Date(), suffix = "0001") => new SeriesStore({ series: this.default_series, block_id: dateToBlockid(date, suffix) });

    add_block() {
        const suffix = (this.day_schedule.length + 1).toString().padStart(4, "0");
        this.day_schedule.push(this.new_seriesStore(this.date, suffix));
    }
}

// class ScheduleStore {
//     defaul_dates = (new Week()).dates;
//     default_series = [["Вечірка", 1, 1, "Розваж."], ["Вечірка", 1, 3, "УКР."]];

//     default_init = {
//         dates: this.defaul_dates,
//         series_stores: this.defaul_dates.map(date => [new SeriesStore({ series: this.default_series, block_id: dateToBlockid(date) })])
//     }
//     constructor(props = {}) {
//         props = { ...props, ...this.default_init };
//         this.dates = props.dates;
//         this.series_stores = props.series_stores;
//         this.schedule = zip(this.dates, this.series_stores);
//         console.log('sched', this.schedule);
//     }
// }

// const default_content = [["Помста1", 1, 1]];

// class ScheduleStore {
//     constructor(schedule) {
//         if (schedule) {
//             this.table = schedule
//             return;
//         }
//         this.table = [];
//         const dates = (new Week()).dates;

//         this.table = dates.map((date) => {
//             const default_block = [
//                 dateToBlockid(date), "07:00", "11:00", default_content
//             ];
//             return [date, Object.create([default_block])];
//         });
//         console.log(this.table);
//     }



//     get monday_date() {
//         const date = this.table[0][0].toISOString().slice(0, 10);
//         console.log(date);
//         return date;
//     }

//     get days() {
//         return ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"]
//     }

//     get dates() {
//         return this.table.map(row => row[0].toISOString().slice(0, 10));
//     }

//     getContents(block_id) {
//         const filtred_table = this.table.filter(row => {
//             console.log(row[1]);
//             return row[1][0][0] === block_id;
//         });
//         if (filtred_table.length !== 0)
//             return filtred_table[0][1][0][3];
//         return [];
//     }

//     changeDate(date) {
//         const dates = (new Week(date)).dates;
//         dates.forEach((date, idx) => {
//             this.table[idx][0] = date;
//         })
//     }

//     addBlock(date, block = [dateToBlockid(new Date()), "07:00", "11:00", default_content]) {
//         const blocks = this.getBlocks(date);
//         blocks.push(block);
//     }

//     pushBlock(date, content = default_content) {
//         const blocks = this.getBlocks(date);
//         const block_id = dateToBlockid(date, (blocks.length + 1).toString().padStart(4, "0"));
//         blocks.push([block_id, "07:00", "11:00", default_content]);
//     }

//     popBlock(date) {
//         const blocks = this.getBlocks(date);
//         blocks.pop();
//     }

//     getBlocks(date) {
//         const day_date = new Date(date);
//         const day = (day_date.getDay() || 7) - 1;
//         return this.table[day][1];
//     }

//     toString() {
//         return this.table.map((row) => {
//             const date = row[0];
//             return `${date}`;
//         }).join('\n');
//     }

//     setStartTime(block_id, start) {
//         this.table.forEach((row) => {
//             const blocks = row[1];
//             blocks.forEach(block => {
//                 if (blocks[0] === block_id)
//                     blocks[1] = start;
//             });
//         });
//     }

//     setStopTime(block_id, stop) {
//         this.table.forEach((row) => {
//             const blocks = row[1];
//             blocks.forEach(block => {
//                 if (blocks[0] === block_id)
//                     blocks[2] = stop;
//             });
//         });
//     }
// }
// const schedule = new ScheduleStore({});

const ua_week_days = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];
const ua_day = (date) => ua_week_days[(date.getDay() || 7) - 1];



function get_week_dates(day_date) {
    const monday = dateAdd(day_date, "day", 1 - (day_date.getDay() || 7));
    let week_day_dates = [monday];
    for (let i = 1; i < 7; i++) {
        week_day_dates.push(dateAdd(monday, "day", i));
    }
    return week_day_dates;
    // return week_day_dates.map( day => day.toISOString().slice(0,10) );
}

function dateAdd(date, interval, units) {
    var ret = new Date(date); //don't change original date
    var checkRollover = function () { if (ret.getDate() !== date.getDate()) ret.setDate(0); };
    switch (interval.toLowerCase()) {
        case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
        case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
        case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
        case 'week': ret.setDate(ret.getDate() + 7 * units); break;
        case 'day': ret.setDate(ret.getDate() + units); break;
        case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
        case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
        case 'second': ret.setTime(ret.getTime() + units * 1000); break;
        default: ret = undefined; break;
    }
    return ret;
}





export {
    dateToBlockid, SeriesStore, existy, DayScheduleStore,
    ua_day,
    Week,
    schedule,
    dateToString,
    init_schedule,
    types,
    series_names,
};