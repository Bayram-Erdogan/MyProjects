import { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import customersService from '../services/customersService';
import { filterByDate, prepareChartData, exportToPDF } from '../utils/statisticsHelper';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Statistics = () => {
  const [customers, setCustomers] = useState([]);
  const [content, setContent] = useState('');
  const [chart, setChart] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [selectedStatistics, setSelectedStatistics] = useState('');
  const chartRef = useRef();

  useEffect(() => {
    customersService.getAll().then((data) => {
      setCustomers(data);
    });

    handleDailyStatistics();
  }, []);

  const handleDailyStatistics = () => {
    const dailyCustomers = filterByDate(customers, 'daily');
    const waitingCount = dailyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = dailyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = dailyCustomers.filter((customer) => customer.status === 'done').length;

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
        <p>Total Customers: {dailyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(customers, 'daily'));
  };

  const handleWeeklyStatistics = () => {
    const weeklyCustomers = filterByDate(customers, 'weekly');
    const waitingCount = weeklyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = weeklyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = weeklyCustomers.filter((customer) => customer.status === 'done').length;

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
        <p>Total Customers: {weeklyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(customers, 'weekly'));
  };

  const handleMonthlyStatistics = () => {
    const monthlyCustomers = filterByDate(customers, 'monthly');
    const waitingCount = monthlyCustomers.filter((customer) => customer.status === 'waiting').length;
    const processingCount = monthlyCustomers.filter((customer) => customer.status === 'process').length;
    const completedCount = monthlyCustomers.filter((customer) => customer.status === 'done').length;

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
        <p>Total Customers: {monthlyCustomers.length}</p>
        <p>Waiting Customers: {waitingCount}</p>
        <p>Processing Customers: {processingCount}</p>
        <p>Completed Customers: {completedCount}</p>
      </div>
    );
    setChart(prepareChartData(customers, 'monthly'));
  };

  return (
    <div className="page-container">
      <div className="page-con">
        <div className="left">
          <div className="left-container">
            {content}
          </div>
        </div>
        <div className="right">
          <div className="container box">
            <h1>Statistics</h1>
            <div className="btn-container">
              <Button text="Daily ( Today )" onClick={handleDailyStatistics} />
              <Button text="Weekly" onClick={handleWeeklyStatistics} />
              <Button text="Monthly" onClick={handleMonthlyStatistics} />
            </div>
            {chart && (
              <div ref={chartRef}>
                <Bar data={chart} />
              </div>
            )}
            <Button text="Export to PDF" onClick={() => exportToPDF(statistics, selectedStatistics, chartRef)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
