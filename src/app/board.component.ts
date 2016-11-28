import { Component } from '@angular/core';
import { Direction } from './direction';
import { Cell } from './cell';
import { Row } from './row';
import { Board } from './board';
import { Line } from './line';
import { AfterViewInit } from '@angular/core'; 

@Component({
    selector:'game-board',
    template:`
        <table>
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>a</th>
                    <th>b</th>
                    <th>c</th>
                    <th>d</th>
                    <th>e</th>
                    <th>f</th>
                    <th>g</th>
                    <th>h</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let row of board.rows">
                    <td class="coord">{{row.no + 1}}</td>
                    <td *ngFor="let cell of row.cells"
                    [class.selected]="cell === selectedCell"
                    (click)="onSelect(cell)" id={{cell.row}}{{cell.column}}></td>
                </tr>
            </tbody>
        </table>
        <div>&nbsp;</div>
        <div> current player:&nbsp;
            <i *ngIf="currentPlayer == this.IE" class="fa fa-internet-explorer"></i>
            <i *ngIf="currentPlayer == this.CHROME" class="fa fa-chrome"></i>
                &nbsp;{{currentPlayer}}</div>
        <div> chrome count: {{chromeCount}}</div>
        <div> ie count: {{ieCount}}</div>
        <div *ngIf="winner">And the winner is...&nbsp;&nbsp;{{winner}}</div>
        
    `
    
})

export class BoardComponent implements AfterViewInit{
    
    CHROME: string = 'chrome';
    IE: string = 'ie';
    DRAW: string = "it's a draw";
    ROWS = 8;
    COLUMNS = 8;
    CELLS_ON_BOARD = this.ROWS * this.COLUMNS;
    winner: string;
    UP: Direction = {rowDelta: -1, columnDelta: 0, direction: 'up'};
	LEFT: Direction = {rowDelta: 0, columnDelta: -1, direction: 'left'};
    DOWN: Direction = {rowDelta: +1, columnDelta: 0, direction:  'down'};
	RIGHT: Direction = {rowDelta: 0, columnDelta: +1, direction:  'right'};
    UPLEFT: Direction = {rowDelta: -1, columnDelta: -1, direction:  'upleft'};
    UPRIGHT: Direction = {rowDelta: -1, columnDelta: +1, direction:  'upright'};
    DOWNLEFT: Direction = {rowDelta: +1, columnDelta: -1, direction:  'downleft'};
    DOWNRIGHT: Direction = {rowDelta: +1, columnDelta: +1, direction:  'downright'};
    selectedCell: Cell;
    currentPlayer: string;
    direction: string;
    chromeCount: number = 0;
    ieCount: number = 0;
    moves: Line[];
    
    log(s: string){
        console.log(s); 
    }
    
    board: Board = {rows: this.buildBoard()}
                        
    buildBoard(): Row[] {
        let rowArray = [];
        for (var i=0; i< this.ROWS; i++){
            rowArray.push(this.buildRow(i));
        }
        return rowArray;
    }
    
    buildCells(rowno: number): Cell[] {
        let cellArray = [];
        for (var i = 0; i< this.COLUMNS; i++) { 
            cellArray.push({row:rowno, column:i, type:''});
        }
        return cellArray;
    }

    buildRow(rowno: number): Row {
        let row: Row = {no: rowno, cells: this.buildCells(rowno)};
        return row;
    }
    
    
    onSelect(cell: Cell): void {
        this.selectedCell = cell;
        this.logCellDetails(cell, 'selected cell ');
        if(this.isMoveAvailable(cell)){
            if(this.currentPlayer == this.IE){
                this.addDisk(cell.row, cell.column, this.IE);
                this.flipDisks();
                this.currentPlayer = this.CHROME;
            } else {
                this.addDisk(cell.row, cell.column, this.CHROME);
                this.flipDisks();
                this.currentPlayer = this.IE;
            }    
            this.computeWin();
        }        
    }
    
    computeWin(){
        if(this.chromeCount + this.ieCount == this.CELLS_ON_BOARD){
            if(this.chromeCount > this.ieCount) {
                this.winner = this.CHROME;
            } 
            if(this.chromeCount == this.ieCount){
                this.winner = this.DRAW;
            }    else {
                this.winner = this.IE;
            }
        }
    }
    
    logCellDetails(cell: Cell, comment: string){
        this.log('current player: ' + this.currentPlayer);
        this.log(comment + ' row: ' + cell.row + ' column: ' + cell.column + ' type: ' + cell.type);
    }
    
    /*
      A legal move requires two things: 
        An adjacent cell of the opposite type. Continuing down the line of cells in the same
        direction as this cell, there must be a cell of the same type at some point.  
        An adjacent piece may be left, right, up, down, upLeft, upRight, downLeft or downRight. 
     */
    isMoveAvailable(cell: Cell): boolean {
		return(this.computeMove(cell));
    }
	
