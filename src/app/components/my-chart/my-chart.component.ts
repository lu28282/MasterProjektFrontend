import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DomainAPIService } from 'src/app/services/API/DomainAPI/domain.service';
import {
  NgbModalConfig,
  NgbModal,
  NgbDateStruct,
  NgbDate,
  NgbDatepickerNavigateEvent,
} from '@ng-bootstrap/ng-bootstrap';
import { CWEAPIService } from 'src/app/services/API/CWEAPI/cwe.service';
import { ICWE } from 'src/app/interfaces/cwe';
import { IDomains } from 'src/app/interfaces/domains';
import { Subscription } from 'rxjs';
import { DomainVulnerabilityAPIService } from 'src/app/services/API/DomainVulnerabilityAPI/domainVulnerability.service';
import { ExploitabilityScoreAPIService } from 'src/app/services/API/exploitabilityScoreAPI/exploitabilityScore.service';
import { ImpactScoreAPIService } from 'src/app/services/API/ImpactScoreAPI/impactScoreAPI.service';

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css'],
})
export class MyChartComponent implements OnInit {
  idomains: IDomains[];
  icwe: ICWE[];
  titel: String;
  startFromDate: Date;
  startFromDateString: String;
  minToDate: Date;
  minToDateString: String;
  startDateFrom: Date;
  countryCode: String;

  minDate = { year: 2016, month: 1, day: 1 };
  startDate = { year: 2016, month: 1, day: 1 };
  selectedDate: NgbDate;
  mySub: Subscription;
  lowerLimit: any;
  upperLimit: any;

  dateSelect = new EventEmitter<NgbDateStruct>();
  canvas: any;
  ctx: any;
  myChart: Chart;
  cweNumber: String;

  constructor(
    private domainAPIService: DomainAPIService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private cWEAPIService: CWEAPIService,
    private domainVulnerability: DomainVulnerabilityAPIService,
    private exploitabilityScoreAPIService: ExploitabilityScoreAPIService,
    private impactScoreAPIService: ImpactScoreAPIService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.domainAPIService.getDomains();
  }

  ngOnInit(): void {
    // this.cWEAPIService
    //   .getCWEJsonSubscribe()
    //   .pipe(take(1))
    //   .subscribe((res) => {
    //     this.icwe = res;
    //   });

    setTimeout(() => {
      this.idomains = this.domainAPIService.getDomains();
    }, 500);

    // setInterval(() => {
    //   this.cWEAPIService.getCWEJsonSubscribe().subscribe((res) => {
    //     this.icwe = res;
    //   });
    // }, 15000);
  }

  @ViewChild('mychart') mychart: any;

  ngAfterViewInit() {
    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');
  }

  openCountry(event, content) {
    var target = event.target || event.srcElement || event.currentTarget;

    //Get the ID of a
    var idAttr = target.attributes.id;

    //Get domains
    var value = idAttr.nodeValue;

    this.countryCode = value;

    var country = event.srcElement.innerText;
    this.titel = country;
    this.modalService.open(content);
  }

  openCWE(contentCWE) {
    this.modalService.open(contentCWE);
  }

  openImpactScore(impactScore) {
    this.modalService.open(impactScore);
  }
  openExploitabilityScore(exploitabilityScore) {
    this.modalService.open(exploitabilityScore);
  }

  lowerLimitPattern(event) {
    //const pattern = /[0-9.,]/;
    // this.lowerLimit.toString();
    // const pattern = /^\d+((.)|(.\d{0,1})?)$/;
    // //let inputChar = event.target.value;
    // let inputChar = event;
    // console.log(!pattern.test(inputChar));

    if (event != null) {
      //this.lowerLimit=this.lowerLimit.replace(/[^.\d]/g, '');
      const pattern = /^\d+((.)|(.\d{0,1})?)$/;
      let inputChar = event;
      if (!pattern.test(inputChar)) {
        // const text = this.lowerLimit;
        // const editText = text.slice(0,-1)
        //this.lowerLimit=editText.replace(/[^.\d]/g, '');

        const realNumber = (Math.round(event * 100) / 100).toFixed(1);
        this.lowerLimit = realNumber;
      }

      if (this.lowerLimit > 10) {
        this.lowerLimit = 10;
      }

      const realNumber = (Math.round(event * 100) / 100).toFixed(1);
      this.lowerLimit = realNumber;
    }

    // if (!pattern.test(inputChar)) {
    //   console.log('Jaa');
    //   // const text = this.lowerLimit;
    //   // const editText = text.slice(0,-1)
    //   // let str = this.lowerLimit;
    //   // str = str.substring(0, str.length - 1);
    //   // console.log(str);

    //   //this.lowerLimit=editText;
    // }
  }

