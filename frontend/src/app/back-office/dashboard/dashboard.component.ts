import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminLayoutService } from 'app/layouts/admin-layout/admin-layout.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  ip: any;
  // sarveyerList = [
  //   {
  //     name: 'bhargav', value: 1
  //   },
  //   {
  //     name: 'jalpesh', value: 2
  //   },
  //   {
  //     name: 'savan', value: 3
  //   },
  //   {
  //     name: 'darshit', value: 4
  //   },
  // ];

  sarveyerList: any[] = [];
  counterList: any[] = [];
  sarveyerWiseTotalCountList: any[] = [];
  noData: boolean;
  // counterList = [
  //   {
  //     districtName: "સુરેન્દ્રનગર",
  //     talukaName: "વઢવાણ",
  //     applicationYear: "2017",
  //     sarveData: [
  //       {
  //         sarveId: 1,
  //         sarveName: "ફાળવવાની બાકી 1",
  //         count: 11
  //       },
  //       {
  //         sarveId: 2,
  //         sarveName: "ફાળવવાની બાકી 2",
  //         count: 12
  //       },
  //       {
  //         sarveId: 3,
  //         sarveName: "ફાળવવાની બાકી 3",
  //         count: 13
  //       }
  //     ]
  //   },
  //   {
  //     districtName: "સુરેન્દ્રનગર",
  //     talukaName: "વઢવાણ",
  //     applicationYear: "2019",
  //     sarveData: [
  //       {
  //         sarveId: 4,
  //         sarveName: "ફાળવવાની બાકી 1",
  //         count: 21
  //       },
  //       {
  //         sarveId: 2,
  //         sarveName: "ફાળવવાની બાકી 2",
  //         count: 22
  //       },
  //       {
  //         sarveId: 3,
  //         sarveName: "ફાળવવાની બાકી 3",
  //         count: 23
  //       }
  //     ]
  //   },
  //   {
  //     districtName: "સુરેન્દ્રનગર",
  //     talukaName: "થાનગઢ",
  //     applicationYear: "2018",
  //     sarveData: [
  //       {
  //         sarveId: 4,
  //         sarveName: "ફાળવવાની બાકી 1",
  //         count: 21
  //       },
  //       {
  //         sarveId: 2,
  //         sarveName: "ફાળવવાની બાકી 2",
  //         count: 22
  //       },
  //       {
  //         sarveId: 3,
  //         sarveName: "ફાળવવાની બાકી 3",
  //         count: 23
  //       }
  //     ]
  //   },
  //   {
  //     districtName: "સુરેન્દ્રનગર",
  //     talukaName: "વઢવાણ",
  //     applicationYear: "2018",
  //     sarveData: [
  //       {
  //         sarveId: 4,
  //         sarveName: "ફાળવવાની બાકી 1",
  //         count: 21
  //       },
  //       {
  //         sarveId: 2,
  //         sarveName: "ફાળવવાની બાકી 2",
  //         count: 22
  //       },
  //       {
  //         sarveId: 3,
  //         sarveName: "ફાળવવાની બાકી 3",
  //         count: 23
  //       }
  //     ]
  //   },

  // ]

  constructor(private http: HttpClient, private adminLayoutService: AdminLayoutService) { }

  ngOnInit() {
    document.title = 'Dashboard | Mindset Staffing Agency LLC';
    this.getSavryerActiveList()
  }

  getSavryerActiveList() {
    this.adminLayoutService.getSarveMasterActiveList().subscribe((response: any) => {
      if (response.meta.code == 200) {
        this.sarveyerList = response.data;
        this.sarveyerWiseTotalCountList = this.sarveyerList
        this.getDashboardCountList();

      }
    })
  }
  totalCount: any;
  getDashboardCountList() {
    this.counterList = [];
    this.adminLayoutService.getDashboardCountList().subscribe((Response: any) => {
      if (Response.meta.code == 200) {
        // this.counterList = this.transform(Response.data, 'talukaName');
        // console.log(this.counterList);

        let array = [];

        Response.data.forEach((y: any) => {
          let sarveArray = [];
          this.sarveyerList.forEach((x: any) => {
            let count = 0;
            x.count = x.count ? x.count : 0
            y.sarveData.forEach((z: any) => {
              if (z.sarveId == x._id) {
                count = z.count

                // x.count = x.count ? x.count : 0
                x.count = x.count + z.count
              }
            });
            let sarveObj = {
              sarveId: x._id,
              sarveName: x.name,
              count: count
            };
            sarveArray.push(sarveObj);
          });
          let Obj = {
            districtName: y.districtName,
            talukaName: y.talukaName,
            applicationYear: y.applicationYear,
            sarveData: sarveArray
          }
          array.push(Obj);
        })
        let totalcount = 0;
        array.forEach((x: any) => {
          x.count = x.count ? x.count : 0
          x.sarveData.forEach((y: any) => {
            x.count = x.count + y.count;
          })
          totalcount = x.count + totalcount;
        })

        this.totalCount = totalcount

        this.counterList = this.transform(array, 'talukaName');
        console.log('counterList', this.counterList);

        this.noData = false;
      }
      else {
        this.noData = true;
      }
    })
  }

  transform(collection: any[], property: string): any {
    if (!collection) {
      return null;
    }
    const groupedCollection = collection.reduce((previous, current) => {
      if (!previous[current[property]]) {
        previous[current[property]] = [current];
      }
      else {
        previous[current[property]].push(current);
      }
      return previous;
    }, {});
    return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }

  transformSort(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return -1;
      } else if (a[field] > b[field]) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }


  downloadExcelReport() {

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Application Report');


    worksheet.columns = [
      { header: 'અનુ ક્રમ નંબર', key: 'index', width: 10 },
      { header: 'જીલ્લાનુ નામ', key: 'districtName', width: 10 },
      { header: 'તાલુકાનુ નામ', key: 'talukaName', width: 10 },
      { header: 'અરજીનુ વર્ષ', key: 'applicationYear', width: 10 },

    ];

    let array = worksheet.columns;

    for (let i = 0; i < this.sarveyerList.length; i++) {
      const element = this.sarveyerList[i];
      worksheet.columns = [{ header: element.name, key: 'sarveName' + i, width: 20 }];
      array.push(worksheet.columns[0])
    }

    worksheet.columns = [{ header: 'ટોટલ', key: 'total', width: 10 }]
    array.push(worksheet.columns[0]);

    worksheet.columns = array;



    this.counterList.forEach((x: any, index) => {

      let mainIndex = index
      let data = this.transformSort(x.value, 'applicationYear');

      console.log(data);
      var currentRowIdx = 0;

      data.forEach((x: any, index) => {
        var dataObj = {};
        const dataIndex = index;



        if (index == 0) {
          dataObj = {
            index: mainIndex,
            districtName: x.districtName,
            talukaName: x.talukaName,
            applicationYear: x.applicationYear,
          }
        }
        else {
          dataObj = {
            districtName: x.districtName,
            talukaName: x.talukaName,
            applicationYear: x.applicationYear,
          }
        }

        var sarveObj = {};
        this.sarveyerList.forEach((z: any) => {
          x.sarveData.forEach((y: any, index) => {
            if (y.sarveId == z._id) {
              let sarveName = 'sarveName' + index
              let tempObj = {
                [sarveName]: y.count
              }
              sarveObj = Object.assign(sarveObj, tempObj);
            }
          })
        })
        var totalObj = {
          total: x.count
        }

        let mainObj = Object.assign(dataObj, sarveObj, totalObj);

        console.log("mainObj", mainObj);

        let row = worksheet.addRow(mainObj);

        if (dataIndex == 0) {
          currentRowIdx = worksheet.rowCount;
        }
        if (data.length == dataIndex + 1) {
          const endRowIdx = data.length + (currentRowIdx - 1);
          worksheet.mergeCells(currentRowIdx, 1, endRowIdx, 1);
          // row[currentRowIdx, 1, endRowIdx, 1]
          row.eachCell((cell, number) => {
            if (number == 1) {
              Object.assign(cell, {
                alignment: { horizontal: 'center', vertical: 'middle' }
              })
            }
          });
        }
      })
    })

    var sarveTempObj = {};
    sarveTempObj = Object.assign(sarveTempObj, { index: "ટોટલ" });
    for (let i = 0; i < this.sarveyerList.length; i++) {
      const element = this.sarveyerList[i];
      let sarveName = 'sarveName' + i
      let tempObj = {
        [sarveName]: element.count
      }
      sarveTempObj = Object.assign(sarveTempObj, tempObj);
    }
    sarveTempObj = Object.assign(sarveTempObj, { total: this.totalCount });
    let lastRow = worksheet.addRow(sarveTempObj);

    const currentRowIdx = worksheet.rowCount;
    const endColumnIdx = 4;

    worksheet.mergeCells(currentRowIdx, 1, currentRowIdx, endColumnIdx);
    lastRow.alignment = { horizontal: 'right' };

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'applicationReport.xlsx');
    })

  }


}
