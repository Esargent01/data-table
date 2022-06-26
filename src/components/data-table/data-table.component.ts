import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

declare var datastore:any;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy {

  mockData = datastore;
  tableHeaders: string[];
  downloadableData = [];
  selectedCount: number;
  tableForm: FormGroup;
  formArray: FormArray;
  formListener: Subscription;
  partialSelection: boolean;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getTableHeaders();
    this.initializeForm();
  }

  public onSelectionChange(event, index): void {
    if (event.target.checked) {
      this.formArray.get([index]).setValue(true);
      this.multipleSelectionCheck(this.formArray.value);
    } else {
      this.formArray.get([index]).setValue(false);
      this.multipleSelectionCheck(this.formArray.value);
    }
  }

  public onSelectAll(event): void {
    if (event.target.checked) {
      this.formArray.controls.map((control)=> control.setValue(true));
    } else {
      this.formArray.controls.map((control)=> control.setValue(false));
    }
  }

  public downloadData(): void {
    let downloadMessage = this.downloadableData.length ? this.downloadableData : 'There is no available data to download.';
    alert(JSON.stringify(downloadMessage));
  }

  private initializeForm(): void {
    this.tableForm = this.fb.group({
      selectAll: (false),
      data: new FormArray([]),
    });
    this.formArray = this.tableForm.get('data') as FormArray;
    this.mockData.forEach(()=> this.formArray.push(new FormControl()));
    this.formListener = this.formArray.valueChanges.subscribe(values => {
      this.partialSelection = this.isPartialSelection(values);
      this.downloadableData = this.getDownloadableData(values);
      this.selectedCount = values.filter((value)=> value).length;
    });
  }

  private getTableHeaders(): void {
    this.mockData.forEach((item)=> this.tableHeaders = Object.keys(item));
  }

  private getDownloadableData(values): string[] {
    return values.map((val, i)=> {
      if(val === true) {
        return this.mockData[i];
      }
    }).filter((data)=> {return data ? data.status === 'available' : ''});
  }

  private isPartialSelection(values): boolean {
    return values.some((val)=> values[0] !== val);
  }

  private multipleSelectionCheck(values): void {
    if(values.every(value => value)) this.tableForm.get('selectAll').setValue(true);
    if(values.every(value => !value || null)) this.tableForm.get('selectAll').setValue(false);
  }

  ngOnDestroy(): void {
    this.formListener.unsubscribe();
  }
}
