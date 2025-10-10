import { Injectable } from '@nestjs/common';
import { DashboardRepository } from 'src/repositories/Dashboard.repository';
import { UsersRepository } from 'src/repositories/Users.repository';
import { IdEncoderService } from 'src/utility/id-encoder.service';
import moment from 'moment';
@Injectable()
export class DashboardService {
    constructor(
        private readonly dashboardRepo: DashboardRepository,
        private readonly usersRepository: UsersRepository
    ) { }
    private async getPermissions(userId: number) {
        let permissions: number[] = [];
        if(userId){
            const result = await this.usersRepository.findRolePermissions(userId);
            permissions = result.map(item => item.shopId);
        }
        return permissions;
    }
    async getTotalSale(userId: number) {
        const permissions = await this.getPermissions(userId);
        const transactions = await this.dashboardRepo.findAllTotalSale(permissions);
        return transactions;
        // return this.reportRepo.getTotalSale(userId);
    }

    async getTotalMachine(userId: number) {
        const permissions = await this.getPermissions(userId);
        const machines = await this.dashboardRepo.findAllTotalMachine(permissions);
        return machines;
    }

    async getGraphData(branchId: string) {
        const branchIdDecoded = IdEncoderService.decode(branchId);
        const branchTotalSale = await this.dashboardRepo.findByBranchTotalSale(branchIdDecoded);
        const branchTotalMachine = await this.dashboardRepo.findByBranchTotalMachine(branchIdDecoded);
        const graphDataByDay = await this.dashboardRepo.findAllGraphDataByDay(branchIdDecoded);
        const convertedDataByDay = this.convertDataForChartByDay(graphDataByDay);
        const graphDataByWeek = await this.dashboardRepo.findAllGraphDataByWeek(branchIdDecoded);
        const convertedDataByWeek = this.convertDataForChartByWeek(graphDataByWeek);
        const graphDataByMonth = await this.dashboardRepo.findAllGraphDataByMonth(branchIdDecoded);
        const convertedDataByMonth = this.convertDataForChartByMonth(graphDataByMonth);
        const graphDataByYear = await this.dashboardRepo.findAllGraphDataByYear(branchIdDecoded);
        const convertedDataByYear = this.convertDataForChartByYear(graphDataByYear);
        return {
            branchTotalSale: branchTotalSale,
            branchTotalMachine: branchTotalMachine,
            graphDataByDay: convertedDataByDay,
            graphDataByWeek: convertedDataByWeek,
            graphDataByMonth: convertedDataByMonth,
            graphDataByYear: convertedDataByYear,
        };
    }

    private convertDataForChartByDay(data: {price: string, createdAt: Date}[]) {
        // Create time labels for 24 hours (00:00 - 23:00)
        const timeLabels = Array.from({ length: 24 }, (_, i) => {
            return String(i).padStart(2, '0') + ':00';
        });

        // Initialize data arrays for Yesterday and Today
        const yesterdayData = new Array(24).fill(0);
        const todayData = new Array(24).fill(0);

        // Get current date and yesterday date using UTC
        const today = moment.utc().format('YYYY-MM-DD');
        const yesterday = moment.utc().subtract(1, 'day').format('YYYY-MM-DD');

        data.forEach((transaction, index) => {
            const transactionDate = moment(transaction.createdAt).format('YYYY-MM-DD');
            const hour = moment(transaction.createdAt).hour();
            const price = parseFloat(transaction.price) || 0;
            if (transactionDate === yesterday) {
                yesterdayData[hour] += price;
            } else if (transactionDate === today) {
                todayData[hour] += price;
            }
        });

        return {
            labels: timeLabels,
            datasets: [
                {
                    label: 'Yesterday',
                    backgroundColor:'#7F7F7F',
                    data: yesterdayData,
                },
                {
                    label: 'Today',
                    backgroundColor:'#3CB29F',
                    data: todayData,
                }
            ]
        };
    }

    private convertDataForChartByWeek(data: {price: string, createdAt: Date}[]) {
        // Create day labels for 7 days of the week
        const dayLabels: string[] = [];
        const lastWeekData = new Array(7).fill(0);
        const thisWeekData = new Array(7).fill(0);
        
        // Generate labels for the past 7 days
        for (let i = 6; i >= 0; i--) {
            const day = moment.utc().subtract(i, 'day');
            dayLabels.push(day.format('ddd')); // e.g., "Mon, Jan 15"
        }

        // Get the start and end of last week (7-14 days ago)
        const lastWeekStart = moment.utc().subtract(13, 'day').startOf('day');
        const lastWeekEnd = moment.utc().subtract(7, 'day').endOf('day');
        
        // Get the start and end of this week (0-6 days ago)
        const thisWeekStart = moment.utc().subtract(6, 'day').startOf('day');
        const thisWeekEnd = moment.utc().endOf('day');

        // Process each transaction
        data.forEach((transaction) => {
            const transactionDate = moment(transaction.createdAt);
            const price = parseFloat(transaction.price) || 0;
            
            // Check if transaction is within last week range
            if (transactionDate.isBetween(lastWeekStart, lastWeekEnd, 'day', '[]')) {
                const dayIndex = transactionDate.diff(lastWeekStart, 'days');
                if (dayIndex >= 0 && dayIndex < 7) {
                    lastWeekData[dayIndex] += price;
                }
            }
            // Check if transaction is within this week range
            else if (transactionDate.isBetween(thisWeekStart, thisWeekEnd, 'day', '[]')) {
                const dayIndex = transactionDate.diff(thisWeekStart, 'days');
                if (dayIndex >= 0 && dayIndex < 7) {
                    thisWeekData[dayIndex] += price;
                }
            }
        });

        return {
            labels: dayLabels,
            datasets: [
                {
                    label: 'Last Week',
                    backgroundColor:'#7F7F7F',
                    data: lastWeekData,
                },
                {
                    label: 'This Week',
                    backgroundColor:'#3CB29F',
                    data: thisWeekData,
                }
            ]
        };
    }

