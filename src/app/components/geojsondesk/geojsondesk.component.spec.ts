import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeojsondeskComponent } from './geojsondesk.component';

describe('GeojsondeskComponent', () => {
  let component: GeojsondeskComponent;
  let fixture: ComponentFixture<GeojsondeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeojsondeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeojsondeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
