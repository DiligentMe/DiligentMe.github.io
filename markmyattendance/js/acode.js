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
let overAllPercentage = null;
let dataAfterSorting = null;
let $table = null;
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
  5: ['06/04/2023', '06/11/2023', '06/18/2023', '06/25/2023'],
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

let totalAttenCountAfterDateDrop = -1;

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
  forMonthYear = document
    .getElementById('reportrange')
    .getElementsByTagName('span')[0].innerText;

  //document.getElementById('monthpicker').style.display = 'inline-block';
  var T = document.getElementById('pbar');
  T.style.display = 'block';
  allDates = new Array();
  /* console.log(
    document.getElementById('reportrange').getElementsByTagName('span')[0]
      .innerText
  ); */
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
      'Attendance of ' + monthYearForTableTitle;
  } /* else {
    document.getElementById('tableTitle').innerText =
      'Attendance of ' + forMonthYear;
    var month = forMonthYear.split(' ')[0];
    var year = forMonthYear.split(' ')[1];
    let fDate =
      parseInt(getKeyByValue(monthMap, month)) + 1 + '/' + '01' + '/' + year;

    let lDate = moment(new Date(fDate)).endOf('month').format('MM/DD/YYYY');
    if (moment(lastDate) <= moment(lDate)) allDates = getDates(fDate, lastDate);
    else allDates = getDates(fDate, lDate);
    console.log(fDate, lDate);
  }  */ else {
    allDates = getDates(
      forMonthYear.split('-')[0].trim(),
      forMonthYear.split('-')[1].trim()
    );
  }

  //console.log(forMonthYear.split('-')[0], forMonthYear.split('-')[1]);
  document.getElementById('tableTitle').innerText =
    'Attendance from ' + forMonthYear;
  //console.log(allDates);
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
    let percentage = Math.round((present / (present + absent)) * 100);
    if (Number.isNaN(percentage))
      //console.log(Number.isNaN(perc));
      percentage = 0;
    /*  oneStudentData['Present %'] =
      present + '/' + (present + absent) + ' (' + percentage + '%)'; */
    oneStudentData['Present %'] = present;
    oneStudentData['Total %'] = percentage;
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
      percentage.toString() //+ '/' + (present + absent) + ' (' + percentage + '%)'
    );

    //console.log(allDates[i], present, absent);
    //console.log(present);
  }
  let averageAttendancePercantage = Math.round(
    (totalStudentsPresent / (totalStudents * totalDates)) * 100
  );

  /*  attnTotalMap.set(
    'Present %',
    totalStudentsPresent +
      '/(' +
      totalStudents +
      '*' +
      totalDates +
      ') = (' +
      averageAttendancePercantage +
      '%)'
  ); */

  attnTotalMap.set('Present %', totalStudentsPresent);
  attnTotalMap.set('Total %', averageAttendancePercantage);

  // END of All Students Date wise attendance percentage

  buildAttendanceTable();
}

