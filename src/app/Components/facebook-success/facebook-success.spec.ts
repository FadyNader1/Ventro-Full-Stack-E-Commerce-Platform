import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSuccess } from './facebook-success';

describe('FacebookSuccess', () => {
  let component: FacebookSuccess;
  let fixture: ComponentFixture<FacebookSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookSuccess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookSuccess);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
