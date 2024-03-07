import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Bill2 } from 'src/app/shared/model/car/Car';
import { CarService } from 'src/app/shared/services/car/car.service';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss']
})
export class AnalyticsDashboardComponent implements OnInit {
  chart: any;
  bills: Bill2[];
  reservationsPerDayMap: Map<string, number>;
  totalRevenue: number;
  avgOrderValuePerUser: number;
  totalOrders: number;
  repeatCustomers: number;
  manufacturersData: { manufacturer: string; count: number }[];
  transmissionData: { label: string; count: number }[];
  fuelTypeData: { label: string; count: number }[];
  carTypeData: { label: string; count: number }[];
  totalCustomers: Set<number>;
  constructor(private carService: CarService) {}

  ngOnInit(): void {
    Chart.register(...registerables);
    this.getBillsData();
  }

  getBillsData(): void {
    const userId = parseInt(localStorage.getItem('userId'));
    this.carService.getBillsWithCarDetails().subscribe((bills: Bill2[]) => {
      this.bills = bills;
      this.updateAnalyticsData();
      this.totalCustomers = new Set<number>();
      this.createChart();
    });
  }

  updateAnalyticsData(): void {
    this.reservationsPerDayMap = new Map<string, number>();
    this.totalRevenue = 0;
    this.totalOrders = 0;
    const totalCustomers = new Set<number>();
    this.repeatCustomers = 0;
    this.manufacturersData = [];
    this.transmissionData = [];
    this.fuelTypeData = [];
    this.carTypeData = [];

    for (const bill of this.bills) {
      const reservationStartDate = new Date(bill.reservationStart);
    const reservationStart = reservationStartDate.toDateString();

    if (this.reservationsPerDayMap.has(reservationStart)) {
      const count = this.reservationsPerDayMap.get(reservationStart);
      this.reservationsPerDayMap.set(reservationStart, count + 1);
    } else {
      this.reservationsPerDayMap.set(reservationStart, 1);
    }

    this.totalRevenue += bill.totalCarCost;
    this.totalOrders++;
    totalCustomers.add(bill.userID);

      // Update manufacturer data
      const foundManufacturer = this.manufacturersData.find(
        (data) => data.manufacturer === bill.carDetails.manufacturer
      );
      if (foundManufacturer) {
        foundManufacturer.count++;
      } else {
        this.manufacturersData.push({ manufacturer: bill.carDetails.manufacturer, count: 1 });
      }

      // Update transmission data
      const transmissionLabel = bill.carDetails.transmissionType === 'Manual' ? 'Manual' : 'Automatic';
      const foundTransmission = this.transmissionData.find((data) => data.label === transmissionLabel);
      if (foundTransmission) {
        foundTransmission.count++;
      } else {
        this.transmissionData.push({ label: transmissionLabel, count: 1 });
      }

      // Update fuel type data
      const fuelTypeLabel = bill.carDetails.fuelType;
      const foundFuelType = this.fuelTypeData.find((data) => data.label === fuelTypeLabel);
      if (foundFuelType) {
        foundFuelType.count++;
      } else {
        this.fuelTypeData.push({ label: fuelTypeLabel, count: 1 });
      }

      // Update car type data
      const carTypeLabel = bill.carDetails.carType;
      const foundCarType = this.carTypeData.find((data) => data.label === carTypeLabel);
      if (foundCarType) {
        foundCarType.count++;
      } else {
        this.carTypeData.push({ label: carTypeLabel, count: 1 });
      }
    }

    this.avgOrderValuePerUser = this.totalRevenue / this.totalOrders;


    if (totalCustomers.size > 1) {
      this.repeatCustomers = totalCustomers.size - 1;
    }
  }

  createChart() {
    setTimeout(()=>{
      this.chart = new Chart('myChart', {
        type: 'bar',
        data: {
          labels: [...this.reservationsPerDayMap.keys()],
          datasets: [
            {
              label: 'Reservations per day',
              data: [...this.reservationsPerDayMap.values()],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    },0);
      // Total Revenue chart

      setTimeout(()=>{
      this.chart = new Chart('totalRevenueChart', {
        type: 'doughnut',
        data: {
          labels: ['Total Revenue', 'Remaining'],
          datasets: [
            {
              data: [this.totalRevenue, 0],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(0,0,0,0)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(0,0,0,0)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          cutout: 80,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },0);
      // Average Order Value chart

      setTimeout(()=>{
      this.chart = new Chart('averageOrderValueChart', {
        type: 'bar',
        data: {
          labels: ['Average Order Value'],
          datasets: [
            {
              data: [this.avgOrderValuePerUser],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },0);
      // Total Orders chart
      setTimeout(()=>{
      this.chart = new Chart('totalOrdersChart', {
        type: 'bar',
        data: {
          labels: ['Total Orders'],
          datasets: [
            {
              data: [this.totalOrders],
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },0);
      // Repeat Customers chart
      setTimeout(()=>{
      this.chart = new Chart('repeatCustomersChart', {
        type: 'pie',
        data: {
          labels: ['Repeat Customers', 'New Customers'],
          datasets: [
            {
              data: [this.repeatCustomers, this.totalCustomers.size - this.repeatCustomers],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 94, 250, 0.988)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(244, 15, 237, 0.988)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    },0);
      // Manufacturers Preferences chart
      setTimeout(()=>{
      this.chart = new Chart('manufacturersChart', {
        type: 'bar',
        data: {
          labels: this.manufacturersData.map((data) => data.manufacturer),
          datasets: [
            {
              label: 'Number of Users',
              data: this.manufacturersData.map((data) => data.count),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },0);
      // Transmission Preferences chart
      setTimeout(()=>{
      this.chart = new Chart('transmissionChart', {
        type: 'pie',
        data: {
          labels: this.transmissionData.map((data) => data.label),
          datasets: [
            {
              data: this.transmissionData.map((data) => data.count),
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 94, 250, 0.988)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(244, 15, 237, 0.988)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    },0);
      // Fuel Type Preferences chart
      setTimeout(()=>{
      this.chart = new Chart('fuelTypeChart', {
        type: 'pie',
        data: {
          labels: this.fuelTypeData.map((data) => data.label),
          datasets: [
            {
              data: this.fuelTypeData.map((data) => data.count),
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 94, 250, 0.988)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(244, 15, 237, 0.988)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    },0);
      // Car Type Preferences chart
      setTimeout(()=>{
      this.chart = new Chart('carTypeChart', {
        type: 'pie',
        data: {
          labels: this.carTypeData.map((data) => data.label),
          datasets: [
            {
              data: this.carTypeData.map((data) => data.count),
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 94, 250, 0.988)', 'rgba(4, 94, 250, 0.988)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(244, 15, 237, 0.988)','rgba(4, 15, 237, 0.988)'],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true
            }
          }
        }
      });
    },0);
    
  }
}