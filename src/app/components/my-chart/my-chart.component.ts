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

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css'],
})
export class MyChartComponent implements OnInit {
  idomains: import('d:/LernProjekt/MasterProjektFrontend/src/app/interfaces/domains').IDomains[];
  titel: String;
  startFromDate:Date;
  startFromDateString:String;
  minToDate:Date;
  minToDateString:String;
  startDateFrom: Date;
  countryCode: String;

  minDate = { year: 2015, month: 1, day: 1 };
  startDate = { year: 2015, month: 1, day: 1,};
  selectedDate: NgbDate;

  dateSelect = new EventEmitter<NgbDateStruct>();
  constructor(
    private domainAPIService: DomainAPIService,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.domainAPIService.getDomains();
  }

  ngOnInit(): void {
    setTimeout(() => {
      // console.log(this.domainAPIService.getMyTest());
      this.idomains = this.domainAPIService.getDomains();
    }, 500);
  }

  canvas: any;
  ctx: any;
  @ViewChild('mychart') mychart: any;

  ngAfterViewInit() {
    this.canvas = this.mychart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    var ctx = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: ['BJP', 'INC', 'AAP', 'CPI', 'CPI-M', 'NCP'],
        datasets: [
          {
            label: '# of Votes',
            data: [200, 50, 30, 15, 20, 34],
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
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

    ctx.data.labels = ['1', '2', '3', '4', '5'];
    ctx.update();
  }

  openCountry(event, content) {
    var target = event.target || event.srcElement || event.currentTarget;

    //Get the ID of a
    var idAttr = target.attributes.id;

    //Get domains
    var value = idAttr.nodeValue;

    this.countryCode=value;

    var country = event.srcElement.innerText;
    this.titel = country;
    this.modalService.open(content);
  }

  sendToBackend() {

    if(this.startFromDate.getTime()<=this.minToDate.getTime()){
      console.log(this.startFromDateString+"&"+this.minToDateString+"&"+"countrycode="+this.countryCode);
      this.modalService.dismissAll('Dismissed after saving data');
    }
   
  }


  dateNavigateFrom($event: NgbDatepickerNavigateEvent) {
    this.startFromDate=new Date($event.next.year,$event.next.month-1);
   
   
    if(($event.next.month)<10){
      this.startFromDateString="?startdate="+this.startFromDate.getFullYear()+"0"+($event.next.month).toString();
    }else{
      this.startFromDateString="?startdate="+this.startFromDate.getFullYear()+($event.next.month).toString();
    }
     
    
  }
  dateNavigateTo($event: NgbDatepickerNavigateEvent) {
    this.minToDate=new Date($event.next.year,$event.next.month-1);

    if(($event.next.month)<10){
      this.minToDateString="?enddate="+this.minToDate.getFullYear()+"0"+($event.next.month).toString();
    }else{
      this.minToDateString="?enddate="+this.minToDate.getFullYear()+($event.next.month).toString();
    }
    
  }

  compareDate(){
    return !(this.startFromDate.getTime()<=this.minToDate.getTime());
  }
  
}
