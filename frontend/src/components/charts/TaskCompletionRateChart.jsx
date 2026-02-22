import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TaskCompletionRateChart = ({ tasks }) => {
  const { theme } = useTheme();

  // Process tasks to get monthly completion rates over the last 6 months
  const processMonthlyData = () => {
    const months = [];
    const now = new Date();
    
    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        month: date.getMonth(),
        year: date.getFullYear(),
        completed: 0,
        total: 0
      });
    }

    // Count tasks for each month based on creation date
    tasks.forEach(task => {
      const createdDate = new Date(task.createdAt);
      const monthIndex = months.findIndex(m => 
        m.month === createdDate.getMonth() && m.year === createdDate.getFullYear()
      );
      
      if (monthIndex !== -1) {
        months[monthIndex].total++;
        if (task.status === 'Completed') {
          months[monthIndex].completed++;
        }
      }
    });

    // Calculate completion rate for each month
    return months.map(m => ({
      label: m.label,
      rate: m.total > 0 ? Math.round((m.completed / m.total) * 100) : 0,
      completed: m.completed,
      total: m.total
    }));
  };

  const monthlyData = processMonthlyData();

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
  const accentColor = theme === 'dark' ? '#34d399' : '#059669';

  // Download as PDF function
  const downloadPDF = async () => {
    try {
      const chartElement = document.getElementById('task-completion-rate-chart');
      
      if (!chartElement) {
        console.error('Chart element not found');
        return;
      }

      const clone = chartElement.cloneNode(true);
      clone.style.width = chartElement.offsetWidth + 'px';
      clone.style.height = 'auto';
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: theme === 'dark' ? 'rgb(23, 23, 23)' : 'rgba(245, 245, 245, 0.8)',
        logging: false,
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const width = pdfWidth - 40;
      const height = width / ratio;
      
      pdf.setFontSize(20);
      pdf.setTextColor(theme === 'dark' ? 52 : 5, theme === 'dark' ? 211 : 150, theme === 'dark' ? 153 : 105);
      pdf.text('Task Completion Rate Trend', pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 25, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', 20, 30, width, height);
      
      pdf.save('task-completion-rate-trend.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Box
      id="task-completion-rate-chart"
      sx={{
        ...containerStyles,
        borderRadius: { xs: '8px', sm: '12px' },
        padding: { xs: '12px', sm: '16px', md: '20px' },
        boxShadow: theme === 'dark' 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: window.innerWidth < 640 ? 'flex-start' : 'center',
        marginBottom: 'clamp(12px, 3vw, 16px)',
        gap: '8px'
      }}>
        <h2 style={{ 
          color: textColor, 
          fontSize: 'clamp(1rem, 4vw, 1.25rem)',
          fontWeight: 'bold',
          margin: 0
        }}>
          Task Completion Rate Trend
        </h2>
        <Button
          onClick={downloadPDF}
          startIcon={<DownloadIcon />}
          variant="outlined"
          size="small"
          sx={{
            color: accentColor,
            borderColor: accentColor,
            '&:hover': {
              borderColor: accentColor,
              backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.1)',
            },
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            padding: { xs: '4px 8px', sm: '6px 12px' }
          }}
        >
          PDF
        </Button>
      </div>

      <LineChart
        xAxis={[{ 
          scaleType: 'point', 
          data: monthlyData.map(d => d.label),
          tickLabelStyle: {
            fill: textColor,
            fontSize: window.innerWidth < 640 ? 10 : 12,
            angle: window.innerWidth < 640 ? -45 : 0,
          }
        }]}
        series={[
          {
            data: monthlyData.map(d => d.rate),
            label: 'Completion Rate (%)',
            color: accentColor,
            curve: 'natural',
            area: true,
            showMark: true,
          },
        ]}
        height={window.innerWidth < 640 ? 250 : window.innerWidth < 1024 ? 280 : 300}
        margin={{ 
          left: window.innerWidth < 640 ? 40 : 50, 
          right: window.innerWidth < 640 ? 10 : 20, 
          top: 20, 
          bottom: window.innerWidth < 640 ? 60 : 50 
        }}
        sx={{
          '& .MuiChartsAxis-line': {
            stroke: textColor,
          },
          '& .MuiChartsAxis-tick': {
            stroke: textColor,
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: textColor,
          },
          '& .MuiChartsLegend-series text': {
            fill: `${textColor} !important`,
            fontSize: { xs: '0.75rem', sm: '0.875rem' }
          },
        }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 0,
            labelStyle: {
              fill: textColor,
              fontSize: window.innerWidth < 640 ? 11 : 14,
            },
          },
        }}
      />
      
      <div style={{ 
        marginTop: 'clamp(8px, 2vw, 12px)', 
        fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)', 
        color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
        textAlign: 'center',
        lineHeight: 1.4,
        padding: '0 8px'
      }}>
        Showing completion rate % for tasks created in the last 6 months
      </div>
    </Box>
  );
};

export default TaskCompletionRateChart;
