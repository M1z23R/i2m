import { DecimalPipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  max$ = input.required<number>();
  value$ = input.required<number>();
  horizontal$ = input<boolean>(false);
  unit$ = input.required<string>();
  dynamicColor$ = input<boolean>(false);

  color$ = computed(() => {
    const green = [52, 168, 83];
    const yellow = [251, 188, 5];
    const red = [234, 67, 53];
    const perc = this.value$() / this.max$();

    if (perc <= 50) {
      const [r, g, b] = this.interpolateColor(green, yellow, perc);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      const [r, g, b] = this.interpolateColor(yellow, red, perc);
      return `rgb(${r}, ${g}, ${b})`;
    }
  });

  interpolateColor(colorA: number[], colorB: number[], percentage: number) {
    // Ensure percentage is between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));

    // Convert percentage to a decimal
    const factor = percentage;

    // Interpolate each color channel
    const r = Math.round(colorA[0] + (colorB[0] - colorA[0]) * factor);
    const g = Math.round(colorA[1] + (colorB[1] - colorA[1]) * factor);
    const b = Math.round(colorA[2] + (colorB[2] - colorA[2]) * factor);

    return [r, g, b];
  }
}
