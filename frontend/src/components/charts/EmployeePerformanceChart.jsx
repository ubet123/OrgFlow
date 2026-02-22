import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const EmployeePerformanceChart = ({ tasks, employees }) => {
  const { theme } = useTheme();

  // Calculate completion rate for each employee
  const employeePerformance = employees.map(employee => {
    const employeeTasks = tasks.filter(task => task.assigned === employee.name);
    const totalTasks = employeeTasks.length;
    const completedTasks = employeeTasks.filter(task => task.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      employee: employee.name,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      completionRate: Math.round(completionRate)
    };
  }).filter(emp => emp.completed + emp.pending > 0); // Only show employees with tasks

  // Sort by completion rate (descending)
  employeePerformance.sort((a, b) => b.completionRate - a.completionRate);

  const chartData = {
    series: [
      {
        data: employeePerformance.map(emp => emp.completed),
        label: 'Completed',
        color: theme === 'dark' ? '#34d399' : '#059669',
      },
      {
        data: employeePerformance.map(emp => emp.pending),
        label: 'Pending',
        color: theme === 'dark' ? '#facc15' : '#ca8a04',
      }
    ],
    xAxis: [
      {
        data: employeePerformance.map(emp => emp.employee),
        scaleType: 'band',
      },
    ],
  };

  const containerStyles = theme === 'dark'
    ? {
        backgroundColor: 'rgb(23 23 23 / 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    : {
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      };

  const textColor = theme === 'dark' ? '#e5e5e5' : '#1f2937';

  // Download as PDF function
  const downloadPDF = async () => {
    try {
      const chartElement = document.getElementById('employee-performance-chart');
      
      if (!chartElement) {
        console.error('Chart element not found');
        return;
      }

      // Create a clone of the element to avoid affecting the original
      const clone = chartElement.cloneNode(true);
      clone.style.width = chartElement.offsetWidth + 'px';
      clone.style.height = 'auto';
      document.body.appendChild(clone);

      // Use html2canvas with high resolution for better quality
      const canvas = await html2canvas(clone, {
        scale: 3, // High resolution for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? 'rgb(23, 23, 23)' : 'rgba(245, 245, 245, 0.8)',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure all styles are properly applied in the clone
          const clonedElement = clonedDoc.getElementById('employee-performance-chart');
          if (clonedElement) {
            clonedElement.style.transform = 'scale(1)';
          }
        }
      });

      // Remove the clone from DOM
      document.body.removeChild(clone);

      // Create PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the chart nicely in the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const width = pdfWidth - 20; // Margin on both sides
      const height = width / ratio;
      
      // Add title to PDF
      pdf.setFontSize(20);
      pdf.setTextColor(theme === 'dark' ? 52 : 5, theme === 'dark' ? 211 : 150, theme === 'dark' ? 153 : 105);
      pdf.text('Employee Performance Report', pdfWidth / 2, 15, { align: 'center' });
      
      // Add date to PDF
      pdf.setFontSize(10);
      pdf.setTextColor(theme === 'dark' ? 200 : 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Add the chart image
      pdf.addImage(imgData, 'PNG', 10, 30, width, height);
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('OrgFlow Analytics', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`employee-performance-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Box
      id="employee-performance-chart"
      sx={{
        width: '100%',
        borderRadius: { xs: '8px', sm: '12px' },
        p: { xs: 1.5, sm: 2, md: 3 },
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        ...containerStyles,
      }}
    >
      {/* Download Button */}
   <Button
   title='Download Report'
  variant="contained"
  onClick={downloadPDF}
  sx={{
    position: 'absolute',
    top: { xs: 8, sm: 12, md: 16 },
    right: { xs: 8, sm: 12, md: 16 },
    minWidth: 'auto',
    width: { xs: 32, sm: 36, md: 40 },
    height: { xs: 32, sm: 36, md: 40 },
    borderRadius: '8px',
    backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
    color: theme === 'dark' ? '#e5e5e5' : '#1f2937',
    border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)',
      border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-1px)',
      boxShadow: theme === 'dark' 
        ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
        : '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'all 0.2s ease-in-out',
  }}
  size="small"
>
  <DownloadIcon 
    sx={{ 
      fontSize: { xs: 16, sm: 18, md: 20 },
      color: theme === 'dark' ? '#e5e5e5' : '#1f2937',
    }} 
  />
</Button>

      <h1 style={{
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
        fontWeight: 'bold',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        marginLeft: 'clamp(0.25rem, 1vw, 0.5rem)',
        color: theme === 'dark' ? '#34d399' : '#059669'
      }}>
        Employee Performance
      </h1>
      {employeePerformance.length > 0 ? (
        <BarChart
          dataset={employeePerformance}
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 300 : 350}
          slotProps={{
            legend: {
              labelStyle: {
                fill: textColor,
                fontSize: window.innerWidth < 640 ? 11 : 14,
              },
            },
          }}
          sx={{
            '& .MuiChartsLegend-root': {
              color: `${textColor} !important`,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
              fill: textColor,
              fontSize: { xs: 10, sm: 11, md: 12 },
              angle: window.innerWidth < 768 ? -45 : 0,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-line': {
              stroke: textColor,
            },
          }}
          margin={{
            left: window.innerWidth < 640 ? 40 : 50,
            right: window.innerWidth < 640 ? 10 : 20,
            top: window.innerWidth < 640 ? 60 : 70,
            bottom: window.innerWidth < 768 ? 80 : 50,
          }}
        />
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(1rem, 3vw, 2rem)',
          color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
        }}>
          No task data available for employees
        </div>
      )}
    </Box>
  );
};

export default EmployeePerformanceChart;