function buildAttendanceTable() {
  $('#datatable').bootstrapTable('destroy');
  document.getElementById('inOutTime').checked = false;
  document.getElementById('appt').value = '--:--';
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
    footerFormatter: 'Attendance %',
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
      sortable: true,
      align: 'center',
      valign: 'middle',
      footerFormatter: attnTotalOfADay, //attnTotalOfADay(i),
    });
  }

  //END

  column.push({
    field: 'Present %',
    title: 'Total' + ' (' + allDates.length + ')',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: totalAttnPercentFormatter,
    switchable: false,
  });

  column.push({
    field: 'Total %',
    title: '%',
    sortable: true,
    align: 'center',
    valign: 'middle',
    footerFormatter: percentageFormatter,
    switchable: false,
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
    //document.getElementById('monthpicker').style.display = 'none';
    let timeChedked = false;
    //$('#parsed_csv_list').html(table);
    //$('#datatable').html(table);
    totalAttenCountAfterDateDrop = column.length - 6;
    let tAcAdD = totalAttenCountAfterDateDrop;
    $table = $('#datatable');
    $('#datatable')
      .bootstrapTable('destroy')
      .bootstrapTable({
        columns: column,
        data: dataForTable,
        search: true,
        showFullscreen: true,
        fixedColumns: true,
        fixedNumber: +2,
        fixedRightNumber: +2,
        iconSize: 'sm',
        cellStyle: 'text-color: Blue;',
        pagination: true,
        pageSize: 100,
        paginationParts: ['pageSize', 'pageList'],
        onExportStarted: function () {
          if (document.getElementById('inOutTime').checked) {
            timeChedked = true;
            document.getElementById('inOutTime').click();
          }
        },

        onExportSaved: function () {
          if (timeChedked) {
            timeChedked = false;
            document.getElementById('inOutTime').click();
          }
        },

        onClickCell: function (field, value, row, $element) {
          if (document.getElementById('inOutTime').checked) {
          } else {
            if (value === '') {
            } else if (!field.includes('/')) {
            } else {
              /*  alert(
              field + '\n' + $element.parent().data('index') + '\n' + row.bioId
            ); */
              // console.log(row.bioId + ',' + field);
              var inOutTime = idDateTimeMap.get(
                String(row.bioId + ',' + field)
              );
              var inTime, outTime;
              if (inOutTime.length > 0) {
                inTime = inOutTime[0];
                outTime = inOutTime[inOutTime.length - 1];
              }
              //alert('In Time: ' + inTime + '\n' + 'Out Time: ' + outTime);
              var div = document.createElement('div');
              div.className = 'popup';
              var span = document.createElement('span');
              span.className = 'popuptext';
              span.id = 'mypopup';
              span.innerText =
                'In Time: ' + inTime + '\n' + 'Out Time: ' + outTime;
              div.appendChild(span);
              console.log('================================');
              $element.append(div);
              span.classList.toggle('show');
              setTimeout(function () {
                div.remove();
              }, 2000);
            }
          }
        },
        onSort: function (name, order) {
          let data = $table.bootstrapTable('getData');
          dataAfterSorting = null;
          dataAfterSorting = data;
          //console.log(data);
          //console.log(name + ' ' + order);
        },
        onColumnSwitch: function (field, checked) {
          //alert(field + ' ' + String.raw`${field}`);
          //let checked = checked;
          let T = document.getElementById('pbar');
          T.style.display = 'block';
          setTimeout(function () {
            if (field === 'Present %') {
              //var T = document.getElementById('pbar');
              T.style.display = 'none';
            } else if (field === 'Total %') {
              //var T = document.getElementById('pbar');
              T.style.display = 'none';
            } else {
              // $table.bootstrapTable('showLoading');
              let data = $table.bootstrapTable('getData');
              // if (dataAfterSorting != null) data = dataAfterSorting;

              //console.log(data);
              //let j = JSON.stringify(data);
              //alert(j);
              //var att = j.map((d) => d[field]);
              //alert(att);
              if (checked) {
                tAcAdD = parseInt(tAcAdD) + 1;
              } else {
                tAcAdD = parseInt(tAcAdD) - 1;
              }
              totalAttenCountAfterDateDrop = tAcAdD;
              let uniqueIdMap = new Map();
              let K = new Array();
              for (var i = 0; i < data.length; i++) {
                let P = data[i][field];
                let R = data[i]['Present %'];
                let serialnumber = data[i]['sn'];

                // K = R.split(' ')[0].split('/'); //3/25 (12%)
                K[0] = R;
                //K[1] = Object.keys(data[i]).length - 6; //
                //console.log(i + ' ' + field, '  ' + checked, ' ' + R);
                if (!checked) {
                  if (P.includes('P')) {
                    K[0] = parseInt(K[0]) - 1;
                  }
                  //K[1] = K[1] - 1;
                  //tAcAdD = parseInt(tAcAdD) - 1;
                } else {
                  if (P.includes('P')) {
                    K[0] = parseInt(K[0]) + 1;
                  }
                  //K[1] = parseInt(K[1]) + 1;
                  //tAcAdD = parseInt(tAcAdD) + 1;
                }
                //let percnt = Math.round((K[0] / K[1]) * 100);
                let percnt = Math.round((K[0] / tAcAdD) * 100);
                //console.log('Total Count %: ' + percnt);
                //let v = K[0] + '/' + K[1] + ' (' + percnt + '%)';
                //uniqueIdMap.set(data[i]['bioId'], v);
                /*  $table.bootstrapTable('updateCell', {
                  index: i,
                  field: 'Present %',
                  value: K[0],
                  reinit: false,
                }); */
                /*  $table.bootstrapTable('updateCellByUniqueId', {
                  id: serialnumber,
                  field: 'Present %',
                  value: K[0],
                  reinit: false,
                }); */
                //console.log(i + '  ' + R + '  ' + K[0] + ' ' + 'updatedCell');
                //console.log(i + ' = ' + v);
                /* $table.bootstrapTable('updateCell', {
                  index: i,
                  field: 'Total %',
                  value: percnt,
                  reinit: false,
                }); */
                //console.log(i + ' = ' + percnt);
                // console.log(i + ' ' + v);
                /*****************New Code to refresh the table data ************/
                data[i]['Present %'] = K[0];
                data[i]['Total %'] = percnt;
                /*End of refresh */
              }
              $('#datatable').bootstrapTable('load', data);

              $table.bootstrapTable('updateColumnTitle', {
                field: 'Present %',
                title: 'Total' + ' (' + tAcAdD + ')',
              });

              //var T = document.getElementById('pbar');
              T.style.display = 'none';

              /* for (let [key, value] of uniqueIdMap) {
            $table.bootstrapTable('updateCellByUniqueId', {
              id: key,
              field: 'Present %',
              value: value,
              reinit: false,
            });
            //console.log(key + ' = ' + value);
          }*/

              //$table.bootstrapTable('hideLoading');
            }
          }, 0);
        },
      });
    var T = document.getElementById('pbar');
    T.style.display = 'none';
  } else {
    var T = document.getElementById('noData');
    T.style.display = 'block';
    var P = document.getElementById('parsed_csv_list');
    P.style.display = 'none';
    //var k = document.getElementById('monthpicker');
    //k.style.display = 'none';
  }

  //$('#datatable').DataTable();
}

