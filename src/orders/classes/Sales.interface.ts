interface SalesI{
    totalSales:number
    month:number
}
export class Sales implements SalesI{
     totalSales: number=0
     month: number
     constructor(totalSales:number,month:number){
        this.totalSales=totalSales
        this.month=month
     }

}
