import { Component, OnInit } from '@angular/core';
import { LoadingBarService } from './loading-bar.service';
import { environment } from 'src/environments/environment';


@Component({
 selector: 'app-loading-bar',
 templateUrl: './loading-bar.component.html',
 styleUrls: ['./loading-bar.component.css'],
})
export class LoadingBarComponent implements OnInit {
 loading: boolean = false;
 imgclock = environment.imagepathclock;

 constructor(private loadingBarService: LoadingBarService) {}

 ngOnInit() {
 this.loadingBarService.getLoadingBarStatus().subscribe((status) => {
 this.loading = status;
 });
 }
}