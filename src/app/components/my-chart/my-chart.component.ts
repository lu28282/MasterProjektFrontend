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
import { interval, Subscription, timer } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { DomainVulnerabilityAPIService } from 'src/app/services/API/DomainVulnerabilityAPI/domainVulnerability.service';

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

  minDate = { year: 2015, month: 1, day: 1 };
  startDate = { year: 2015, month: 1, day: 1 };
  selectedDate: NgbDate;
  mySub: Subscription;

 

  dateSelect = new EventEmitter<NgbDateStruct>();
  jakobTestinHTML: any[][];
  constructor(
    private domainAPIService: DomainAPIService,
    config: NgbModalConfig,
    private modalService: NgbModal,
    private cWEAPIService: CWEAPIService,
    private domainVulnerability: DomainVulnerabilityAPIService
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

  canvas: any;
  ctx: any;
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

  sendToBackendDomainVulberabilityAmount(event, contentDomain) {
    if (this.startFromDate.getTime() <= this.minToDate.getTime()) {
      let url =
        this.startFromDateString +
        '&' +
        this.minToDateString +
        '&' +
        'countryCode=' +
        this.countryCode.replace('.', '')
        this.editDomainVulberabilityAmount(url)

      this.modalService.dismissAll('Dismissed after saving data');
      this.modalService.open(contentDomain);
    }
  }

  editDomainVulberabilityAmount(url: string){
    this.domainVulnerability.getDomainVulnerability(url).subscribe((res) => {
      if (res) {
        let domainVulner = [];
        let amountOfArray = res.toString().split(',');

        for (let i = 0; i < amountOfArray.length; i++) {
          let currentArray = amountOfArray[i]
            .replace('{', '')
            .replace('}', '')
            .replace('"', '')
            .replace('"', '')
            .split(':');

          const idomainsVulnerability = {
            date: currentArray[0],
            amount: currentArray[1],
          };

          domainVulner.push(idomainsVulnerability);
        }

       

        let date = [];
        let amount = [];
        for (let i = 0; i < domainVulner.length; i++) {
          date.push(domainVulner[i].date);
          amount.push(domainVulner[i].amount);
        }
        
        this.updateChartDomainVulberabilityAmount(date, amount);
      
      }
    });
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

  updateChartDomainVulberabilityAmount(date, amount) {
    var ctx = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: date,
        datasets: [
          {
            label: "Anzahl der Vulberability aller Domains von "+ this.titel,
            data: amount,
            backgroundColor: "#33AEEF",
            borderColor: "#000000",
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

    ctx.update();
    this.modalService.dismissAll('Dismissed after saving data');
  }
}
