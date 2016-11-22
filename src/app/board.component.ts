import { Component } from '@angular/core';
import { Cell } from './cell';
import { Row } from './row';
import { Board } from './board';
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
    LEFT: string = 'left';
    RIGHT: string = 'right';
    UP: string = 'up';
    DOWN: string = 'down';
    UPLEFT: string = 'upleft';
    UPRIGHT: string = 'upright';
    DOWNLEFT: string = 'downleft';
    DOWNRIGHT: string = 'downright';
    selectedCell: Cell;
    adjacentCell: Cell;
    currentPlayer: string;
    direction: string;
    chromeCount: number = 0;
    ieCount: number = 0;
    
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
        return(this.isFirstPieceLegal(cell));
    }
     
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
    
    cellIsOffBoard(cell: Cell): boolean{
        return (cell.row < 0 || cell.row >7 || cell.column < 0 || cell.column > 7);
    }
    
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