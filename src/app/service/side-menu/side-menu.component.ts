import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  @Output() changeForm = new EventEmitter();

  items: MenuItem[];
  formcode = '';
  formDescription = {
    Plot: '1',
    Property: '2'
  };

  currentForm = '1';

  constructor(
    httpClient: HttpClient, private route: ActivatedRoute, private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.formcode = params['formcode'];
    });
  }

  navigateByUrl(formcode) {
    this.router.navigateByUrl(this.router.url.replace(this.formcode, formcode));
  }

  gotoForm(form) {
    this.currentForm = this.formDescription[form];
    this.changeForm.emit(this.currentForm);
  }


}
