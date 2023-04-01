let bioData;
let idData;
//let bioIdDateMap; // Map of all student Bio IDs(key) with Dates(values, comma seperated) when they were present
let availMonths; // Array of available months
let idDateTimeMap; // Map of all student IDs and Dates when they were present (ID and Date combination is the key)
let allDates;
let dataForTable;
let dateattnMap;
let attnTotalMap;
let attnStudentWiseMap;
let firstDate = null;
let lastDate = null;
let filteredDate = null;
let dstHolidays = {
  0: ['01/01/2023', '01/15/2023', '01/26/2023'],
  1: ['02/05/2023', '02/18/2023'],
  2: [
    '03/06/2023',
    '03/07/2023',
    '03/08/2023',
    '03/09/2023',
    '03/10/2023',
    '03/11/2023',
    '03/22/2023',
    '03/29/2023',
    '03/30/2023',
  ],
  3: [
    '04/04/2023',
    '04/07/2023',
    '04/14/2023',
    '04/22/2023',
    '04/23/2023',
    '04/29/2023',
  ],
  4: ['05/01/2023', '05/05/2023'],
  5: [
    '06/01/2023',
    '06/02/2023',
    '06/03/2023',
    '06/04/2023',
    '06/05/2023',
    '06/06/2023',
    '06/07/2023',
    '06/08/2023',
    '06/09/2023',
    '06/10/2023',
    '06/11/2023',
    '06/12/2023',
    '06/13/2023',
    '06/14/2023',
    '06/15/2023',
    '06/16/2023',
    '06/17/2023',
    '06/18/2023',
    '06/19/2023',
    '06/20/2023',
    '06/21/2023',
    '06/22/2023',
    '06/23/2023',
    '06/24/2023',
    '06/25/2023',
    '06/26/2023',
    '06/27/2023',
    '06/28/2023',
    '06/29/2023',
    '06/30/2023',
  ],
  6: ['07/29/2023'],
  7: ['08/15/2023', '08/30/2023'],
  8: ['09/06/2023', '09/28/2023'],
  9: [
    '10/24/2022',
    '10/25/2022',
    '10/26/2022',
    '10/27/2022',
    '10/28/2022',
    '10/29/2022',
    '10/31/2022',
    '10/02/2023',
    '10/21/2023',
    '10/22/2023',
    '10/23/2023',
    '10/24/2023',
    '10/25/2023',
  ],
  10: [
    '11/01/2022',
    '11/02/2022',
    '11/03/2022',
    '11/08/2022',
    '11/10/2023',
    '11/11/2023',
    '11/12/2023',
    '11/13/2023',
    '11/14/2023',
    '11/15/2023',
    '11/16/2023',
    '11/17/2023',
    '11/18/2023',
    '11/19/2023',
    '11/20/2023',
    '11/21/2023',
    '11/22/2023',
    '11/23/2023',
    '11/27/2023',
  ],
  11: [
    '12/26/2022',
    '12/27/2022',
    '12/28/2022',
    '12/28/2022',
    '12/30/2022',
    '12/31/2022',
    '12/25/2023',
    '12/26/2023',
    '12/27/2023',
    '12/28/2023',
    '12/29/2023',
    '12/30/2023',
  ],
};

const monthMap = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

const daysMap = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

function getDates(startDate, stopDate) {
  var dateArray = [];
  var currentDate = moment(startDate);
  var stopDate = moment(stopDate);
  while (currentDate <= stopDate) {
    if (new Date(currentDate).getDay() != 0) {
      var d = moment(currentDate).format('MM/DD/YYYY');
      dateArray.push(d);
      if (dstHolidays[new Date(d).getMonth()].includes(d)) dateArray.pop(d);
    }
    currentDate = moment(currentDate).add(1, 'days');
  }
  return dateArray;
}

function buildMonthCalendarWorkingDays(forMonthYear = 'All Months') {
  //console.log(getDates(firstDate, lastDate));

  let month;
  let year;
  if (forMonthYear == 'All Months') {
    month = monthMap[new Date(firstDate).getMonth()];
    year = new Date(firstDate).getFullYear();
  }

  allDates = new Array();
  const monthNumber = parseInt(getKeyByValue(monthMap, month));
  //console.log(monthNumber);
  let date = new Date(year, monthNumber, 1);
  while (date.getMonth() == new Date(month + ',' + year).getMonth()) {
    if (![0, 7].includes(date.getDay())) {
      //console.log(date);
      x =
        monthNumber +
        1 +
        '/' +
        String(date.getDate()).padStart(2, '0') +
        '/' +
        year;
      if (new Date(x).getTime() < new Date(firstDate).getTime()) {
        //console.log(firstDate, x);
        date.setDate(date.getDate() + 1);
        continue;
      }

      allDates.push(x);
      if (dstHolidays[monthNumber].includes(x)) {
        allDates.pop();
      }
    } else {
      //console.log(date);
    }
    date.setDate(date.getDate() + 1);
  }
  //console.log(allDates);
}

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

