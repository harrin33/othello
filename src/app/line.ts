import { Direction } from './direction';
import { Cell } from './cell';

export class Line {
  direction: Direction;
  isValid: boolean;
  cells: Cell [];
}
