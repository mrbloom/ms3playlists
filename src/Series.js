var durations = {};
// var block_duration = 0;
var durations_loaded = false;
var min, max;
var block_counter = 1;
var block_duration = 0;

function keep_value(input_name, min, max) {
    var value = parseInt($(input_name).val());
    try {
        if (value > max)
            $(input_name).val(max);
        else if (value < min)
            $(input_name).val(min);
    }
    catch (e) {
        console.log(e)
    }
}

function csv_parse(csv_string) {
    var results = {};
    var lines = csv_string.split('\n');
    var names = lines[0].split(';').filter(text => text != "");
    lines.slice(1).forEach(line => {
        var elements = line.split(';').filter(text => text != "");
        results[elements[0] + zfill(elements[1], 3)] = elements[2];
    })
    return results;
}

function zfill(num, len = 4) { return (Array(len).join("0") + num).slice(-len); }

function get_series_name(prefix, i) {
    function spasateli(i) {
        if (1 <= i && i <= 11)
            return "p010137-01-"
        else {
            if (12 <= i && i <= 24)
                return "p013956-02-"
        }
    }
    function vitalka(i) {
        if (81 <= i && i <= 104)
            return "p011149-05-"
    }
    function vstrech(i) {
        if (1 <= i && i <= 8)
            return "s013392-01-"
    }
    function vecherinka(i) {
        if (1 <= i && i <= 12)
            return "s014338-01-"
    }
    prefixies_funcs = {
        "Помста2": i => (1 <= i && i <= 12) ? "p008255-02-" : undefined,
        "Рятівники": spasateli,
        "Віталька": vitalka,
        "Зустрічна смуга": vstrech,
        "Вечірка": vecherinka
    }

    prefix_name = prefixies_funcs[prefix](i)
    return prefix_name + zfill(i, 3);
    // series = []
}

function get_min_max(series_name) {
    switch (series_name) {
        case "Помста2": return [1, 12];
        case "Рятівники": return [1, 24];
        case "Віталька": return [81, 104];
        case "Зустрічна смуга": return [1, 3];
        case "Вечірка": return [1, 12];
    }
}

function time(ms) {
    try {
        return new Date(ms).toISOString().slice(11, -5);
    } catch (e) {
        console.log('Ошибка ' + e.name + ":" + e.message + "\n" + e.stack + "милисекунды = " + ms);
    }
}


function add_block() {
    block_counter++;
    var text = $("#content").val() + "\n\n";
    $('#content').val(text);
    // $( "#block_duration" ).val("");
    block_duration = 0;
    $("#block_duration").val(time(block_duration));

    text = $("#playlist_result").html() + "<br />";
    $("#playlist_result").html(text);
}

function add_content() {
    var filename_date = $("#id_date").val()//document.querySelector('id_date').value
    var series_name = $("#series_name").val();
    var start_time = $('#add_start_time').val();
    var end_time = $('#add_stop_time').val();
    var start_date = $('#add_start_date').val();
    var end_date = $('#add_stop_date').val();
    var block_id = start_date.split(".").join("").slice(-4) + zfill(block_counter); //format mmdd0000id

    var first_film = parseInt($("#add_first_film").val());
    var last_film = parseInt($("#add_last_film").val());

    var block_text = "";

    for (var i = first_film; i <= last_film; i++) {
        var film_name = get_series_name(series_name, i);
        // block_duration += new Date(`2000/01/01 ${durations[film_name]}`) - new Date("2000/01/01 00:00:00");
        block_text += `${start_date} ${start_time}:00;${film_name};${end_date} ${end_time}:00;${durations[film_name]};${block_id}\n`;
        // console.log(block_text)
    }
    if (block_text.indexOf("undefined") >= 0) {
        return;
    }
    // $( "#block_duration" ).val( time(block_duration) );

    var text = $("#content").val() + block_text;
    $('#content').val(text);

    var material_duration = calc_duration(series_name, first_film, last_film)
    block_duration += calc_duration(series_name, first_film, last_film, false)
    var text = $("#playlist_result").html() +
        `${start_date} - ${end_date}   ${start_time} - ${end_time}   ${series_name}   ${first_film}-${last_film}   ${material_duration} <br />`;
    // `${start_date.slice(-5)} - ${end_date.slice(-5)}  ${start_time.slice(-3)} - ${end_time.slice(-3)}  ${series_name} ${first_film}-${last_film}  ${material_duration} <br />`;
    $("#playlist_result").html(text);
    $("#block_duration").val(time(block_duration));
    // block_duration = 0;
}

