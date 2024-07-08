import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-withdraw-propose',
  templateUrl: './withdraw-propose.component.html',
  styleUrls: ['./withdraw-propose.component.css']
})
export class WithdrawProposeComponent implements OnInit {

  constructor() { }
// @Input AppNo 
contractList:any;
  ngOnInit() {
  }

}
