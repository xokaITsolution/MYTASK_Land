import { Component, OnInit } from "@angular/core";
import { NetworkMonitoringService } from "./network-monitoring.service";
import { DatabaseMonitoringService } from "./database-monitoring.service";
import { Subject, Subscription } from "rxjs";

@Component({
  selector: "app-network-database-monitoring-tool",
  templateUrl: "./network-database-monitoring-tool.component.html",
  styleUrls: ["./network-database-monitoring-tool.component.css"],
})
export class NetworkDatabaseMonitoringToolComponent implements OnInit {
  connectivityStatus: string = "Checking...";
  pingResult: string = "Pinging...";
  bandwidthResult: string = "Measuring...";
  networkReliability: string = "Assessing...";
  databaseStatus: string = "Checking...";
  databaseportalStatus: string = "Checking...";
  constructor(
    private networkService: NetworkMonitoringService,
    private databasedervice: DatabaseMonitoringService
  ) {}
  private nwtwokrChangeSubscription: Subscription;
  ngOnInit() {
    this.nwtwokrChangeSubscription =
      this.networkService.headerChange$.subscribe(() => {
        // Perform header initialization here
        console.log("Header initialized due to change in another component");

        this.initnetwokr();
      });
  }
  initnetwokr() {
    this.checkConnectivity();
    this.checkDatabaseStatus();
    this.pingServer();
    //this.measureBandwidth();
    this.assessNetworkReliability();
    this.checkDatabaseportalStatus();
    //this.createPieChart();
  }
  checkConnectivity() {
    this.networkService.checkConnectivity().subscribe(
      (isConnected) => {
        this.connectivityStatus = isConnected ? "Connected" : "Disconnected";
      },
      (error) => {
        console.error("Error checking connectivity:", error);
        this.connectivityStatus = "Error";
      }
    );
  }

  pingServer() {
    this.networkService.pingServerapi().subscribe(
      (pingTime) => {
        this.pingResult = `Ping time: ${pingTime} ms`;
      },
      (error) => {
        console.error("Error pinging server:", error);
        this.pingResult = "Ping failed";
      }
    );
  }

  measureBandwidth() {
    const serverUrl = "http://ct.addisland.gov.et/"; // Replace with your server URL
    const fileSizeMB = 10; // Size of the file to download in MB
    this.networkService.measureBandwidth(serverUrl, fileSizeMB).subscribe(
      (bandwidth) => {
        this.bandwidthResult = `Bandwidth: ${bandwidth.toFixed(2)} Mbps`;
      },
      (error) => {
        console.error("Error measuring bandwidth:", error);
        this.bandwidthResult = "Measurement failed";
      }
    );
  }

  assessNetworkReliability() {
    const pingThreshold = 100; // Threshold in milliseconds
    this.networkService.assessNetworkReliability(pingThreshold).subscribe(
      (isReliable) => {
        this.networkReliability = isReliable ? "Reliable" : "Unreliable";
      },
      (error) => {
        console.error("Error assessing network reliability:", error);
        this.networkReliability = "Assessment failed";
      }
    );
  }
  checkDatabaseStatus() {
    const databaseUrl = "Tenure"; // Replace with your database URL
    const databaseportalUrl = "XOKASWCMS_Land"; // Replace with your database URL

    this.databasedervice.checkDatabaseStatus(databaseUrl).subscribe(
      (isOnline) => {
        this.databaseStatus = isOnline ? "Online" : "Offline";
      },
      (error) => {
        console.error("Error checking database status:", error);
        this.databaseStatus = "Error";
      }
    );
  }
  checkDatabaseportalStatus() {
    const databaseportalUrl = "XOKASWCMS_Land"; // Replace with your database URL

    this.databasedervice.checkDatabaseStatus(databaseportalUrl).subscribe(
      (isOnline) => {
        this.databaseportalStatus = isOnline ? "Online" : "Offline";
      },
      (error) => {
        console.error("Error checking database status:", error);
        this.databaseStatus = "Error";
      }
    );
  }

  // createPieChart() {
  //   const ctx = document.getElementById("myChart") as HTMLCanvasElement;
  //   new Chart(ctx, {
  //     type: "pie",
  //     data: {
  //       labels: ["Connected", "Disconnected", "Error"],
  //       datasets: [
  //         {
  //           data: [0, 0, 0], // Placeholder data
  //           backgroundColor: ["green", "red", "yellow"],
  //         },
  //       ],
  //     },
  //     options: {
  //       responsive: false,
  //     },
  //   });
  // }
}
