import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RoundProgressComponent } from 'angular-svg-round-progressbar';
import { RadialProgressComponent } from './components/radial-progress/radial-progress.component';
import { ExcelService } from './services/excel.service';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { interval } from 'rxjs';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatSlider, MatSliderModule } from '@angular/material/slider';
import {
  MatProgressBar,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { GlowButtonComponent } from './components/glow-button/glow-button.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RoundProgressComponent,
    RadialProgressComponent,
    NgxSliderModule,
    MatButton,
    MatButtonModule,
    MatSlider,
    MatSliderModule,
    MatProgressBar,
    MatProgressBarModule,
    ProgressBarComponent,
    GoogleChartsModule,
    GlowButtonComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  chartType = ChartType.AnnotationChart;
  constructor(private excelService: ExcelService) {
    interval(10).subscribe(() => {
      if (this.isPlaying$()) {
        if (this.currentTimestampIndex$() < this.timestamps$().length - 1) {
          this.currentTimestampIndex$.update((c) => c + 1);
        } else {
          this.isPlaying$.set(false);
        }
      }
      console.log(this.currentTimestampIndex$());
    });
  }
  isPlaying$ = signal<boolean>(false);

  timestamps$ = signal<string[]>([]);
  egmf$ = signal<string[]>([]);
  engineSpeedRPM$ = signal<string[]>([]);
  airFilterDelta$ = signal<string[]>([]);
  cellularSignal$ = signal<string[]>([]);
  engineTorque$ = signal<string[]>([]);
  fuelFlowRate$ = signal<string[]>([]);
  airLoadPercent$ = signal<string[]>([]);
  airRuleHours$ = signal<string[]>([]);
  airRuleHoursRows$ = computed(() =>
    this.airRuleHours$().map((x, i) => [
      new Date(this.timestamps$()[i]),
      this.getNumber(x),
    ])
  );
  enginePercentTorque$ = signal<string[]>([]);

  async onFileChange(e: any) {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const {
      timestamps,
      egmf,
      engineSpeedRPM,
      airFilterDelta,
      cellularSignal,
      engineTorque,
      fuelFlowRate,
      airLoadPercent,
      airRuleHours,
      enginePercentTorque,
    } = await this.excelService.getData(file);
    console.log({
      timestamps,
      egmf,
      engineSpeedRPM,
      airFilterDelta,
      cellularSignal,
      engineTorque,
      fuelFlowRate,
      airLoadPercent,
      airRuleHours,
      enginePercentTorque,
    });
    this.timestamps$.set(timestamps);
    this.egmf$.set(egmf);
    this.engineSpeedRPM$.set(engineSpeedRPM);
    this.airFilterDelta$.set(airFilterDelta);
    this.cellularSignal$.set(cellularSignal);
    this.engineTorque$.set(engineTorque);
    this.fuelFlowRate$.set(fuelFlowRate);
    this.airLoadPercent$.set(airLoadPercent);
    this.airRuleHours$.set(airRuleHours);
    this.enginePercentTorque$.set(enginePercentTorque);
  }

  getNumber = (v: string) => {
    const n = Number(v);
    return isNaN(n) ? 0 : Math.abs(n);
  };

  enginePercentTorqueMax$ = computed(() => 125);

  egmfMax$ = computed(() => 2500);
  engineSpeedRPMMax$ = computed(() => 2000);
  airFilterDeltaMax$ = computed(() => 100);
  cellularSignalMax$ = computed(() => 100);
  engineTorqueMax$ = computed(() =>
    Math.max(...this.engineTorque$().map((x) => this.getNumber(x)))
  );
  fuelFlowRateMax$ = computed(() => 200);
  airRuleHoursMax$ = computed(() =>
    Math.max(...this.airRuleHours$().map((x) => this.getNumber(x)))
  );
  airLoadPercentMax$ = computed(() => 100);

  currentTimestampIndex$ = signal<number>(0);

  currentTimestamp$ = computed(() =>
    this.prettyDate(this.timestamps$()[this.currentTimestampIndex$()])
  );
  currentEngineTorque$ = computed(() =>
    this.getNumber(this.engineTorque$()[this.currentTimestampIndex$()])
  );

  currentEgmf$ = computed(() =>
    this.getNumber(this.egmf$()[this.currentTimestampIndex$()])
  );

  currentEngineSpeedRPM$ = computed(() =>
    this.getNumber(this.engineSpeedRPM$()[this.currentTimestampIndex$()])
  );

  currentAirFilterDelta$ = computed(() =>
    this.getNumber(this.airFilterDelta$()[this.currentTimestampIndex$()])
  );

  currentCellularSignal$ = computed(() =>
    this.getNumber(this.cellularSignal$()[this.currentTimestampIndex$()])
  );

  currentFuelFlowRate$ = computed(() =>
    this.getNumber(this.fuelFlowRate$()[this.currentTimestampIndex$()])
  );
  currentAirLoadPercent$ = computed(() =>
    this.getNumber(this.airLoadPercent$()[this.currentTimestampIndex$()])
  );
  currentAirRuleHours$ = computed(() =>
    this.getNumber(this.airRuleHours$()[this.currentTimestampIndex$()])
  );

  currentEnginePercentTorque$ = computed(() =>
    this.getNumber(this.enginePercentTorque$()[this.currentTimestampIndex$()])
  );

  startTimestamp$ = computed(() => this.prettyDate(this.timestamps$()[0]));
  endTimestamp$ = computed(() =>
    this.prettyDate(this.timestamps$()[this.timestamps$().length - 1])
  );

  prettyDate(date?: string) {
    return date
      ? `${new Date(date).toLocaleDateString()} ${new Date(
          date
        ).toLocaleTimeString()}`
      : '';
  }

  onTrackChange(e: any) {
    this.currentTimestampIndex$.set(+e.target.value);
    console.log(e);
  }

  claasActive$ = computed(() => {
    const re = (0.008 * this.currentAirFilterDelta$() + 0.1) * 5;

    return {
      green: re <= 2.1,
      yellow: re < 2.7 && re > 2.1,
      red: re < 2.7 && re > 2.7,
    };
  });
}
