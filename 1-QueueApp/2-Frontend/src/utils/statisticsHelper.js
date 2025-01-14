//All functions from ChatGPT
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const filterByDate = (data, range, startDate = null, endDate = null) => {
  const now = new Date();

  if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return data.filter((customer) => {
          const customerDate = new Date(customer.joining_time.date);
          return customerDate >= start && customerDate <= end;
      });
  }

  return data.filter((customer) => {
      const customerDate = new Date(customer.joining_time.date);

      if (range === 'daily') {
          return customerDate.toDateString() === now.toDateString();
      } else if (range === 'weekly') {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay() + 1);
          startOfWeek.setHours(0, 0, 0, 0);

          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);

          return customerDate >= startOfWeek && customerDate <= endOfWeek;
      } else if (range === 'monthly') {
          return (
              customerDate.getFullYear() === now.getFullYear() &&
              customerDate.getMonth() === now.getMonth()
          );
      }
      return false;
  });
};

export const prepareChartData = (customers, period, startDate = null, endDate = null) => {
  const filteredCustomers = filterByDate(customers, period, startDate, endDate);

  const totalCustomers = filteredCustomers.length;
  const waitingCustomers = filteredCustomers.filter(customer => customer.status === 'waiting').length;
  const processingCustomers = filteredCustomers.filter(customer => customer.status === 'process').length;
  const completedCustomers = filteredCustomers.filter(customer => customer.status === 'done').length;

  return {
      labels: ['Total Customers', 'Waiting Customers', 'Processing Customers', 'Completed Customers'],
      datasets: [
          {
              label: 'Customer Counts',
              data: [totalCustomers, waitingCustomers, processingCustomers, completedCustomers],
              backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                  'rgba(75, 192, 192, 1)',
                  'rgba(255, 99, 132, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
          },
      ],
  };
};

export const exportToPDF = (statistics, selectedStatistics, chartRef) => {
  if (!selectedStatistics) {
    alert('Please select a statistics type first.');
    return;
  }

  const doc = new jsPDF();

  doc.text(`${selectedStatistics.charAt(0).toUpperCase() + selectedStatistics.slice(1)} Statistics`, 10, 10);
  doc.text(`Total Customers: ${statistics.total}`, 10, 20);
  doc.text(`Waiting Customers: ${statistics.waiting}`, 10, 30);
  doc.text(`Processing Customers: ${statistics.processing}`, 10, 40);
  doc.text(`Completed Customers: ${statistics.completed}`, 10, 50);

  html2canvas(chartRef.current).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 10, 60, 180, 100);
    doc.save(`${selectedStatistics}_statistics_with_chart.pdf`);
  });
};