function attnTotalOfADay(data) {
  //return attnTotalMap.get(allDates[i]);
  var field = this.field;
  let count = 0;
  let studentCount = data.length;
  for (var j = 0; j < data.length; j++) {
    if (!data[j][field].includes('P')) continue;
    else count++;
  }
  return Math.round((count / studentCount) * 100);
}

function percentageFormatter(data) {
  if (overAllPercentage) {
    //console.log(overAllPercentage);
    return overAllPercentage;
  } else {
    //console.log('in percentage on NAN');
    let totalDays = Object.keys(data[0]).length - 6,
      totalStudents = data.length,
      allTotalAttn = 0,
      eachStudentAttnPercent;
    //console.log(data[0], data[0].length);
    for (let i = 0; i < data.length; i++) {
      //let P = data[i][field]; //3/25 (12%)
      eachStudentAttnPercent = data[i]['Present %'];
      var K = eachStudentAttnPercent; //.split(' ')[0].split('/');
      //console.log(K);
      //totalDays = K; //K[1];
      //allTotalAttn += parseInt(K[0]);
      allTotalAttn += K;
    }
    //alert('Total Days ' + totalDays + ' Total Students' + totalStudents);
    let perc = Math.round((allTotalAttn / (totalStudents * totalDays)) * 100);
    //console.log(allTotalAttn, ' ', totalStudents, ' ', totalDays, ' ', perc);
    //console.log(perc);
    if (Number.isNaN(perc)) {
      //console.log(Number.isNaN(perc));
      return 0;
    } else return perc;
  }
}

