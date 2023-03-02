import { Component, Input } from '@angular/core';
import { Stat } from '@division-loader/apis';

@Component({
  selector: 'division-loader-stat-item',
  templateUrl: './stat-item.component.html',
  styleUrls: ['./stat-item.component.scss'],
})
export class StatItemComponent {
  @Input() stat!: Stat;
}
