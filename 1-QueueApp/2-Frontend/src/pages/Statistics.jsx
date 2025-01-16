import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import customersService from '../services/customersService';
import queuesService from '../services/queuesService';
import { filterByDate, prepareChartData, exportToPDF } from '../utils/statisticsHelper';
import { calculateWaitingTime } from '../utils/customersHelper';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = ({ queues, setQueues }) => {
  const [customers, setCustomers] = useState([]);
  const [content, setContent] = useState('');
  const [chart, setChart] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [selectedStatistics, setSelectedStatistics] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const chartRef = useRef();

  useEffect(() => {
    customersService.getAll().then((data) => {
      setCustomers(data);
    });

    queuesService.getActive().then((initialQueues) => {
      setQueues(initialQueues);
    });
  }, []);

  useEffect(() => {
    if (customers.length > 0 && queues.length > 0) {
      handleDailyStatistics(customers, queues);
    }
  }, [customers, queues]);

  const handleDailyStatistics = () => {
    const dailyCustomers = filterByDate(customers, 'daily');
    const waitingCount = dailyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = dailyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = dailyCustomers.filter((customer) => customer.status === 'done').length;

    const waitingTimes = dailyCustomers.map((customer) => {
      const waitingTime = calculateWaitingTime(
        customer.joining_time,
        customer.process_start_time
      );
      return waitingTime >= 0 ? waitingTime : 0;
    });

    const totalWaitingTime = waitingTimes.reduce((acc, time) => acc + time, 0);
    const averageWaitingTime = waitingTimes.length > 0
      ? totalWaitingTime / waitingTimes.length
      : 0;

    setStatistics({
      total: dailyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('daily');
    setContent(
      <div>
        <h2>Daily Statistics</h2>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
        <p>Total Customers: {dailyCustomers.length}</p>
        <p>Average Waiting Time: {averageWaitingTime.toFixed(2)} minutes</p>
      </div>
    );
    setChart(prepareChartData(customers, 'daily'));
  };

  const handleWeeklyStatistics = () => {
    const weeklyCustomers = filterByDate(customers, 'weekly');
    const waitingCount = weeklyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = weeklyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = weeklyCustomers.filter((customer) => customer.status === 'done').length;

    const waitingTimes = weeklyCustomers.map((customer) => {
      const waitingTime = calculateWaitingTime(
        customer.joining_time,
        customer.process_start_time
      );
      return waitingTime >= 0 ? waitingTime : 0;
    });

    const totalWaitingTime = waitingTimes.reduce((acc, time) => acc + time, 0);
    const averageWaitingTime = waitingTimes.length > 0
      ? totalWaitingTime / waitingTimes.length
      : 0;

    setStatistics({
      total: weeklyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('weekly');
    setContent(
      <div>
        <h2>Weekly Statistics</h2>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
        <p>Total Customers: {weeklyCustomers.length}</p>
        <p>Average Waiting Time: {averageWaitingTime.toFixed(2)} minutes</p>
      </div>
    );
    setChart(prepareChartData(customers, 'weekly'));
  };

  const handleMonthlyStatistics = () => {
    const monthlyCustomers = filterByDate(customers, 'monthly');
    const waitingCount = monthlyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = monthlyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = monthlyCustomers.filter((customer) => customer.status === 'done').length;

    const waitingTimes = monthlyCustomers.map((customer) => {
      const waitingTime = calculateWaitingTime(
        customer.joining_time,
        customer.process_start_time
      );
      return waitingTime >= 0 ? waitingTime : 0;
    });

    const totalWaitingTime = waitingTimes.reduce((acc, time) => acc + time, 0);
    const averageWaitingTime = waitingTimes.length > 0
      ? totalWaitingTime / waitingTimes.length
      : 0;

    setStatistics({
      total: monthlyCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('monthly');
    setContent(
      <div>
        <h2>Monthly Statistics</h2>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
        <p>Total Customers: {monthlyCustomers.length}</p>
        <p>Average Waiting Time: {averageWaitingTime.toFixed(2)} minutes</p>
      </div>
    );
    setChart(prepareChartData(customers, 'monthly'));
  };

  const handleCustomStatistics = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const customCustomers = filterByDate(customers, 'custom', startDate, endDate);
    const waitingCount = customCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = customCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = customCustomers.filter((customer) => customer.status === 'done').length;

    const waitingTimes = customCustomers.map((customer) => {
      const waitingTime = calculateWaitingTime(
        customer.joining_time,
        customer.process_start_time
      );
      return waitingTime >= 0 ? waitingTime : 0;
    });

    const totalWaitingTime = waitingTimes.reduce((acc, time) => acc + time, 0);
    const averageWaitingTime = waitingTimes.length > 0
      ? totalWaitingTime / waitingTimes.length
      : 0;

    setStatistics({
      total: customCustomers.length,
      waiting: waitingCount,
      processing: processingCount,
      completed: completedCount,
    });

    setSelectedStatistics('custom');
    setContent(
      <div>
        <h2>Custom Date Range Statistics</h2>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
        <p>Total Customers: {customCustomers.length}</p>
        <p>Average Waiting Time: {averageWaitingTime.toFixed(2)} minutes</p>
      </div>
    );
    setChart(prepareChartData(customers, 'custom', startDate, endDate));
  };

  return (
    <div className="page-container">
      <div className="page-con">
        <div className="left">
          <div className="left-container">{content}</div>
        </div>
        <div className="right">
          <div className="container box">
            <h1>Statistics</h1>
            <div className="btn-container">
              <Button text="Daily ( Today )" onClick={handleDailyStatistics} />
              <Button text="Weekly" onClick={handleWeeklyStatistics} />
              <Button text="Monthly" onClick={handleMonthlyStatistics} />
            </div>
            <div className="date-container">
              <h4>Select Date Range</h4>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button text="Custom Range" onClick={handleCustomStatistics} />
            </div>
            {chart && (
              <div ref={chartRef} className="chart-container">
                <Bar data={chart} />
              </div>
            )}
            <Button
              text="Export to PDF"
              onClick={() =>
                exportToPDF(statistics, selectedStatistics, chartRef)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