    private convertDataForChartByMonth(data: {price: string, createdAt: Date}[]) {
        // Create day labels for 31 days of the month (1-31)
        const dayLabels: string[] = [];
        const lastMonthData = new Array(31).fill(0);
        const thisMonthData = new Array(31).fill(0);
        
        // Generate labels for days 1-31
        for (let i = 1; i <= 31; i++) {
            dayLabels.push(i.toString().padStart(2, '0')); // e.g., "01", "02", ..., "31"
        }

        // Get the start and end of last month
        const lastMonthStart = moment.utc().subtract(1, 'month').startOf('month');
        const lastMonthEnd = moment.utc().subtract(1, 'month').endOf('month');
        
        // Get the start and end of this month
        const thisMonthStart = moment.utc().startOf('month');
        const thisMonthEnd = moment.utc().endOf('month');

        // Process each transaction
        data.forEach((transaction) => {
            const transactionDate = moment(transaction.createdAt);
            const price = parseFloat(transaction.price) || 0;
            
            // Check if transaction is within last month range
            if (transactionDate.isBetween(lastMonthStart, lastMonthEnd, 'day', '[]')) {
                const dayOfMonth = transactionDate.date(); // Get day of month (1-31)
                if (dayOfMonth >= 1 && dayOfMonth <= 31) {
                    lastMonthData[dayOfMonth - 1] += price; // Convert to 0-based index
                }
            }
            // Check if transaction is within this month range
            else if (transactionDate.isBetween(thisMonthStart, thisMonthEnd, 'day', '[]')) {
                const dayOfMonth = transactionDate.date(); // Get day of month (1-31)
                if (dayOfMonth >= 1 && dayOfMonth <= 31) {
                    thisMonthData[dayOfMonth - 1] += price; // Convert to 0-based index
                }
            }
        });

        return {
            labels: dayLabels,
            datasets: [
                {
                    label: 'Last Month',
                    backgroundColor:'#7F7F7F',
                    data: lastMonthData,
                },
                {
                    label: 'This Month',
                    backgroundColor:'#3CB29F',
                    data: thisMonthData,
                }
            ]
        };
    }

    private convertDataForChartByYear(data: {price: string, createdAt: Date}[]) {
        // Create month labels for 12 months of the year (Jan-Dec)
        const monthLabels: string[] = [];
        const lastYearData = new Array(12).fill(0);
        const thisYearData = new Array(12).fill(0);
        
        // Generate labels for months Jan-Dec
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthLabels.push(...monthNames);

        // Get the start and end of last year
        const lastYearStart = moment.utc().subtract(1, 'year').startOf('year');
        const lastYearEnd = moment.utc().subtract(1, 'year').endOf('year');
        
        // Get the start and end of this year
        const thisYearStart = moment.utc().startOf('year');
        const thisYearEnd = moment.utc().endOf('year');

        // Process each transaction
        data.forEach((transaction) => {
            const transactionDate = moment(transaction.createdAt);
            const price = parseFloat(transaction.price) || 0;
            
            // Check if transaction is within last year range
            if (transactionDate.isBetween(lastYearStart, lastYearEnd, 'day', '[]')) {
                const monthOfYear = transactionDate.month(); // Get month (0-11)
                if (monthOfYear >= 0 && monthOfYear < 12) {
                    lastYearData[monthOfYear] += price;
                }
            }
            // Check if transaction is within this year range
            else if (transactionDate.isBetween(thisYearStart, thisYearEnd, 'day', '[]')) {
                const monthOfYear = transactionDate.month(); // Get month (0-11)
                if (monthOfYear >= 0 && monthOfYear < 12) {
                    thisYearData[monthOfYear] += price;
                }
            }
        });

        return {
            labels: monthLabels,
            datasets: [
                {
                    label: 'Last Year',
                    backgroundColor:'#7F7F7F',
                    data: lastYearData,
                },
                {
                    label: 'This Year',
                    backgroundColor:'#3CB29F',
                    data: thisYearData,
                }
            ]
        };
    }
}