function buildDataForAttendanceTable(forMonthYear = 'All Months') {
  //buildMonthCalendarWorkingDays();
  //alert(forMonthYear);
  document.getElementById('monthpicker').style.display = 'inline-block';

  allDates = new Array();

  if (forMonthYear == 'All Months') {
    allDates = getDates(firstDate, lastDate);
    if (availMonths.length == 1) {
      var monthYearForTableTitle = availMonths[0];
    } else
      var monthYearForTableTitle = availMonths[0].concat(
        ' - ',
        availMonths[availMonths.length - 1]
      );
    document.getElementById('tableTitle').innerText =
      'Attendance for ' + monthYearForTableTitle;
  } else {
    document.getElementById('tableTitle').innerText =
      'Attendance for ' + forMonthYear;
    var month = forMonthYear.split(' ')[0];
    var year = forMonthYear.split(' ')[1];
    let fDate =
      parseInt(getKeyByValue(monthMap, month)) + 1 + '/' + '01' + '/' + year;

    let lDate = moment(new Date(fDate)).endOf('month').format('MM/DD/YYYY');
    if (moment(lastDate) <= moment(lDate)) allDates = getDates(fDate, lastDate);
    else allDates = getDates(fDate, lDate);
  }

  dataForTable = new Array();
  let c = 0;
  for (let i = 0; i < idData.length; i++) {
    let oneStudentData = new Array();
    let dateattnMap = new Map();
    if (bioData.has(idData[i][2])) {
      let allPresentDates = bioData.get(idData[i][2]);
      //console.log(allPresentDates);
      for (let j = 0; j < allDates.length; j++) {
        let d = allDates[j];
        if (allPresentDates.includes(d)) {
          dateattnMap.set(d, 'P');
        } else {
          dateattnMap.set(d, '');
        }
      }
    } else {
      /* c++;
      continue; */
      for (let j = 0; j < allDates.length; j++) {
        let d = allDates[j];
        dateattnMap.set(d, '');
      }
    }
    oneStudentData = {
      sn: i + 1,
      regNo: idData[i][0],
      name: idData[i][1].toUpperCase(),
      bioId: idData[i][2],
    };
    //console.log(dateattnMap);
    let present = 0;
    let absent = 0;
    for (let j = 0; j < dateattnMap.size; j++) {
      oneStudentData[allDates[j]] = dateattnMap.get(allDates[j]);
      if (dateattnMap.get(allDates[j]) === 'P') present++;
      else absent++;
      //console.log(oneStudentData, present, absent, allDates[j]);
    }
    percentage = Math.round((present / (present + absent)) * 100);
    oneStudentData['Present %'] =
      present + '/' + (present + absent) + ' (' + percentage + '%)';
    dataForTable.push(oneStudentData);
    //console.log(dataForTable);
  }
  attnTotalMap = new Map();

  let present = 0;
  let absent = 0;
  let totalStudentsPresent = 0;
  let totalStudents = idData.length;
  let totalDates = allDates.length;

  // All students Date wise attendance percentage
  for (let i = 0; i < allDates.length; i++) {
    present = 0;
    absent = 0;
    for (let j = 0; j < dataForTable.length; j++) {
      let tempData = dataForTable[j];
      if (tempData[allDates[i]] == 'P') present++;
      else absent++;
    }
    percentage = Math.round((present / (present + absent)) * 100);
    totalStudentsPresent += present;

    attnTotalMap.set(
      allDates[i],
      present + '/' + (present + absent) + ' (' + percentage + '%)'
    );
    //console.log(allDates[i], present, absent);
  }
  let averageAttendancePercantage = Math.round(
    (totalStudentsPresent / (totalStudents * totalDates)) * 100
  );

  attnTotalMap.set(
    'Present %',
    totalStudentsPresent +
      '/(' +
      totalStudents +
      '*' +
      totalDates +
      ') = (' +
      averageAttendancePercantage +
      '%)'
  );

  // END of All Students Date wise attendance percentage

  buildAttendanceTable();
}