function totalAttnPercentFormatter(data) {
  let totalDays = Object.keys(data[0]).length - 6,
    totalStudents = data.length,
    allTotalAttn = 0,
    eachStudentAttnPercent;

  for (let i = 0; i < data.length; i++) {
    //let P = data[i][field]; //3/25 (12%)
    eachStudentAttnPercent = data[i]['Present %'];
    var K = eachStudentAttnPercent; //.split(' ')[0].split('/');
    //totalDays = K; //K[1];
    //allTotalAttn += parseInt(K[0]);
    allTotalAttn += K;
  }
  /* console.log(
    allTotalAttn,
    data[0],
    totalStudents,
    Object.keys(data[0]).length
  ); */
  //alert('Total Days ' + totalDays + ' Total Students' + totalStudents);
  let perc = Math.round(
    (allTotalAttn / (totalStudents * totalAttenCountAfterDateDrop)) * 100
  );

  /*console.log(
    allTotalAttn,
    ' ',
    totalStudents,
    ' ',
    totalDays,
    ' ',
    totalAttenCountAfterDateDrop
  );*/
  overAllPercentage = perc;
  //console.log('Average % :' + overAllPercentage);
  /*  return (
    allTotalAttn +
    '/' +
    '(' +
    totalStudents +
    '*' +
    totalDays +
    ') =(' +
    perc +
    '%)'
  ); */
  //console.log(allTotalAttn);
  return allTotalAttn;
  //return attnTotalMap.get('Present %');
}

function readBioCSV(results, fileType = '.csv') {
  //console.log(results.data);
  //alert(results.data.length + '\n' + results.data);
  bioData = new Map();
  availMonths = new Array();
  idDateTimeMap = new Map();
  let filecheck = 1;
  if (fileType === '.dat') {
    filecheck = 0;
  }

  for (let i = 0; i < results.data.length - filecheck; i++) {
    //if (i == 1) console.log(results);
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
      //$('#reportrange').data('daterangepicker').setStartDate = firstDate;
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
    //select.appendChild(el);
  }
  var el = document.createElement('option');
  el.textContent = 'Custom Range';
  el.value = 'Custom Range';
  el.id = 'selectRangeButton';
  //select.appendChild(el);
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
  //let T = document.getElementById('pbar');
  //T.style.display = 'block';

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

function showTime() {
  //console.log(event.target.checked);
  let checked = document.getElementById('inOutTime').checked;
  let T = document.getElementById('pbar');
  T.style.display = 'block';
  if (checked) {
    setTimeout(() => {
      let data = $table.bootstrapTable('getData');
      let keys = Object.keys(data[0]);
      keys.splice(keys.indexOf('sn'), 1);
      keys.splice(keys.indexOf('regNo'), 1);
      keys.splice(keys.indexOf('bioId'), 1);
      keys.splice(keys.indexOf('name'), 1);
      keys.splice(keys.indexOf('Present %'), 1);
      keys.splice(keys.indexOf('Total %'), 1);
      //console.log(keys[0]);
      //console.log(keys);
      for (i in data) {
        //console.log(data[i]['bioId']);
        for (j in keys) {
          if (data[i][keys[j]].includes('P')) {
            let tt = idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]);
            data[i][keys[j]] =
              'P' +
              '<div class="row" id="timeshow" style="font-size:0.85em; font-family: Georgia, Times, serif; margin:0em"><div class="col border border-light"><span style="color:green;">' +
              tt[0].slice(0, -3) +
              '</span></div><div class="col border border-light"> <span style="color:brown;">' +
              tt[tt.length - 1].slice(0, -3) +
              '</span></div></div>';
            //console.log(data[i][keys[j]]);
            //console.log(idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]));
          }
        }
      }
      $table.bootstrapTable('load', data);
      T.style.display = 'none';
    }, 0);
  } else {
    //var timeId = document.getElementById('timeshow');
    const nodeList = document.querySelectorAll('#timeshow');
    for (var i = 0; i < nodeList.length; i++) {
      nodeList[i].remove();
    }
    setTimeout(() => {
      let data = $table.bootstrapTable('getData');
      let keys = Object.keys(data[0]);
      keys.splice(keys.indexOf('sn'), 1);
      keys.splice(keys.indexOf('regNo'), 1);
      keys.splice(keys.indexOf('bioId'), 1);
      keys.splice(keys.indexOf('name'), 1);
      keys.splice(keys.indexOf('Present %'), 1);
      keys.splice(keys.indexOf('Total %'), 1);
      //console.log(keys[0]);
      //console.log(keys);
      for (i in data) {
        //console.log(data[i]['bioId']);
        for (j in keys) {
          if (data[i][keys[j]].includes('P')) {
            let tt = idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]);
            data[i][keys[j]] = 'P';
            //console.log(data[i][keys[j]]);
            //console.log(idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]));
          }
        }
      }
      $table.bootstrapTable('load', data);
      T.style.display = 'none';
    }, 0);

    //console.log($table.bootstrapTable('getData'));
    //$table.bootstrapTable('load', $table.bootstrapTable('getData'));
    //T.style.display = 'none';
  }

  //<div class="row"><div class="col-sm-6">10:11</div><div class="col-sm-6">12:19</div></div>
}

