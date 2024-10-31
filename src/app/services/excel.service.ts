import { Injectable } from '@angular/core';
import * as xlsx from 'xlsx';

const headers = [
  'Timestamp',
  'EGMF',
  'Engine Percent Torque/Load',
  'Engine Speed/RPM',
  'air_filter_delta',
  'air_load_percent',
  'air_rul_hours',
  'cellular_signal',
  'engine_torque',
  'fuel_flow_rate ',
];

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  getData = async (file: File) => {
    const workbook = xlsx.read(await file.arrayBuffer(), { cellDates: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    const range = this.getWorksheetRange(worksheet);

    const toReturn: string[][] = [];

    const timestamps: { timestamp: string; value: string }[] = [];
    const egmf: { timestamp: string; value: string }[] = [];
    const enginePercentTorque: { timestamp: string; value: string }[] = [];
    const engineSpeedRPM: { timestamp: string; value: string }[] = [];
    const airFilterDelta: { timestamp: string; value: string }[] = [];
    const airLoadPercent: { timestamp: string; value: string }[] = [];
    const airRuleHours: { timestamp: string; value: string }[] = [];
    const cellularSignal: { timestamp: string; value: string }[] = [];
    const engineTorque: { timestamp: string; value: string }[] = [];
    const fuelFlowRate: { timestamp: string; value: string }[] = [];

    for (let header = 1; header <= headers.length; header++) {
      toReturn.push([]);

      for (let i = 2; i <= range.rows; i++) {
        const cell = this.getSafeValueFromCell(
          [this.columnToLetter(header), i],
          worksheet
        );
        toReturn[header - 1].push(cell);
      }
    }

    console.log(toReturn[0].filter((x) => x).length);
    console.log(toReturn[1].filter((x) => x).length);
    console.log(toReturn[2].filter((x) => x).length);
    console.log(toReturn[3].filter((x) => x).length);
    console.log(toReturn[4].filter((x) => x).length);
    console.log(toReturn[5].filter((x) => x).length);
    console.log(toReturn[6].filter((x) => x).length);
    console.log(toReturn[7].filter((x) => x).length);
    console.log(toReturn[8].filter((x) => x).length);
    console.log(toReturn[9].filter((x) => x).length);
    return {
      timestamps: toReturn[0],
      egmf: toReturn[1],
      enginePercentTorque: toReturn[2],
      engineSpeedRPM: toReturn[3],
      airFilterDelta: toReturn[4],
      airLoadPercent: toReturn[5],
      airRuleHours: toReturn[6],
      cellularSignal: toReturn[7],
      engineTorque: toReturn[8],
      fuelFlowRate: toReturn[9],
    };
  };
  getAvailableHeaders = async (file: File): Promise<string[]> => {
    const arrBuffer = await file.arrayBuffer();
    const workbook = xlsx.read(arrBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const range = this.getWorksheetRange(worksheet);
    if (!range.rows) {
      return [];
    }
    const headers: string[] = [];
    for (let i = 1; i <= range.cols; i++) {
      const value = this.getSafeValueFromCell(
        [this.columnToLetter(i), 1],
        worksheet
      );
      headers.push(value);
    }
    return headers;
  };

  getWorksheetRange = (worksheet: xlsx.WorkSheet): worksheetRange => {
    if (worksheet['!ref']) {
      const parts = xlsx.utils.decode_range(worksheet['!ref']);
      const numCols = parts.e.c - parts.s.c + 1;
      const numRows = parts.e.r - parts.s.r + 1;
      return { rows: numRows, cols: numCols };
    }
    return { rows: 0, cols: 0 };
  };

  columnToLetter = (column: number): string => {
    let temp,
      letter = '';
    while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
    }
    return letter;
  };

  getSortedWorksheetHeaders = (
    headers: string[],
    worksheet: xlsx.WorkSheet
  ): string[] => {
    const indices: string[] = [];
    const range = this.getWorksheetRange(worksheet);

    for (let j = 1; j <= range.cols; j++) {
      const header = this.getSafeValueFromCell(
        [this.columnToLetter(j), 1],
        worksheet
      );
      if (headers.includes(header)) {
        indices[headers.indexOf(header)] = this.columnToLetter(j);
        console.log(this.columnToLetter(j));
      }
    }

    if (indices.filter((x) => x).length !== headers.length) {
      console.log(indices);
      console.log(headers);
      throw new Error("Some headers aren't found!");
    }

    return indices;
  };

  getSafeValueFromCell = (
    cell: [string, number],
    worksheet: xlsx.WorkSheet
  ): string => {
    return worksheet[`${cell[0]}${cell[1]}`]?.v
      ? worksheet[`${cell[0]}${cell[1]}`].v.toString()
      : '';
  };
}

export interface IPersonFromFile {
  firstName: string;
  lastName: string;
  website: string;
}

export interface worksheetRange {
  rows: number;
  cols: number;
}
