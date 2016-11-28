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
    
        <div>&nbsp;</div>
              
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
        <div> chrome count: {{chromeCount}}</div>
        <div> ie count: {{ieCount}}</div>
    `
    
})

export class BoardComponent implements AfterViewInit{
    
    CHROME: string = 'chrome';
    IE: string = 'ie';
    UP: Direction = {rowDelta: -1, columnDelta: 0, direction: 'up'};
	LEFT: string = 'left';
    DOWN: string = 'down';
	RIGHT: string = 'right';
    UPLEFT: string = 'upleft';
    UPRIGHT: string = 'upright';
    DOWNLEFT: string = 'downleft';
    DOWNRIGHT: string = 'downright';
    selectedCell: Cell;
    //adjacentCell: Cell;
    currentPlayer: string;
    direction: string;
    chromeCount: number = 0;
    ieCount: number = 0;
    //moves: Line[] = [];
    moves: Line[];
    
    
    log(s: string){
        console.log(s); 
    }
    
    board: Board = {rows: this.buildBoard()}
                        
    buildBoard(): Row[] {
        let rowArray = [];
        for (var i=0; i<8; i++){
            rowArray.push(this.buildRow(i));
        }
        return rowArray;
    }
    
    buildCells(rowno: number): Cell[] {
        let cellArray = [];
        for (var i = 0; i< 8; i++) { 
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
        if(this.isMoveLegal(cell)){
            if(this.currentPlayer == this.IE){
                this.addDisk(cell.row, cell.column, this.IE);
                this.currentPlayer = this.CHROME;
            } else {
                this.addDisk(cell.row, cell.column, this.CHROME);
                this.currentPlayer = this.IE;
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
    isMoveLegal(cell: Cell): boolean {
		return(this.computeMove(cell));
        // return(this.isFirstPieceLegal(cell));
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
			movePossible = this.checkUp(cell);
            /*
			if(cell.column > 1){
				checkUpLeft(cell);
			}
			if(cell.column < 6){
				checkUpRight(cell);
			}
            */
		}
        return movePossible;
	}
    
    checkUp(cell: Cell): boolean {
        return(this.mapAvailableMove(cell, this.UP));
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
                while((adjacentCell != null) && (adjacentCell.type != '') && !directionIsValid){
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
        if(adjacentCellRow < 8 && adjacentCellRow >= 0){
            if(adjacentCellColumn < 8 && adjacentCellRow >= 0){
                var adjacentCell = this.getLogicalCell(adjacentCellRow, adjacentCellColumn);
            }    
        }
        return adjacentCell;
    }
    
    
    oppositeTypeFound(cell: Cell){
        var cellType = cell.type;
        return ((cell.type != '') && (cell.type != this.currentPlayer));
    }
    
    sameTypeFound(cell: Cell){
        return ((cell.type != '') && (cell.type == this.currentPlayer));
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
    
     /*
    isFirstPieceLegal(cell: Cell): boolean {
        var legal = false;
                
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.LEFT)){
            legal = true;
            this.direction = this.LEFT;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.RIGHT)){
            legal = true;
            this.direction = this.RIGHT;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.UP)){
            legal = true;
            this.direction = this.UP;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.DOWN)){
            legal = true;
            this.direction = this.DOWN;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.UPLEFT)){
            legal = true;
            this.direction = this.UPLEFT;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.UPRIGHT)){
            legal = true;
            this.direction = this.UPRIGHT;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.DOWNLEFT)){
            legal = true;
            this.direction = this.DOWNLEFT;
        }
        if(this.nextCellOppositeTypeToCurrentPlayer(cell, this.DOWNRIGHT)){
            legal = true;
            this.direction = this.DOWNRIGHT;
        }
        return legal;
    }
    */
    
    /*
    nextCellSameTypeAsCurrentPlayer(cell: Cell, direction: string): boolean{
        var nextCell = this.getAdjacentCell(cell, direction);
        this.logCellDetails(nextCell, ' ' + direction);
        if((nextCell.type != '') && (nextCell.type == this.currentPlayer)) {
            return true;
        }
        return false;
    }
    
    nextCellOppositeTypeToCurrentPlayer(cell: Cell, direction: string): boolean{
        var nextCell = this.getAdjacentCell(cell, direction);
        this.logCellDetails(nextCell, ' ' + direction);
        if((nextCell.type != '') && (nextCell.type != this.currentPlayer)) {
            return true;
        }
        return false;
    }
    */
    /*
    getAdjacentCell(cell: Cell, direction: string): Cell {
        if(direction == this.LEFT){
            return this.getLogicalCell(cell.row, cell.column -1);
        }
        if(direction == this.RIGHT){
            return this.getLogicalCell(cell.row, cell.column +1);
        }
        if(direction == this.UP){
            return this.getLogicalCell(cell.row -1, cell.column);
        }
        if(direction == this.DOWN){
            return this.getLogicalCell(cell.row +1, cell.column);
        }
        if(direction == this.UPLEFT){
            return this.getLogicalCell(cell.row -1, cell.column -1);
        }
        if(direction == this.UPRIGHT){
            return this.getLogicalCell(cell.row -1, cell.column +1);
        }
        if(direction == this.DOWNLEFT){
            return this.getLogicalCell(cell.row +1, cell.column -1);
        }
        if(direction == this.DOWNRIGHT){
            return this.getLogicalCell(cell.row +1, cell.column +1);
        }
    }
    */
    /*
    cellIsOffBoard(cell: Cell): boolean{
        return (cell.row < 0 || cell.row >7 || cell.column < 0 || cell.column > 7);
    }
    */
    
    setUpDisks(): void {
        this.addDisk(3,3,this.CHROME);
        this.addDisk(4,4,this.CHROME);
        this.addDisk(3,4,this.IE);
        this.addDisk(4,3,this.IE);
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