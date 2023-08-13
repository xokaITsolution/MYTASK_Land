import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Survey from 'survey-angular';
import { LayoutService } from './layout.service';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-servy',
  templateUrl: `layout.component.html`,
  styleUrls: ['styles.css']
})
export class SurveyComponent implements OnInit {
  @Output() completed = new EventEmitter();
  @Input() formData;
  @Input() formcode;
  @Input() Mode;
  @Input() taskLevel;
  surveyModel: any;
  json;
  data: any;
  ID = 'surveyElement'

  constructor(private activatedRoute: ActivatedRoute, private service: LayoutService) {
  }


  ngOnInit() {

    this.activatedRoute.params.subscribe((params: Params) => {
      // this.formcode = params['formcode'];
      console.log(this.service.getFormData(this.formcode, this.taskLevel));
      this.service.getFormData(this.formcode, this.taskLevel).subscribe(data => {
        this.viewform(data);
      }, error => console.log(error));
      // console.log(this.data);
      // this.surveyModel = new Survey.Model(this.data);
      // Survey.SurveyNG.render('surveyElement', {model: this.surveyModel});
    });
  }


  viewform(data: any): any {
    console.log(data);
    this.surveyModel = new Survey.Model(data);
    try {
      this.surveyModel.data = JSON.parse(this.formData);
    }
    catch (e) {
      console.error('unable to parse json data');
    }
    if (this.Mode) {
      this.surveyModel.mode = this.Mode;//'display';
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
    } else {
      Survey.SurveyNG.render(this.ID, { model: this.surveyModel });
      this.surveyModel.onComplete.add(result => {
        console.log('result', result);

        this.completed.emit(result.data);
      });

    }

  }

}
