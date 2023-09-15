import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { ServiceService } from "../service.service";
import { PlotManagment } from "../plot-managment/plot-managment.component";
import { ServiceComponent } from "../service.component";
import { NotificationsService } from "angular2-notifications";
import { environment } from "src/environments/environment";
@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.css']
})
export class PlotComponent implements OnChanges {
  @Output() completed = new EventEmitter();
  @Input() Parcel_ID;
  @Input() Parcel_mearge1;
  @Input() Parcel_mearge2;
  @Input() Parcel_mearge3;
  @Input() Parcel_mearge4;
  @Input() disable;
  @Input() LicenceData;
  @Input() todoid;
  @Input() tskID;
  @Input() DocID;
  @Input() AppNo;
  @Input() Fields;
  PlotManagementList = [];
  SelectedPlot;
  plotForm;
  toLease;
  CanDone;
  toMes;
  isnew;
  noinvalidplot;
  OnParcle = -1;
  plotId = null;
  Saved = false;
  language: string;

  constructor(
    private serviceService: ServiceService,
    public serviceComponent: ServiceComponent,
    private notificationsService: NotificationsService,
    
  ) {
  }

  ngOnChanges() {
    this.serviceService.toMes=true
    if (environment.Lang_code === "am-et") {
      this.language = 'amharic';
    }
    else {
      this.language = 'english';
    }
    console.log("emptying list", this.PlotManagementList);
    this.PlotManagementList = [];
    this.noinvalidplot = 0;
    console.log("emptedlist", this.PlotManagementList);
    this.getPloat();
    // this.isvalidated();
  }

  getPloat() {
    this.PlotManagementList = [];
    if (this.Parcel_ID) {
      console.log("geting ploat this.Parcel_ID", this.Parcel_ID);
      this.getPlotManagement(this.Parcel_ID);
    }
    if (this.Parcel_mearge1) {
      console.log("geting ploat this.Parcel_mearge1", this.Parcel_mearge1);
      this.getPlotManagement(this.Parcel_mearge1);
    }
    if (this.Parcel_mearge2) {
      console.log("geting ploat this.Parcel_mearge2", this.Parcel_mearge2);
      this.getPlotManagement(this.Parcel_mearge2);
    }
    if (this.Parcel_mearge3) {
      console.log("geting ploat this.Parcel_mearge3", this.Parcel_mearge3);
      this.getPlotManagement(this.Parcel_mearge3);
    }
    if (this.Parcel_mearge4) {
      console.log("geting ploat this.Parcel_mearge4", this.Parcel_mearge4);
      this.getPlotManagement(this.Parcel_mearge4);
    }
  }
  async getEthiopianToGregorian(date){

    if(date){
    var datenow=  await this.serviceService.getEthiopianToGregorian(date).toPromise()
       console.log(datenow);
       return datenow.nowTime
 
    }
  }
  async getgregorianToEthiopianDate(date) {
    if(date != '0001-01-01T00:00:00'){
    var  datenow = await this.serviceService.getgregorianToEthiopianDate(date).toPromise();
       console.log(datenow);
       return  datenow.nowTime
    }
  }
  getPlotManagement(Parcel_ID) {
    let a;
    this.serviceService.getPlotManagement(Parcel_ID).subscribe(
      async (PlotManagementLists) => {
        a = PlotManagementLists;
       
        let b = false;
        for (let i = 0; i < (PlotManagementLists as any).list.length; i++) {
          if (a.list[0].Plot_ID == (PlotManagementLists as any).list[i].Plot_ID) {
            b = true;
            // this.PlotManagementList[i] = a.list[0];
          }
        }
        if (b) {
          this.noinvalidplot = this.noinvalidplot + 1;
          if(this.language == 'amharic'){
            a.list[0].Registration_Date= await this.getgregorianToEthiopianDate(a.list[0].Registration_Date)}
          this.PlotManagementList.push(a.list[0]);
          console.log(this.PlotManagementList)
          this.isisvalidated(
            this.todoid,
            this.tskID,
            a.list[0].Plot_ID,
            "00000000-0000-0000-0000-000000000000",
            this.DocID
          );
        }

        console.log("PlotManagementList", PlotManagementLists);
        console.log("this.PlotManagementList", this.PlotManagementList);
      },
      (error) => {
        console.log("error");
      }
    );
  }

