import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TasksTimelineChart = ({ tasks }) => {
  const { theme } = useTheme();

  // Process tasks by month
  const processTasksByMonth = () => {
    const monthlyData = {};
    
    tasks.forEach(task => {
      if (task.createdAt) {
        const date = new Date(task.createdAt);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthName,
            assigned: 0,
            completed: 0
          };
        }
        
        monthlyData[monthYear].assigned++;
        if (task.status === 'Completed') {
          monthlyData[monthYear].completed++;
        }
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  };

  const monthlyData = processTasksByMonth();

  const chartData = {
    series: [
      {
        data: monthlyData.map(data => data.assigned),
        label: 'Tasks Assigned',
        color: theme === 'dark' ? '#60a5fa' : '#2563eb', // blue
      },
      {
        data: monthlyData.map(data => data.completed),
        label: 'Tasks Completed',
        color: theme === 'dark' ? '#34d399' : '#059669', // emerald
      },
    ],
    xAxis: [
      {
        data: monthlyData.map(data => data.month),
        scaleType: 'band',
      },
    ],
  };

  const containerStyles = theme === 'dark'
    ? {
        backgroundColor: 'rgba(23, 23, 23, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)',
      };

  const textColor = theme === 'dark' ? '#e5e5e5' : '#1f2937';

  // Download as PDF function
  const downloadPDF = async () => {
    try {
      const chartElement = document.getElementById('tasks-timeline-chart');
      
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
          const clonedElement = clonedDoc.getElementById('tasks-timeline-chart');
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
      pdf.text('Tasks Timeline Report', pdfWidth / 2, 15, { align: 'center' });
      
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
      pdf.save(`tasks-timeline-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Box
      id="tasks-timeline-chart"
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: '16px',
        p: { xs: 2, sm: 2.5, md: 3 },
        boxShadow: theme === 'dark' 
          ? '0 4px 24px rgba(0, 0, 0, 0.2)' 
          : '0 2px 16px rgba(0, 0, 0, 0.03)',
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
          top: { xs: 12, sm: 16, md: 20 },
          right: { xs: 12, sm: 16, md: 20 },
          minWidth: 'auto',
          width: { xs: 32, sm: 34, md: 36 },
          height: { xs: 32, sm: 34, md: 36 },
          borderRadius: '10px',
          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
          color: theme === 'dark' ? '#a3a3a3' : '#737373',
          border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          '&:hover': {
            backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
            border: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
            boxShadow: theme === 'dark' 
              ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
              : '0 4px 12px rgba(0, 0, 0, 0.06)',
          },
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        size="small"
      >
        <DownloadIcon 
          sx={{ 
            fontSize: { xs: 16, sm: 17, md: 18 },
            color: theme === 'dark' ? '#a3a3a3' : '#737373',
          }} 
        />
      </Button>

      <h1 style={{
        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
        fontWeight: '700',
        letterSpacing: '-0.01em',
        marginBottom: 'clamp(0.75rem, 2vw, 1rem)',
        marginLeft: 'clamp(0.25rem, 1vw, 0.5rem)',
        color: theme === 'dark' ? '#34d399' : '#059669'
      }}>
        Tasks Timeline
      </h1>
      {monthlyData.length > 0 ? (
        <LineChart
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={300}
          slotProps={{
            legend: {
              labelStyle: {
                fill: textColor,
                fontSize: 12,
              },
            },
          }}
          sx={{
            maxWidth: '100%',
            '& .MuiChartsLegend-root': {
              color: `${textColor} !important`,
            },
            '& .MuiChartsLegend-series text': {
              fill: `${textColor} !important`,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
              fill: `${textColor} !important`,
              fontSize: { xs: 9, sm: 10, md: 12 },
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-line': {
              stroke: `${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-tick': {
              stroke: `${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
            },
            '& .MuiMarkElement-root': {
              strokeWidth: 2,
            },
          }}
          margin={{
            left: 45,
            right: 15,
            top: 60,
            bottom: 70,
          }}
        />
      ) : (
        <div style={{
          textAlign: 'center',
          padding: 'clamp(1rem, 3vw, 2rem)',
          color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
          fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
        }}>
          No timeline data available
        </div>
      )}
    </Box>
  );
};

export default TasksTimelineChart;