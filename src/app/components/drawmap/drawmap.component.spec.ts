import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawmapComponent } from './drawmap.component';

describe('DrawmapComponent', () => {
  let component: DrawmapComponent;
  let fixture: ComponentFixture<DrawmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
