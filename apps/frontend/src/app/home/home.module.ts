import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { MatCardModule } from '@angular/material/card';
import { StatItemComponent } from './stat-item/stat-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [HomeComponent, HomeUserComponent, StatItemComponent],
  imports: [CommonModule, MatIconModule, MatCardModule, DragDropModule, TranslateModule],
})
export class HomeModule {}
