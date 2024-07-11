import { ServiceService } from 'src/app/service/service.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-withdraw-propose',
  templateUrl: './withdraw-propose.component.html',
  styleUrls: ['./withdraw-propose.component.css']
})
export class WithdrawProposeComponent implements OnInit {
  enable_edit: boolean;

  constructor(private ServiceService:ServiceService) { }
// @Input AppNo 
newWithdrawPropose :WithdrawPropose ={ } as WithdrawPropose;
proposeList: any[] = [];
  ngOnInit() {
   this.getWithdrawpropose();
  }
  getWithdrawpropose(){
    
    this.ServiceService.getWithdrawpropose().subscribe(data=>{
      this.enable_edit=true
      if (Array.isArray(data)) {
        this.proposeList = data;
      } else {
        this.proposeList = [data];
      }
    })
  }
}
export class WithdrawPropose{
  
   public customer_ID: any;
    publictitle_Deed_No: any;
    public is_approved: any;
    public approved_by: any;
    public created_by: any;
    public updated_by: any;
    public created_date: any;
    public updated_date: any;
}