import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedItems } from './featured-items';

describe('FeaturedItems', () => {
  let component: FeaturedItems;
  let fixture: ComponentFixture<FeaturedItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