function calc_duration(series_name, first_film, last_film, human_readable = true) {
    var duration = 0;
    for (var i = first_film; i <= last_film; i++) {
        var film_name = get_series_name(series_name, i);
        duration += new Date(`2000/01/01 ${durations[film_name]}`) - new Date("2000/01/01 00:00:00");
    }
    if (!human_readable)
        return duration
    return time(duration)
}

function content_duration() {
    var series_name = $("#series_name").val();
    var first_film = parseInt($("#add_first_film").val());
    var last_film = parseInt($("#add_last_film").val());

    var duration = calc_duration(series_name, first_film, last_film);

    $("#block_duration").val(duration)
}

$(document).ready(function () {
    url = "static/js/lengthes.csv";

    var config_csv = {
        download: true,
        quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ";",
        header: true,
        newline: "\r\n",
        complete: function (results) {
            // durations = results;
            for (var key in results.data) {
                var record = results.data[key];
                durations[record["prefix"] + zfill(record["index"], 3)] = record["duration"];
                durations_loaded = true;
            }
            // console.log("Parsing complete:", durations);
            console.log("Durations loaded")
        },
        step: function (results, parser) {
            console.log("Row data:", results.data);
            console.log("Row errors:", results.errors);
        },
        error: function (e) { console.log(e) }
    };

    // Papa.parse(url, config_csv);
    durations = csv_parse(lengthes_str)

    $("#content").val("");
    content_duration();

    $("#add_block").click(add_block);
    $("#add_content").click(add_content);
    $("#clear_textarea").click(function () {
        $("#content").val("");
        $("#block_duration").val("");
        $("#playlist_result").html("");
    })

    var date_format = {
        dayNamesShort: $.datepicker.regional["uk"].dayNamesShort,
        dayNames: $.datepicker.regional["uk"].dayNames,
        monthNamesShort: $.datepicker.regional["uk"].monthNamesShort,
        monthNames: $.datepicker.regional["uk"].monthNames,
    };
    $.datepicker.formatDate("yy.mm.dd", new Date(), date_format); //Doesn't work format change in regional uk file
    $("#id_date").val("");
    $("#id_date").datepicker();//.setDA //formatDate("yy.mm.dd", new Date())
    $("#add_start_time").timepicker({
        timeFormat: 'HH:mm',
        startTime: '06:00',
        scrollbar: true,
    });
    //{timeFormat:'hh:mm'});
    $("#add_start_date").datepicker();
    $("#add_stop_time").timepicker({
        timeFormat: 'HH:mm',
        startTime: '11:00',
        scrollbar: true,
    });
    $("#add_stop_date").datepicker();
    [min, max] = get_min_max($("#series_name").val());
    $("#add_first_film").change(() => {
        keep_value("#add_first_film", min, max);
        // console.log(min,max);
        content_duration();
    });
    $("#add_last_film").change(() => {
        var first = parseInt($("#add_first_film").val());
        keep_value("#add_last_film", first, max);
        content_duration();
    });
    $("#series_name").change(() => {
        [min, max] = get_min_max($("#series_name").val());
        keep_value("#add_first_film", min, max);
        var first = parseInt($("#add_first_film").val());
        keep_value("#add_last_film", first, max);
        content_duration();
    })
});