  upperLimitPattern(event) {
    if (event != null) {
      //this.lowerLimit=this.lowerLimit.replace(/[^.\d]/g, '');
      const pattern = /^\d+((.)|(.\d{0,1})?)$/;
      let inputChar = event;
      if (!pattern.test(inputChar)) {
        // const text = this.lowerLimit;
        // const editText = text.slice(0,-1)
        //this.lowerLimit=editText.replace(/[^.\d]/g, '');

        const realNumber = (Math.round(event * 100) / 100).toFixed(1);
        this.upperLimit = realNumber;
      }
      if (this.upperLimit > 10) {
        this.upperLimit = 10;
      }

      const realNumber = (Math.round(event * 100) / 100).toFixed(1);
      this.upperLimit = realNumber;
    }
  }

  sendToBackendDomainVulberabilityAmount(event, contentWait) {
    if (this.startFromDate.getTime() <= this.minToDate.getTime()) {
      let url =
        this.startFromDateString +
        '&' +
        this.minToDateString +
        '&' +
        'countryCode=' +
        this.countryCode.replace('.', '');
      this.editDomainVulberabilityAmount(url);

      this.modalService.dismissAll('Dismissed after saving data');
      this.modalService.open(contentWait);
    }
  }

  sendToBackendCWEVulberabilityAmount(event, contentWait) {
    if (this.startFromDate.getTime() <= this.minToDate.getTime()) {
      let url =
        this.startFromDateString +
        '&' +
        this.minToDateString +
        '&' +
        'cwe=CWE-' +
        this.cweNumber;
      this.editCWEVulnberabilityAmount(url);

      this.modalService.dismissAll('Dismissed after saving data');
      this.modalService.open(contentWait);
    }
  }

  sendToBackendImpactScore(event, contentWait) {
    const compareLowerLimitWithUpperLimit =
      Number(this.lowerLimit) <= Number(this.upperLimit);
    if (
      compareLowerLimitWithUpperLimit &&
      this.startFromDate.getTime() <= this.minToDate.getTime()
    ) {
      let url =
        this.startFromDateString +
        '&' +
        this.minToDateString +
        '&' +
        'lowerLimit=' +
        this.lowerLimit +
        '&' +
        'upperLimit=' +
        this.upperLimit;
      this.editImpactScore(url);

      this.modalService.dismissAll('Dismissed after saving data');
      this.modalService.open(contentWait);
    }
  }

  sendToBackendExploitabilityScore(event, contentWait) {
    const compareLowerLimitWithUpperLimit =
      Number(this.lowerLimit) <= Number(this.upperLimit);
    if (
      compareLowerLimitWithUpperLimit &&
      this.startFromDate.getTime() <= this.minToDate.getTime()
    ) {
      let url =
        this.startFromDateString +
        '&' +
        this.minToDateString +
        '&' +
        'lowerLimit=' +
        this.lowerLimit +
        '&' +
        'upperLimit=' +
        this.upperLimit;
      this.editExploitabilityScore(url);

      this.modalService.dismissAll('Dismissed after saving data');
      this.modalService.open(contentWait);
    }
  }
  editExploitabilityScore(url: string) {
    this.exploitabilityScoreAPIService
      .getExploitabilityScore(url)
      .subscribe((res) => {
        if (res) {
          const text =
            'Anzahl der Exploitability Score von ' +
            this.lowerLimit +
            ' bis ' +
            this.upperLimit;

          this.editingArrayForGraphic(res, text);
        }
      });
  }

