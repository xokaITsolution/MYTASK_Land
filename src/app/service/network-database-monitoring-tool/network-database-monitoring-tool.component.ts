import { Component, OnInit } from "@angular/core";
import { NetworkMonitoringService } from "./network-monitoring.service";
import { DatabaseMonitoringService } from "./database-monitoring.service";
import { Subject, Subscription } from "rxjs";
import { environment } from "src/environments/environment";

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
  downloadSpeed: any;
  uploadSpeed: any;
  ldapStatus: string = "Checking...";
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
    this.testNetworkSpeed();
    this.checkLDAPStatus();
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
  checkLDAPStatus() {
    const subcityToSDPMapping = {
      arada: "arada.addisland.gov.et",
      bole: "bole-ad.bole.addisland.gov.et",
      nifass: "nifassilk.addisland.gov.et",
      gullele: "gulele-ad.gulele.addisland.gov.et",
      addisk: "addisketema-ad.addisketema.addisland.gov.et",
      lideta: "ideta.addisland.gov.et",
      lemik: "lemikura.addisland.gov.et",
      yeka: "yeka.addisland.gov.et",
      akakyk: "kaliti-ad.kaliti.addisland.gov.et",
      kirkos: "kirkos.addisland.gov.et",
      kolfek: "KOLE-AD.kolfe.addisland.gov.et",
      central: "AD.addisland.gov.et",
    };

    let subcityname = environment.subcity;
    let ldapUrl = subcityToSDPMapping[subcityname.toLowerCase()]; // Get LDAP URL based on subcity

    if (!ldapUrl) {
      console.error("No LDAP URL found for the provided subcity:", subcityname);
      return; // Exit the function if LDAP URL is not found
    }

    this.networkService.testLDAPConnection(ldapUrl).subscribe(
      (response: any) => {
        if (response === true) {
          this.ldapStatus = "Online";
        } else {
          this.ldapStatus = "Offline";
        }
      },
      (error) => {
        console.error("Error checking LDAP status:", error);
        this.ldapStatus = "Error";
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

  async testUploadSpeed(): Promise<number> {
    const startTime = new Date().getTime();
    const payloadSizes = [1024, 10240, 102400]; // Varying payload sizes in bytes
    const uploadUrl = environment.rootPathApi + `Network/Network/upload`;

    let totalSizeUploaded = 0;
    let totalDuration = 0;

    for (const size of payloadSizes) {
      const testData = new Uint8Array(size).fill(0); // Create test data of specified size

      const formData = new FormData();
      formData.append("file", new Blob([testData]));

      const uploadStartTime = new Date().getTime();
      await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const uploadEndTime = new Date().getTime();
      const durationInSeconds = (uploadEndTime - uploadStartTime) / 1000;
      totalSizeUploaded += size;
      totalDuration += durationInSeconds;
    }

    // Calculate the average upload speed
    const averageSpeedMbps =
      (totalSizeUploaded * 8) / (totalDuration * 1000000); // convert bytes to bits and seconds to megabits
    return parseFloat(averageSpeedMbps.toFixed(2));
  }

  async testDownloadSpeed(): Promise<number> {
    const startTime = new Date().getTime();
    const downloadUrl = environment.rootPathApi + `Network/Network/download`;
    const payloadSizes = [1024, 10240, 102400]; // Varying payload sizes in bytes

    let totalSizeDownloaded = 0;
    let totalDuration = 0;

    for (const size of payloadSizes) {
      const downloadStartTime = new Date().getTime();
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          Range: `bytes=0-${size - 1}`, // Request only a portion of the file
        },
      });
      await response.blob();
      const downloadEndTime = new Date().getTime();
      const durationInSeconds = (downloadEndTime - downloadStartTime) / 1000;
      totalSizeDownloaded += size;
      totalDuration += durationInSeconds;
    }

    // Calculate the average download speed
    const averageSpeedMbps =
      (totalSizeDownloaded * 8) / (totalDuration * 1000000); // convert bytes to bits and seconds to megabits
    return parseFloat(averageSpeedMbps.toFixed(2));
  }

  // Usage example:
  async testNetworkSpeed() {
    this.downloadSpeed = await this.testDownloadSpeed();
    this.uploadSpeed = await this.testUploadSpeed();
    console.log("Download Speed:", this.downloadSpeed, "Mbps");
    console.log("Upload Speed:", this.uploadSpeed, "Mbps");
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
