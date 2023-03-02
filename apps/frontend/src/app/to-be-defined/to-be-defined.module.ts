import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToBeDefinedComponent } from './to-be-defined.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ToBeDefinedComponent],
  imports: [TranslateModule, CommonModule],
})
export class ToBeDefinedModule {}