function buildAttendanceTable() {
  $('#datatable').bootstrapTable('destroy');

  let column = new Array();
  column.push({
    field: 'sn',
    title: 'S. No.',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: '-',
    switchable: false,
  });
  column.push({
    field: 'regNo',
    title: 'Reg. No.',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: 'Total Attendance',
    switchable: false,
  });
  column.push({
    field: 'name',
    title: 'Name',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: '-',
    switchable: false,
  });

  column.push({
    field: 'bioId',
    title: 'Bio ID',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: '-',
    switchable: false,
  });
  //Each Date in a column
  for (let i = 0; i < allDates.length; i++) {
    let tempdateAlter = allDates[i].split('/');
    tempdateAlter.splice(0, 2, tempdateAlter[1], tempdateAlter[0]);
    tempdateAlter[2] = tempdateAlter[2].slice(2);
    tempdateAlter = tempdateAlter.join('/');
    column.push({
      field: allDates[i],
      title: tempdateAlter,
      align: 'center',
      valign: 'middle',
      footerFormatter: attnTotalMap.get(allDates[i]),
    });
  }

  //END
  function totalAttnPercentFormatter(data) {
    let totalDays = 0,
      totalStudents = data.length,
      allTotalAttn = 0,
      eachStudentAttnPercent;

    for (let i = 0; i < data.length; i++) {
      //let P = data[i][field]; //3/25 (12%)
      eachStudentAttnPercent = data[i]['Present %'];
      var K = eachStudentAttnPercent.split(' ')[0].split('/');
      totalDays = K[1];
      allTotalAttn += parseInt(K[0]);
    }
    //alert('Total Days ' + totalDays + ' Total Students' + totalStudents);
    let perc = Math.round((allTotalAttn / (totalStudents * totalDays)) * 100);
    return (
      allTotalAttn +
      '/' +
      '(' +
      totalStudents +
      '*' +
      totalDays +
      ') =(' +
      perc +
      '%)'
    );
    //return attnTotalMap.get('Present %');
  }

  column.push({
    field: 'Present %',
    title: 'Present %',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: totalAttnPercentFormatter,
    //switchable: false,
  });
  /*  var select = document.getElementById('months');
  for (var i = 0; i < availMonths.length; i++) {
    var optn = availMonths[i];
    var el = document.createElement('option');
    el.textContent = optn;
    el.value = optn;
    select.appendChild(el);
  } */
  if (dataForTable.length > 0) {
    var T = document.getElementById('parsed_csv_list');
    T.style.display = 'block';
    var P = document.getElementById('noData');
    P.style.display = 'none';
    document.getElementById('monthpicker').style.display = 'none';
    //$('#parsed_csv_list').html(table);
    //$('#datatable').html(table);
    let $table = $('#datatable');
    $('#datatable')
      .bootstrapTable('destroy')
      .bootstrapTable({
        columns: column,
        data: dataForTable,
        search: true,
        showFullscreen: true,
        fixedColumns: true,
        fixedNumber: +2,
        iconSize: 'sm',
        cellStyle: 'text-color: Blue;',
        onColumnSwitch: function (field, checked) {
          //alert(field + ' ' + String.raw`${field}`);
          //let checked = checked;

         // $table.bootstrapTable('showLoading');
          let data = $table.bootstrapTable('getData');
          //let j = JSON.stringify(data);
          //alert(j);
          //var att = j.map((d) => d[field]);
          //alert(att);
          let uniqueIdMap = new Map();
          for (var i = 0; i < data.length; i++) {
            let P = data[i][field]; //3/25 (12%)
            let R = data[i]['Present %'];
            let K = R.split(' ')[0].split('/');
            if (!checked) {
              if (P === 'P') {
                K[0] = K[0] - 1;
              }
              K[1] = K[1] - 1;
            } else {
              if (P === 'P') {
                K[0] = parseInt(K[0]) + 1;
              }
              K[1] = parseInt(K[1]) + 1;
            }
            let percnt = Math.round((K[0] / K[1]) * 100);
            let v = K[0] + '/' + K[1] + ' (' + percnt + '%)';
            uniqueIdMap.set(data[i]['bioId'], v);
            /* $table.bootstrapTable('updateCell', {
              index: i,
              field: 'Present %',
              value: v,
              reinit: false,
            });
            console.log(i + ' ' + v); */
          }

          for (let [key, value] of uniqueIdMap) {
            $table.bootstrapTable('updateCellByUniqueId', {
              id: key,
              field: 'Present %',
              value: value,
              reinit: false,
            });
            //console.log(key + ' = ' + value);
          }

          //$table.bootstrapTable('hideLoading');
        },
      });
  } else {
    var T = document.getElementById('noData');
    T.style.display = 'block';
    var P = document.getElementById('parsed_csv_list');
    P.style.display = 'none';
    var k = document.getElementById('monthpicker');
    k.style.display = 'none';
  }

  //$('#datatable').DataTable();
}