function filterOnEntryTime(entryTime) {
  let T = document.getElementById('pbar');
  T.style.display = 'block';
  //console.log(entryTime);
  setTimeout(() => {
    let data = $table.bootstrapTable('getData');
    let keys = Object.keys(data[0]);
    keys.splice(keys.indexOf('sn'), 1);
    keys.splice(keys.indexOf('regNo'), 1);
    keys.splice(keys.indexOf('bioId'), 1);
    keys.splice(keys.indexOf('name'), 1);
    keys.splice(keys.indexOf('Present %'), 1);
    keys.splice(keys.indexOf('Total %'), 1);
    //console.log(keys[0]);
    //console.log(keys);
    for (i in data) {
      //console.log(data[i]['bioId']);
      for (j in keys) {
        let tt = idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]);
        if (data[i][keys[j]].includes('P')) {
          if (
            data[i][keys[j]].includes('P') &&
            tt[0].slice(0, -3) > entryTime
          ) {
            data[i][keys[j]] = '';
            let tt = data[i]['Present %'];
            data[i]['Present %'] -= 1;
            /* let tt1 = data[i]['Total %'];
            let tt2 = Math.round((tt / tt1) * 100); */
            data[i]['Total %'] = Math.round(((tt - 1) / keys.length) * 100);
          } /*  else if (
            dataForTable[i][keys[j]].includes('P') &&
            tt[0].slice(0, -3) < entryTime
          ) {
            data[i][keys[j]] = 'P';
            let tt = data[i]['Present %'];
            data[i]['Present %'] += 1;
            data[i]['Total %'] = Math.round(((tt + 1) / keys.length) * 100);
          } */
          /* data[i][keys[j]] =
            'P' +
            '<div class="row" id="timeshow" style="font-size:0.85em; font-family: Georgia, Times, serif; margin:0em"><div class="col border border-light">' +
            tt[0].slice(0, -3) +
            '</div><div class="col border border-light">' +
            tt[tt.length - 1].slice(0, -3) +
            '</div></div>'; */
          //console.log(data[i][keys[j]]);
          //console.log(idDateTimeMap.get(data[i]['bioId'] + ',' + keys[j]));
        } else if (
          !data[i][keys[j]].includes('P') &&
          dataForTable[i][keys[j]].includes('P') &&
          tt[0].slice(0, -3) < entryTime
        ) {
          let tt1 = data[i]['Present %'];
          data[i]['Present %'] += 1;
          data[i]['Total %'] = Math.round(((tt1 + 1) / keys.length) * 100);
          if (document.getElementById('inOutTime').checked) {
            data[i][keys[j]] =
              'P' +
              '<div class="row" id="timeshow" style="font-size:0.85em; font-family: Georgia, Times, serif; margin:0em"><div class="col border border-light"><span style="color:green;">' +
              tt[0].slice(0, -3) +
              '</span></div><div class="col border border-light"> <span style="color:brown;">' +
              tt[tt.length - 1].slice(0, -3) +
              '</span></div></div>';
          } else {
            data[i][keys[j]] = 'P';
          }
        } else if (entryTime == '--:--' || entryTime.includes('--')) {
          console.log(entryTime);
        }
      }
    }
    $table.bootstrapTable('load', data);
    T.style.display = 'none';
  }, 0);
}