  SelectPLot(plot) {
    this.SelectedPlot = plot;
    console.log('dfghgfd',plot);
  
    plot.SDP_ID = this.serviceComponent.licenceData.SDP_ID;
    plot.Licence_Service_ID = this.LicenceData.Licence_Service_ID;
    plot.Application_No = this.AppNo;
    if (plot.Registration_Date) {
      plot.Registration_Date = plot.Registration_Date.split("T")[0];
    }
    // this.plotForm = true;
     
  }
  highlighted
  tab1;
  tab2;
  initTabs() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tabChanged(e) {
    console.log(e.index);
    if (e.index == 0) {
      this.tab1 = true;
      this.tab2 = false;
    } else if (e.index == 1) {

      this.tab1 = false;
      this.tab2 = true;
    }
  }

  public selectedTab = 0;
  showform() {
     this.plotForm = true;
     this.isnew = false;
     this.serviceService.isleaseForm = false;
  }
  AddPLot() {
    this.serviceService.toMes=true
    this.isnew = true;
    this.plotForm = true;
    const plot = new PlotManagment();
    // plot.SDP_ID = this.LicenceData.SDP_ID;
    console.log(this.Parcel_ID)
    plot.Licence_Service_ID = this.LicenceData.Licence_Service_ID;
    plot.Application_No = this.AppNo;
    if (this.Parcel_ID) {
      if (this.PlotManagementList.length == 0) {
        plot.Plot_ID = this.Parcel_ID;
        if (!this.Parcel_ID) {
          this.OnParcle = 0;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 1) {
        plot.Plot_ID = this.Parcel_mearge1;
        if (!this.Parcel_mearge1) {
          this.OnParcle = 1;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 2) {
        plot.Plot_ID = this.Parcel_mearge2;
        if (!this.Parcel_mearge2) {
          this.OnParcle = 2;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 3) {
        plot.Plot_ID = this.Parcel_mearge3;
        if (!this.Parcel_mearge3) {
          this.OnParcle = 3;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 4) {
        plot.Plot_ID = this.Parcel_mearge4;
        if (!this.Parcel_mearge4) {
          this.OnParcle = 4;
        }
        this.SelectedPlot = plot;
      } else {
      }
    } else if (this.Parcel_mearge1) {
      if (this.PlotManagementList.length == 0) {
        plot.Plot_ID = this.Parcel_mearge1;
        this.SelectedPlot = plot;
        if (!this.Parcel_mearge1) {
          this.OnParcle = 1;
        }
      } else if (this.PlotManagementList.length == 1) {
        plot.Plot_ID = this.Parcel_mearge2;
        if (!this.Parcel_mearge2) {
          this.OnParcle = 2;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 2) {
        plot.Plot_ID = this.Parcel_mearge3;
        if (!this.Parcel_mearge3) {
          this.OnParcle = 3;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 3) {
        plot.Plot_ID = this.Parcel_mearge4;
        if (!this.Parcel_mearge4) {
          this.OnParcle = 4;
        }
        this.SelectedPlot = plot;
      } else if (this.PlotManagementList.length == 4) {
        plot.Plot_ID = this.Parcel_ID;
        if (!this.Parcel_ID) {
          this.OnParcle = 0;
        }
        this.SelectedPlot = plot;
      }
    } else {
      this.SelectedPlot = plot;
    }
  }

  isvalidated() {
    if (this.Parcel_ID) {
      console.log("validating ploat this.Parcel_ID", this.Parcel_ID);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_ID,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge1) {
      console.log("validating ploat this.Parcel_mearge1", this.Parcel_mearge1);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge1,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge2) {
      console.log("validating ploat this.Parcel_mearge2", this.Parcel_mearge2);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge2,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge3) {
      console.log("validating ploat this.Parcel_mearge3", this.Parcel_mearge3);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge3,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
    if (this.Parcel_mearge4) {
      console.log("validating ploat this.Parcel_mearge4", this.Parcel_mearge4);
      this.isisvalidated(
        this.todoid,
        this.tskID,
        this.Parcel_mearge4,
        "00000000-0000-0000-0000-000000000000",
        this.DocID
      );
    }
  }

  isisvalidated(todoID, tskID, plotid, proid, DocID) {
    this.serviceService
      .isvalidated(todoID, tskID, plotid, proid, DocID)
      .subscribe(
        (Validated) => {
          if (Validated == "Validated") {
            this.noinvalidplot = this.noinvalidplot - 1;
            console.log("noinvalidplot", this.noinvalidplot);
            if (this.noinvalidplot == 0) {
              if (!this.Saved) {
                this.completed.emit();
                this.Saved = true;
                this.CanDone = true;
              }
              // this.CanDone = true;
            }
          } else {
            // this.validated = false;
            // const toast = this.notificationsService.warn("Warning", Validated);
            console.log("Warning=>>> " + Validated);
          }
          // this.RequerdDocs = RequerdDocs;

          // this.getAllDocument();
          // console.log('RequerdDocs', this.RequerdDocs);
        },
        (error) => {
          console.log("error");
        }
      );
  }

  EnableFins() {
    this.getPloat();
    this.isvalidated();
  }

  EnableFinsDel() {
    this.plotForm = false;
    this.getPloat();
  }

  EnableFinsPloat(Parcel) {
    console.log("FinalPLoat", Parcel);
    console.log("FinalPLoat ID", Parcel.Plot_ID);
    // this.plotForm = false;
    this.plotId = Parcel.Plot_ID;

    if (this.OnParcle !== -1) {
      if (this.OnParcle == 0) {
        this.Parcel_ID = Parcel.Plot_ID;
        this.LicenceData.Parcel_ID = Parcel.Plot_ID;
      }
      if (this.OnParcle == 1) {
        this.Parcel_mearge1 = Parcel.Plot_ID;
        this.LicenceData.Plot_Merge_1 = Parcel.Plot_ID;
      }
      if (this.OnParcle == 2) {
        this.Parcel_mearge2 = Parcel.Plot_ID;
        this.LicenceData.Plot_Merge_2 = Parcel.Plot_ID;
      }
      if (this.OnParcle == 3) {
        this.Parcel_mearge3 = Parcel.Plot_ID;
        this.LicenceData.Plot_Merge_3 = Parcel.Plot_ID;
      }
      if (this.OnParcle == 4) {
        this.Parcel_mearge4 = Parcel.Plot_ID;
        this.LicenceData.Plot_Merge_4 = Parcel.Plot_ID;
      }
    } else {
      this.Parcel_ID = Parcel.Plot_ID;
      this.LicenceData.Parcel_ID = Parcel.Plot_ID;
    }
    this.serviceService.UpdateLicence(this.LicenceData).subscribe(
      (Licence) => {
        console.log("Licence", Licence);
        if (this.isnew) {
          this.SelectedPlot = Parcel;
          // this.SelectedPlot.Parcel_ID = Parcel_ID;
          this.toLease = true;
        } else {
          this.isvalidated();
        }
      },
      (error) => {
        console.log("error");
        if (error.status == "400") {
          const toast = this.notificationsService.error(
            "Error",
            error.error.InnerException.Errors[0].message
          );
        } else {
          const toast = this.notificationsService.error(
            "Error",
            "SomeThing Went Wrong"
          );
        }
      }
    );
    this.PlotManagementList = [];
    // this.getPloat();
  }

  DoneNew() {
    this.plotForm = false;
    this.isvalidated();

    this.toLease = false;
    this.CanDone = false;
  }

  EnableFinsLise() {
    this.isvalidated();
    this.toMes=true;
    this.getPloat();
    this.CanDone = true;
  }
}
