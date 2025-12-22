import { Component } from '@angular/core';
import { SpinnerService } from '../../Services/spinner-service';
 import { NgIf } from '@angular/common';
@Component({
  selector: 'app-spinner-component',
  imports: [NgIf],
templateUrl: './spinner-component.html',
  styleUrl: './spinner-component.css',
})
export class SpinnerComponent {
loading = false;

  constructor(private spinner: SpinnerService) {
    this.spinner.loading$.subscribe(x => this.loading = x);
  }
}
