import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output } from '@angular/core';
import { environment } from "../../environments/environment";
declare var $:any;
@Directive({
  selector: '[appDatepickerEthiopian]',
  exportAs:'datepicker'
})
export class DatepickerEthiopianDirective {
 datetime: any;

selecteddate:any
 @Output() dateEmitter = new EventEmitter();
  constructor(private el:ElementRef ,private ngZone:NgZone) {
   
   }

  @HostListener('change')
 
  ngAfterViewInit(): void {

      // $( this.el.nativeElement).datepicker();
    //   $(this.el.nativeElement).datetimepicker({
    //     locale: {
    //            calender: 'ethiopian',
    //            lang: 'am'
    //       }
        
    
    // });

    this.ngZone.runOutsideAngular(()=>{

      $(this.el.nativeElement).calendarsPicker({
        calendar: $.calendars.instance('Ethiopian'),
        showOnFocus: false, 
        onSelect: (dates: any)=>{
          this.ngZone.run(()=>{
            this.setdate(dates)
          })
        } ,
        showTrigger:  environment.imagepath});
    })

  }
  setdate(dates: any) {
    this.selecteddate=dates
    this.dateEmitter.emit(this.selecteddate)
  }
  


}