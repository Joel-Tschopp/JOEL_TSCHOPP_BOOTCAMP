window.ajila.forms.joeltschopp = window.ajila.forms.joeltschopp || {};
window.ajila.forms.joeltschopp.component = window.ajila.forms.joeltschopp.component || {};
window.ajila.forms.joeltschopp.component.timebox = window.ajila.forms.joeltschopp.component.timebox || {};

(function (context) {
    /**
     * Handles the conversion from different time entries to the required format.
     * @param time The entered time.
     * @return time The converted time.
     */
    context.convertTime = function (time) {
        time = time.replace('.', ':');

        var hour = "00";
        var minutes = "00";

        if (time == null || time == "") {
            return;
        }

        //':' does not exist
        if (time.indexOf(":") == -1) {

            // change 2400 back to 2359
            if (time == 2400) {
                hour = 23;
                minutes = 59;
                return hour + ":" + minutes;
            }

            if (time < 2400) {

                // e.g. entries from 0000 to 2400
                if (time.length === 4) {
                    hour = time.substring(0, 2);
                    minutes = time.substring(2, 4);
                    return hour + ":" + minutes;
                }

                // just hour is entered
                if (time < 24) {
                    // e.g. entries from 1 to 9
                    if ((parseInt(time) <= 9) && (time.length == 1)) {
                        hour = "0" + time;
                    }
                    // e.g. entries from 10 to 23
                    else {
                        hour = time;
                    }
                }

                // change 24 to 23:59
                if (time == 24) {
                    hour = 23;
                    minutes = 59;
                }

                if (((time > 24) && (time.length == 2)) || (time.length >= 3)) {
                    return time;
                }
            } else {
                return time;
            }

            time = hour + ":" + minutes;
        }

        //':' does exist
        if (time.indexOf(":") > -1) {

            var arrayTime = time.split(":");
            hour = arrayTime[0];
            minutes = arrayTime[1];

            // change 24:00 back to 23:59
            if (hour == 24) {
                hour = 23;
                minutes = 59;
            }

            // hour entries which are not in the HH format (e.g. 8:20)
            if (hour.length == 1) {
                hour = "0" + hour;
            }

            // minute entries which are not in the MM format (e.g. 08:2)
            if (minutes.length == 1) {
                minutes = "0" + minutes;
            }

            time = hour + ":" + minutes;
        }

        return time;
    };

}(window.ajila.forms.joeltschopp.component.timebox));