function readBioCSV(results, fileType = '.csv') {
  //console.log(results.data);
  //alert(results.data.length + '\n' + results.data);
  bioData = new Map();
  availMonths = new Array();
  idDateTimeMap = new Map();
  let filecheck = 1;
  if (fileType === '.dat') {
    filecheck = 1;
  }

  for (let i = 0; i < results.data.length - filecheck; i++) {
    if (i == 1) console.log(results);
    var row = results.data[i];
    //console.log(row);
    let cells = row.join(',').split(',');
    //console.log(cells);
    cells.pop();
    cells.pop();
    cells.pop();
    cells.pop();
    //console.log(cells);
    let d;
    if (cells[1].includes('/')) {
      d = cells[1].split('/');
      d = [d[1], d[0], d[2]].join('/');
    } else if (cells[1].includes('-')) {
      d = cells[1].split('-');
      //d = cells[1].split('-');
      //console.log(d);
      if (fileType === '.dat') {
        //k = d[2].split(' ');
        //alert(d[0]+"\n"+d[1]+"\n"+k[0]+"\n"+k[1]);
        //d = [d[1], k[0], d[0]].join('/') + ' ' + k[1];
        d = [d[1], d[0], d[2]].join('/');
      } else {
        //mm/dd/yyyy hh:mm:ss
        d = [d[1], d[0], d[2]].join('/');
      }
    }

    //console.log(d);
    cells[1] = d;

    if (firstDate == null) {
      firstDate = d.split(' ')[0];
    }
    //alert('FirstDate:' + firstDate);
    if (
      !availMonths.includes(
        monthMap[new Date(d).getMonth()] + ' ' + new Date(d).getFullYear()
      )
    ) {
      availMonths.push(
        monthMap[new Date(d).getMonth()] + ' ' + new Date(d).getFullYear()
      );
    }

    if (idDateTimeMap.has(parseInt(cells[0]) + ',' + d.split(' ')[0])) {
      idDateTimeMap
        .get(parseInt(cells[0]) + ',' + d.split(' ')[0])
        .push(d.split(' ')[1]);
    } else {
      idDateTimeMap.set(
        parseInt(cells[0]) + ',' + d.split(' ')[0],
        new Array(d.split(' ')[1])
      );
    }
    //alert(cells[0]);
    //alert(typeof cells[0]);
    if (bioData.has(parseInt(cells[0]))) {
      if (!bioData.get(parseInt(cells[0])).includes(cells[1].split(' ')[0])) {
        bioData.get(parseInt(cells[0])).push(cells[1].split(' ')[0]);
      }

      //var dateArr = bioData.get(parseInt(cells[0]));
      //var newarr = dateArr.filter((x, y) => dateArr.indexOf(x) == y);
    } else {
      bioData.set(parseInt(cells[0]), new Array(cells[1].split(' ')[0]));
    }
    //alert('Data For ' + cells[0] + ' : ' + bioData.get(parseInt(cells[0])));
    lastDate = d.split(' ')[0];
  }
  //alert('BioData: ' + 'BioDataLoaded' + bioData.size);
  var select = document.getElementById('months');
  for (var i = 0; i < availMonths.length; i++) {
    var optn = availMonths[i];
    var el = document.createElement('option');
    el.textContent = optn;
    el.value = optn;
    select.appendChild(el);
  }
  //console.log(bioData);
  //alert('Total BioData: ' + bioData.size);
}

function readIdCSV(results) {
  idData = new Array();
  for (i = 0; i < results.data.length - 1; i++) {
    var row = results.data[i];
    var cells = row.join(',').split(',');
    idData.push(cells);
  }
  idData.shift();
  idData = idData.map(function (val) {
    return val.slice(1);
  });

  for (i = 0; i < idData.length; i++) {
    t = idData[i][0];
    idData[i][0] = idData[i][1];
    idData[i][1] = t;
    idData[i][2] = parseInt(idData[i][2]);
  }
  idData = idData.sort(function (a, b) {
    return a[0] - b[0];
  });
  //studentPresentDates();
  buildDataForAttendanceTable();
  //buildAttendanceTable();
}

function studentPresentDates() {
  bioIdDateMap = new Map();
  for (j = 0; j < idData.length; j++) {
    for (i = 0; i < bioData.length; i++) {
      if (bioData[i][0] == idData[0][2]) {
        //console.log(bioData[i]);
        bioIdDateMap.set(idData[i][0], bioData[i]);
      }
    }
  }
}
