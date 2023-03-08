import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stat } from '@division-loader/apis';

@Component({
  selector: 'division-loader-stat-item',
  templateUrl: './stat-item.component.html',
  styleUrls: ['./stat-item.component.scss'],
})
export class StatItemComponent {
  @Input() stat!: Stat | undefined;

  @Input() isHighlighted = false;
  @Output() highlightedStatSelected = new EventEmitter<string>();

  highlight() {
    this.highlightedStatSelected.emit(this.stat?.displayName);
  }
}