  editImpactScore(url: string) {
    this.impactScoreAPIService.getImpactScore(url).subscribe((res) => {
      if (res) {
        const text =
          'Anzahl der Impact Score von ' +
          this.lowerLimit +
          ' bis ' +
          this.upperLimit;
        this.editingArrayForGraphic(res, text);
      }
    });
  }

  editDomainVulberabilityAmount(url: string) {
    this.domainVulnerability.getDomainVulnerability(url).subscribe((res) => {
      if (res) {
        const text = 'Anzahl der vulnerability aller Domains von ' + this.titel;
        this.editingArrayForGraphic(res, text);
      }
    });
  }

  editCWEVulnberabilityAmount(url: string) {
    this.cWEAPIService.getCWEJsonSubscribe(url).subscribe((res) => {
      if (res) {
        const text = 'Anzahl der vulnerability von CWE-' + this.cweNumber;

        this.editingArrayForGraphic(res, text);
      }
    });
  }

  editingArrayForGraphic(array, text: string) {
    let amountOfArray = array.toString().split(',');

    let newArray = [];

    for (let i = 0; i < amountOfArray.length; i++) {
      let currentArray = amountOfArray[i]
        .replace('{', '')
        .replace('}', '')
        .replace('"', '')
        .replace('"', '')
        .split(':');

      const iArray = {
        date: new Date(currentArray[0]),
        amount: currentArray[1],
      };

      newArray.push(iArray);
    }
    newArray.sort((a, b) => a.date - b.date);
    let date = [];
    let amount = [];
    for (let i = 0; i < newArray.length; i++) {
      let month = null;
      let year = newArray[i].date.getFullYear();
      if (newArray[i].date.getMonth() + 1 < 10) {
        month = (0).toString() + (newArray[i].date.getMonth() + 1);
      } else {
        month = newArray[i].date.getMonth() + 1;
      }
      //let month = domainVulner[i].date.getMonth()+1;
      date.push(year + '-' + month);
      amount.push(newArray[i].amount);
    }

    this.updateChart(date, amount, text);
  }

  dateNavigateFrom($event: NgbDatepickerNavigateEvent) {
    this.startFromDate = new Date($event.next.year, $event.next.month - 1);

    if ($event.next.month < 10) {
      this.startFromDateString =
        'startDate=' +
        this.startFromDate.getFullYear() +
        '_' +
        '0' +
        $event.next.month.toString();
    } else {
      this.startFromDateString =
        'startDate=' +
        this.startFromDate.getFullYear() +
        '_' +
        $event.next.month.toString();
    }
  }
  dateNavigateTo($event: NgbDatepickerNavigateEvent) {
    this.minToDate = new Date($event.next.year, $event.next.month - 1);

    if ($event.next.month < 10) {
      this.minToDateString =
        'endDate=' +
        this.minToDate.getFullYear() +
        '_' +
        '0' +
        $event.next.month.toString();
    } else {
      this.minToDateString =
        'endDate=' +
        this.minToDate.getFullYear() +
        '_' +
        $event.next.month.toString();
    }
  }

  compareDate() {
    return !(this.startFromDate.getTime() <= this.minToDate.getTime());
  }

  compareDateAndCWE() {
    return !(
      this.cweNumber != null &&
      this.startFromDate.getTime() <= this.minToDate.getTime()
    );
  }

  compareDateAndLowerLimitWithUpperLimit() {
    const compareLowerLimitWithUpperLimit =
      Number(this.lowerLimit) <= Number(this.upperLimit);

    return !(
      compareLowerLimitWithUpperLimit &&
      this.startFromDate.getTime() <= this.minToDate.getTime()
    );
  }

  updateChart(date, amount, text) {
    if (this.myChart) {
      this.myChart.destroy();
    }

    this.myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: date,
        datasets: [
          {
            label: text,
            data: amount,
            backgroundColor: '#33AEEF',
            borderColor: '#000000',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });

    this.myChart.update();
    this.modalService.dismissAll('Dismissed after saving data');
  }
}
