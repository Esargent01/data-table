import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { By } from '@angular/platform-browser';

declare var datastore:any;

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTableComponent ],
      imports: [FormsModule, ReactiveFormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DataTableComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display a table of values from the data source', () => {
    const dataTableFormGroup = component.tableForm;    
    expect(dataTableFormGroup.controls.data.value.length).toEqual(5);
  });

  it('should select all form elements when selectAll is checked', fakeAsync(()=> {
    const checkbox = fixture.debugElement.query(By.css('#selectAll'));
    spyOn(component, 'onSelectAll').and.callThrough(); 
    checkbox.triggerEventHandler('change', { target: { checked: true }});
    tick();
    fixture.detectChanges();
    expect(component.onSelectAll).toHaveBeenCalled();
    expect(component.selectedCount).toEqual(5);
   }));

   it('should de-select all form elements when selectAll is checked', fakeAsync(()=> {
    const checkbox = fixture.debugElement.query(By.css('#selectAll'));
    spyOn(component, 'onSelectAll').and.callThrough(); 
    checkbox.triggerEventHandler('change', { target: { checked: false }});
    tick();
    fixture.detectChanges();
    expect(component.onSelectAll).toHaveBeenCalled();
    expect(component.selectedCount).toEqual(0);
   }));

   it('should display that there is no data available for download in an alert message, when nothing is selected', fakeAsync(()=> {
    const download = fixture.debugElement.query(By.css('.download'));
    spyOn(component, 'downloadData').and.callThrough();
    spyOn(window, 'alert');
    download.triggerEventHandler('click', null );
    tick();
    fixture.detectChanges();
    expect(component.downloadData).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(JSON.stringify('There is no available data to download.'));
   }));

   it('should display all data available for download, with the "AVAILABLE" status in an alert message', fakeAsync(()=> {
    const checkbox = fixture.debugElement.query(By.css('#selectAll'));
    const download = fixture.debugElement.query(By.css('.download'));
    spyOn(component, 'downloadData').and.callThrough();
    spyOn(component, 'onSelectAll').and.callThrough(); 
    spyOn(window, 'alert');
    checkbox.triggerEventHandler('change', { target: { checked: true }});
    download.triggerEventHandler('click', null );
    tick();
    fixture.detectChanges();
    expect(component.downloadData).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(JSON.stringify([datastore[1], datastore[2]]));
   }));

   it('should display that there is no data available for download in an alert message, when data without the "AVAILABLE" status is selected', fakeAsync(()=> {
    const checkbox = fixture.debugElement.query(By.css('#selectData'));
    const download = fixture.debugElement.query(By.css('.download'));
    spyOn(component, 'onSelectionChange').and.callThrough();
    spyOn(component, 'downloadData').and.callThrough(); 
    spyOn(window, 'alert');
    checkbox.triggerEventHandler('change', { target: { checked: true }});
    download.triggerEventHandler('click', null );
    tick();
    fixture.detectChanges();
    expect(component.onSelectionChange).toHaveBeenCalled();
    expect(component.downloadData).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(JSON.stringify('There is no available data to download.'));
   }));
});
