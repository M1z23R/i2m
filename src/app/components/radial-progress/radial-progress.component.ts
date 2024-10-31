import { DecimalPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RoundProgressComponent } from 'angular-svg-round-progressbar';

@Component({
  selector: 'app-radial-progress',
  standalone: true,
  imports: [RoundProgressComponent, DecimalPipe],
  templateUrl: './radial-progress.component.html',
  styleUrl: './radial-progress.component.css',
})
export class RadialProgressComponent {
  half$ = input<boolean>(false);
  max$ = input.required<number>();
  value$ = input.required<number>();
  unit$ = input.required<string>();
}