    /*
     * From the starting cell, look in all directions. For each direction, store the colours of the counters
     * in that direction. If the sequence begins with a different colour and ends in the same colour set the
     * direction to valid. 
     *
     */
	computeMove(cell: Cell): boolean {
        this.moves = [];
        var movePossible = false;
		if(cell.row > 1) {
            movePossible = this.mapAvailableMove(cell, this.UP);
            if(cell.column > 1){
               if( this.mapAvailableMove(cell, this.UPLEFT)){
                    movePossible = true;
               }
            }
            if(cell.column < (this.COLUMNS -2)){
                if(this.mapAvailableMove(cell, this.UPRIGHT)){
                    movePossible = true;
                }
            }
		}
        if(cell.column > 1){
            if(this.mapAvailableMove(cell, this.LEFT)){
                movePossible = true;
            }
        }
        if(cell.column < (this.COLUMNS -2)){
            if(this.mapAvailableMove(cell, this.RIGHT)){
                movePossible = true;
            }
        }
        if(cell.row < (this.ROWS -2)){
            if( this.mapAvailableMove(cell, this.DOWN)){
                movePossible = true;
            }
            if(cell.column > 1){
               if( this.mapAvailableMove(cell, this.DOWNLEFT)){
                    movePossible = true;
               }
            }
            if(cell.column < (this.COLUMNS -2)){
                if(this.mapAvailableMove(cell, this.DOWNRIGHT)){
                    movePossible = true;
                }
            }
        }
        return movePossible;
	}
    
    /*
     * Check if a move is available in a particular direction from the starting cell. 
     */
    mapAvailableMove(cell: Cell, direction: Direction): boolean {
        var workingCell: Cell = null;
        var moveAvailable = false;
        var directionIsValid = false;
        var adjacentCell = this.getAdjacentCell(cell, direction);
        
        if(adjacentCell != null){
            if(this.oppositeTypeFound(adjacentCell)){
                this.storeCell(adjacentCell, direction);
                workingCell = adjacentCell;
                while   ((adjacentCell != null)
                      && (adjacentCell.type != '')
                      && !directionIsValid){
                    adjacentCell = this.getAdjacentCell(workingCell, direction);
                    if(this.sameTypeFound(adjacentCell)){
                        directionIsValid = true;
                        moveAvailable = true;
                        this.lineFor(direction).isValid = true;
                    } else {
                        this.storeCell(adjacentCell, direction);
                        workingCell = adjacentCell;
                    }
                }
            }
        }
        return moveAvailable;
    }
    
    getAdjacentCell(cell: Cell, direction: Direction): Cell {
        var adjacentCell: Cell = null;
        var adjacentCellRow = cell.row + direction.rowDelta;
        var adjacentCellColumn = cell.column + direction.columnDelta;
        if(adjacentCellRow < this.ROWS && adjacentCellRow >= 0){
            if(adjacentCellColumn < this.COLUMNS && adjacentCellColumn >= 0){
                var adjacentCell = this.getLogicalCell(adjacentCellRow, adjacentCellColumn);
            }    
        }
        return adjacentCell;
    }
    
    oppositeTypeFound(cell: Cell){
        return    ((cell != null) 
                && (cell.type != '')
                && (cell.type != this.currentPlayer));
    }
    
    sameTypeFound(cell: Cell){
        return    ((cell != null) 
                && (cell.type != '')
                && (cell.type == this.currentPlayer));
    }
     
    /*
     * Store details of a cell in a line. If the line doesn't exist create it first. 
     */
    storeCell (cell: Cell, dir: Direction) {
        var line = this.lineFor(dir);
        if(line == null){
            var cellz : Cell[] = [];
            cellz.push(cell);
            var line: Line = {direction: dir, cells: cellz, isValid: false}
            this.moves.push(line);
        } else  {
            line.cells.push(cell);
        }
    }
    
    /*
     * Get the row of cells in a particular direction. 
     */
     lineFor(dir: Direction): Line {
        var line: Line = null;
        if(this.moves != null){
            for (var i=0; i<this.moves.length; i++){
                if(this.moves[i].direction == dir){
                    line = this.moves[i];
                }
            }
        }
        return line;
    }
    
    setUpDisks(): void {
        this.addDisk(3,3,this.CHROME);
        this.addDisk(4,4,this.CHROME);
        this.addDisk(3,4,this.IE);
        this.addDisk(4,3,this.IE);
    }
    
    flipDisks(): void {
        var line: Line;
        var cells: Cell[];
        for (var i=0; i<this.moves.length; i++){
            line = this.moves[i];
            if(line.isValid){
                cells = line.cells;
                for (var j=0; j<cells.length; j++){
                    this.flipCell(cells[j]);
                }
            }
        }
    }
    
    flipCell(cell: Cell){
        var cellId = '' + cell.row + cell.column;
        var tableCell = document.getElementById(cellId);
        tableCell.removeChild(tableCell.firstChild);
        this.addDisk(cell.row, cell.column, this.currentPlayer);
        if(this.currentPlayer == this.CHROME){
            this.ieCount --;
        } else {
            this.chromeCount --;
        }
    }
    
    addDisk(row: number, column:number, type: string){
        var cellId = '' + row + column;
        var tableCell = document.getElementById(cellId);
        if(!tableCell.firstChild){
            var disk = document.createElement('i');
            if(type == this.IE){
                disk.setAttribute('class','fa fa-internet-explorer fa-2x');
                this.ieCount ++;
            } else {
                disk.setAttribute('class','fa fa-chrome fa-2x');
                this.chromeCount ++;
            }
            tableCell.appendChild(disk);
            var cell = this.getLogicalCell(row, column);
            cell.type = type;
            this.logCellDetails(cell, 'disk added to' );
        }
    }
    
    getLogicalCell(row: number, column:number): Cell{
        return this.board.rows[row].cells[column];
    }
    
    ngAfterViewInit(){
        this.currentPlayer = this.CHROME;
        this.setUpDisks();
    }
}