self.module = {
  exports: function(params, done) {
    params = JSON.parse(params);

    const calendarType = params.calendarType;
    const year = params.year;
    const month = params.month;
    ["moment", "underscore"]
      .concat(calendarType == "persian" ? ["moment-jalaali"] : [])
      .forEach(lib =>
        importScripts(location.origin + "/workers/lib/" + lib + ".js")
      );

    if (calendarType == "persian") {
      moment.loadPersian();
    }
    const today = moment();

    let monthView = [];

    let startOfTheMonth = moment(`${year}/${month}/1`, "YYYY/M/D");

    if (calendarType === "persian") {
      startOfTheMonth = moment(`j${year}/j${month}/1`, "jYYYY/jM/jD");
    }

    const startOfTheMonthWeekday = startOfTheMonth.weekday();

    let daysInMonth = startOfTheMonth.daysInMonth();

    if (calendarType === "persian") {
      daysInMonth = moment.jDaysInMonth(
        parseInt(startOfTheMonth.format("jYYYY"), 10),
        parseInt(startOfTheMonth.format("jMM"), 10) - 1
      );
    }

    const endOfMonth = moment(startOfTheMonth.toDate()).add(
      daysInMonth,
      "days"
    );

    const endOfMonthWeekday = endOfMonth.weekday();

    for (let i = startOfTheMonthWeekday; i > 0; i--) {
      monthView.push({
        date: new Date(
          parseInt(startOfTheMonth.format("x"), 10) +
            i * -1 * 1000 * 60 * 60 * 24
        ),
        class: ["prevMonth"]
      });
    }

    for (let i = 0; i < daysInMonth; i++) {
      //  var day = moment(startOfTheMonth.toDate()).add(i, 'd');
      const day = new Date(
        parseInt(startOfTheMonth.format("x"), 10) + i * 1000 * 60 * 60 * 24
      );

      //  var dayEvents = this.findIranEvent(MomentJalaali(day).jYear(), MomentJalaali(day).jMonth() + 1, i + 1);
      monthView.push({
        date: day,
        // events: dayEvents,
        // holiday: _.where(dayEvents, { holiday: true }).length > 0,
        class: ["currentMonth"]
      });
    }

    let ia = 0;
    for (let i = endOfMonthWeekday; i <= 6; i++) {
      monthView.push({
        date: new Date(
          parseInt(endOfMonth.format("x"), 10) + ia * 1000 * 60 * 60 * 24
        ),
        class: ["nextMonth"]
      });
      ia++;
    }

    const lastItem = moment(monthView[monthView.length - 1].date).format("x");
    const lastLength = monthView.length;

    for (let i = 42; i > lastLength; i--) {
      monthView.push({
        date: new Date(parseInt(lastItem, 10) + (43 - i) * 1000 * 60 * 60 * 24),
        class: ["nextMonth"]
      });
    }

    monthView = _.map(monthView, item => {
      item.formats = {};

      const itemMoment = moment(item.date);

      ["DD", "MMMM"].forEach(f => {
        if (calendarType === "persian") {
          f = "j" + f;
          item.formats[f] = itemMoment.format(f);
        } else {
          item.formats[f] = itemMoment.format(f);
        }
      });

      item.formats["YYYY/MM/DD"] = itemMoment.format("YYYY/MM/DD");
      item.formats["jYYYY/jMM/jDD"] = itemMoment.format("jYYYY/jMM/jDD");

      item.today = today["YYYY/MM/DD"] === item.formats["YYYY/MM/DD"];

      return item;
    });

    done(monthView);
  }
};
