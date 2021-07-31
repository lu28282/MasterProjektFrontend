import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { DomainAPIService } from 'src/app/services/API/DomainAPI/domain.service';

@Component({
  selector: 'app-my-chart',
  templateUrl: './my-chart.component.html',
  styleUrls: ['./my-chart.component.css'],
})
export class MyChartComponent implements OnInit {
  constructor(private domainAPIService: DomainAPIService) {
    //this.readCsvData();
    //   this.http.get("./assets/tld2.csv", { responseType: 'text' as 'json'})
    //  .subscribe(data => {this.response=data;});

    this.domainAPIService.getDomains();
  }

  ngOnInit(): void {}

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
}
