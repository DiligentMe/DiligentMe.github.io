function displayHTMLTable(results) {

  var T = document.getElementById("parsed_csv_list");
  T.style.display = "block";
  var P = document.getElementById("gen_code_marks");
  P.style.display = "none";
  var D = document.getElementById("instruction");
  D.style.display = "none";
  var table = "<table class='table'>";
  var data = results.data;
  if (document.getElementById("files").files.length == 0) {
    alert("Choose a file with Data, Please mind the format!");
  } else {
    for (i = 0; i < data.length; i++) {
      table += "<tr>";
      var row = data[i];
      var cells = row.join(",").split(",");

      for (j = 0; j < cells.length; j++) {
        table += "<td>";
        table += cells[j];
        table += "</th>";
      }
      table += "</tr>";
    }
    table += "</table>";
    $("#parsed_csv_list").html(table);
  }
}

function generateCode(results) {
  var T = document.getElementById("parsed_csv_list");
  T.style.display = "none";

  var data = results.data;
  data.shift();
  data.shift();
  var allData = "";
  for (i = 0; i < data.length - 1; i++) {
    var nameFormat = String(data[i]);
    nameFormat = nameFormat.split(",");
    var colCount = nameFormat.length;
    //alert(parseInt(colCount));
    var oneData = "";
    for (j = 0; j < parseInt(colCount); j++) {
      if (j == 1) {
        oneData = oneData.concat("\"", nameFormat[j], "\"", ",");
      } else if (j == colCount - 1) {
        oneData = oneData.concat(nameFormat[j]);
      } else {
        oneData = oneData.concat(nameFormat[j], ",");
      }
    }
    //alert(oneData);

    if (i == 0)
      allData = "[[" + oneData + "],";
    else if (i == (data.length - 2))
      allData = allData + "[" + oneData + "]]";
    else
      allData = allData + "[" + oneData + "],";
  }
  //alert(allData);
  var K = document.getElementById("precode");
  K.innerText = "var marks=".concat(allData, ';', defaultCode());
  var P = document.getElementById("gen_code_marks");
  P.style.display = "block";
  var C = document.getElementById('copyData');
  C.scrollTop = 0;
}

function defaultCode() {
  /*Don't Edit this code for any reason*/
  var words = `var words = { 0: "Zero", 1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight", 9: "Nine",
    10: "Ten", 11: "Eleven", 12: "Twelve", 13: "Thirteen", 14: "Fourteen", 15: "Fifteen", 16: "Sixteen",
    17: "Seventeen", 18: "Eighteen", 19: "Nineteen", 20: "Twenty", 21: "Twenty One", 22: "Twenty Two",
    23: "Twenty Three", 24: "Twenty Four", 25: "Twenty Five", 26: "Twenty Six", 27: "Twenty Seven", 28: "Twenty Eight",
    29: "Twenty Nine", 30: "Thirty", 31: "Thirty One", 32: "Thirty Two", 33: "Thirty Three", 34: "Thirty Four",
    35: "Thirty Five", 36: "Thirty Six", 37: "Thirty Seven", 38: "Thirty Eight", 39: "Thirty Nine", 40: "Forty",
    41: "Forty One", 42: "Forty Two", 43: "Forty Three", 44: "Forty Four", 45: "Forty Five", 46: "Forty Six",
    47: "Forty Seven", 48: "Forty Eight", 49: "Forty Nine", 50: "Fifty", 51: "Fifty One", 52: "Fifty Two",
    53: "Fifty Three", 54: "Fifty Four", 55: "Fifty Five", 56: "Fifty Six", 57: "Fifty Seven", 58: "Fifty Eight",
    59: "Fifty Nine", 60: "Sixty", 61: "Sixty One", 62: "Sixty Two", 63: "Sixty Three", 64: "Sixty Four",
    65: "Sixty Five", 66: "Sixty Six", 67: "Sixty Seven", 68: "Sixty Eight", 69: "Sixty Nine", 70: "Seventy",
    71: "Seventy Two", 72: "Seventy Two", 73: "Seventy Three", 74: "Seventy Four", 75: "Seventy Five", 76: "Seventy Six",
    77: "Seventy Seven", 78: "Seventy Eight", 79: "Seventy Nine", 80: "Eighty", 81: "Eighty One", 82: "Eighty Two",
    83: "Eighty Three", 84: "Eighty Four", 85: "Eighty Five", 86: "Eighty Six", 87: "Eighty Seven", 88: "Eighty Eight",
    89: "Eighty Nine", 90: "Ninety", 91: "Ninety One", 92: "Ninety Two", 93: "Ninety Three", 94: "Ninety Four",
    95: "Ninety Five", 96: "Ninety Six", 97: "Ninety Seven", 98: "Ninety Eight", 99: "Ninety Nine", 100: "Hundred" };`;
  var mT = "var marksTable = document.getElementById('ctl00_mastercontentplaceholder_GridDetails');";
  var sC = "var studentsCount = document.getElementById('ctl00_mastercontentplaceholder_GridDetails').rows.length;";
  var f = `function findReg(regNo){
            var R = [];
            for (var i = 0 ; i<marks.length;i++){
                if(regNo == marks[i][2]){
                  R = marks[i];
                  break;
                }
              }
              return R;
            }`;
  var l = `for(var i = 2; i<=studentsCount;i++){
              var sNo = (i).toLocaleString('en-US',{minimumIntegerDigits: 2, useGrouping:false});
              var regNumberOnWeb = marksTable.rows[i-1].cells[1].innerText;
              var R = findReg(regNumberOnWeb);
              var flag=0;
              if(R.length != 0){

                //console.log(regNumberOnWeb, document.getElementById('ctl00_mastercontentplaceholder_gvInternalmark_ctl'+sNo+'_txtAttendancemark').value);
              document.getElementById('ctl00_mastercontentplaceholder_GridDetails_ctl'+sNo+'_Txtmarks').value=R[3];
              document.getElementById('ctl00_mastercontentplaceholder_GridDetails_ctl'+sNo+'_txtMarkWord').value=words[R[3]];
              //console.log("Found: "+R[2]+", Marks have been filled!");
            }
            else if (R.length == 0){
              flag=1;
              console.log("For RegNo: "+regNumberOnWeb+", Details Not Found-> Check Input File or Edit it Manually on the portal");
              //alert("For RegNo: "+regNumberOnWeb+" Details Not Found-> Check Input File");
            }
          }
          if(flag == 0){
            console.log("All Set, Good To Go !\\n*****Please Use Submit button on the AKU portal to save your data.*****\\n*****Please Crosscheck before Making Final Submission i.e before Principal's Approval*****");}`;
            return "\n".concat(words, "\n", mT, "\n", sC, "\n", f, "\n", l);
          }
});
