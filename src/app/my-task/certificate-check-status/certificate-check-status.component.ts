import { Component, OnInit } from '@angular/core';
import { MyTaskService } from '../my-task.service';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-certificate-check-status',
  templateUrl: './certificate-check-status.component.html',
  styleUrls: ['./certificate-check-status.component.css']
})
export class CertificateCheckStatusComponent implements OnInit {
  titleDeedNo: string = '';
  certificateStatus: any;
  certReportPath: any;
  maxWidth: string = "1800px";
  isMaximized: boolean;

  isCertifcatePrintforConfirmation:boolean=false
  statusList: { error:string, label: string, value: boolean }[] = [];
  constructor(private certificateService: MyTaskService ,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
  }
  onSubmit(): void {
    this.certificateService.getCertificateStatus(this.titleDeedNo).subscribe(
      (data) => {
        this.certificateStatus = data.certificateStatus[0];
        console.log("🚀 ~ CertificateCheckStatusComponent ~ onSubmit ~ certificateStatus:", data)
        this.populateStatusList();
       
      },
      (error) => {
        console.error('Error fetching certificate status', error);
      }
    );
  }
  populateStatusList(): void {
    if (this.certificateStatus) {
      this.certReportPath = this.sanitizer.bypassSecurityTrustResourceUrl(
        environment.certReportPath + "/" + this.titleDeedNo
      );
      this.statusList = [
        { error:'there is no active Certificate Base', label: 'Certificate Base Status', value: this.certificateStatus.Certificate_Basestatus },
        { error:'there is no active Deed Registration', label: 'Deed Registration Status', value: this.certificateStatus.Deed_Registrationstatus },
        { error:'there is no active Certificate Version', label: 'Certificate Version Status', value: this.certificateStatus.Certificate_Versionstatus },
        { error:'there is no active Customer', label: 'Customer Status', value: this.certificateStatus.Customerstatus },
        { error:'there is no active Plot Registration', label: 'Plot Registration Status', value: this.certificateStatus.Plot_Registrationstatus },
        { error:'there is no active Property Registration', label: 'Property Registration Status', value: this.certificateStatus.Property_Registrationstatus },
        { error:'you have to add Document number', label: 'Document Archive Status', value: this.certificateStatus.Document_Archivestatus },
        { error:'there is no active Lease and Owned Land ', label: 'Lease and Owned Land Status', value: this.certificateStatus.Lease_and_Owned_Landstatus },
        { error:'check the plot location', label: 'Plot Location Status', value: this.certificateStatus.Plot_Locationstatus },
        { error:'check the Proporty_Location', label: 'Proporty_Location Status', value: this.certificateStatus.Property_locationstatus },
        { error:'There is no Debt Suspension Record by this title deed/በዚህ የባለቤትነት ደብተር የዕዳ እገዳ መዝገብ የለም። ', label: 'Debt_Suspension_Record Status', value: this.certificateStatus.CertificateStatus },
        { error:'Thems/others/ተጋሪ/እነ no list ', label: 'Thems/others/ተጋሪ/እነ Status', value: this.certificateStatus.numberofcount },
        { error:'Document_Archive no ', label: 'Document_Archive Status', value: this.certificateStatus.numberoffile },
        { error:'Applications no ', label: 'customer apply Applications Status', value: this.certificateStatus.listofapplication },
      ];
    }
  }
  openFullModal() {
    this.isMaximized = true;
    this.maxWidth = "2000px"; // Set the max width for full modal
  }

  openMiniModal() {
    this.isMaximized = false;
    this.maxWidth = "1000px"; // Set the max width for mini modal
  }
}
