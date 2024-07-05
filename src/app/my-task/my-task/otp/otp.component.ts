import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MyTaskService } from '../../my-task.service';
import { ServiceService } from 'src/app/service/service.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent implements OnInit {

  @ViewChild('digit1', { static: false }) digit1!: ElementRef<HTMLInputElement>;
  @ViewChild('digit2', { static: false }) digit2!: ElementRef<HTMLInputElement>;
  @ViewChild('digit3', { static: false }) digit3!: ElementRef<HTMLInputElement>;
  @ViewChild('digit4', { static: false }) digit4!: ElementRef<HTMLInputElement>;
  @ViewChild('digit5', { static: false }) digit5!: ElementRef<HTMLInputElement>;
  @ViewChild('digit6', { static: false }) digit6!: ElementRef<HTMLInputElement>;
@Input() username
@Input() nationalid
@Output() getCustomerByIdEvent = new EventEmitter<string>();

  isLoading: boolean = false;
  individualInfo: any;
  displayResponsiveDialog: boolean;
  showerror: boolean;
  showerror2: boolean;
  constructor(private router: Router,  private notificationsService: NotificationsService,private servicesService:MyTaskService,private serviceService: ServiceService,){}
  ngOnInit(): void {
    
    this.getgetcustomer();
    console.log('usernameusername',this.username)
  }

  getgetcustomer(): void {
    this.servicesService.getgetcustomer(this.username)
      .subscribe(
        (data) => {
          this.individualInfo = data;
          this.displayResponsiveDialog=true
          console.log('individualInfo',this.individualInfo); // You can do further processing with the received data
          // if(this.individualInfo.length>0){
          //   this.isLoading = true;
          //   if(environment.lang=='am-et'){

          //      window.location.href = environment.otpredirectam;
          //    }
          //    else{
          //     window.location.href = environment.otpredirecten;
          //    }
          // }
        },
        (error) => {
          console.error('Error occurred:', error);
        }
      );
  }
  customerinsert(otp): void {
    this.serviceService.getUserRole().subscribe((response: any) => {
      console.log("responseresponseresponse", response, response[0].RoleId);
      let updatedby = response[0].UserId;
    this.servicesService.customerinsert(this.username,otp,updatedby)
      .subscribe(
        (data) => {
          this.getgetcustomer()
          const toast = this.notificationsService.success(
            "Sucess",
            "Succesfully edited"
          );
          this.getCustomerByIdEvent.emit(data);
           this.nationalid=false
          this.showerror=false
          this.showerror2=false
          console.log('success insert'); // You can do further processing with the received data
          
        },
        (error) => {
          if (error.status === 200){
            this.getgetcustomer()
            console.log('individualInfo',error); 
            this.showerror=false
            this.showerror2=false
           }
           else
        {
          this.showerror=true
          this.showerror2=false
        }
          console.error('Error occurred:', error);
        }
      );})
  }
  sendotp(): void {
    this.servicesService.sendotp(this.username)
      .subscribe(
        (data) => {
          this.showerror2=false
          this.showerror=false
          console.log('individualInfo',data); // You can do further processing with the received data
          
        },
        (error) => {
         if (error.status === 200){
          console.log('individualInfo',error); 
          this.showerror2=false
          this.showerror=false
         }
         else
      {
        this.showerror2=true
        this.showerror=false
      }
          console.error('Error occurred:', error);
        }
      );
  }
  onInput(event: Event, index: number): void {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (value.length > 0) {
      console.log(`Input value: ${value}, Index: ${index}`);
      switch (index) {
        case 0:
          this.digit2.nativeElement.focus();
          break;
        case 1:
          this.digit3.nativeElement.focus();
          break;
        case 2:
          this.digit4.nativeElement.focus();
          break;
        case 3:
          this.digit5.nativeElement.focus();
          break;
        case 4:
          this.digit6.nativeElement.focus();
          break;
      }
    }

    // Check if the concatenated input value has length 6
    const concatenatedValue = this.getConcatenatedValue();
    if (concatenatedValue.length === 6) {
      // Show loading spinner
      this.isLoading = true;

      // Simulate an asynchronous operation, replace this with your actual search function
      setTimeout(() => {
        // Hide loading spinner
        this.isLoading = false;
        
        // Call a function to trigger the search
        this.triggerSearch(concatenatedValue);
      }, 2000); // Simulating a 2-second delay, replace this with your actual search call
    }
  }

  getConcatenatedValue(): string {
    // Concatenate the values from all input fields
    const digit1Value = (this.digit1.nativeElement as HTMLInputElement).value;
    const digit2Value = (this.digit2.nativeElement as HTMLInputElement).value;
    const digit3Value = (this.digit3.nativeElement as HTMLInputElement).value;
    const digit4Value = (this.digit4.nativeElement as HTMLInputElement).value;
    const digit5Value = (this.digit5.nativeElement as HTMLInputElement).value;
    const digit6Value = (this.digit6.nativeElement as HTMLInputElement).value;

    return digit1Value + digit2Value + digit3Value + digit4Value + digit5Value + digit6Value;
  }

  triggerSearch(inputValue: string): void {
    // Here, you can implement the logic to trigger the search with the input value
    console.log('Triggering search with input value:', inputValue);
    // Redirect to the home page
    this.customerinsert(inputValue)
   
  }
  
  verifyOTP(){}


}
