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
  const accentColor = theme === 'dark' ? '#34d399' : '#059669';
  const subtextColor = theme === 'dark' ? '#737373' : '#9ca3af';

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
        overflow: 'hidden',
        borderRadius: '16px',
        padding: { xs: '16px', sm: '20px', md: '24px' },
        boxShadow: theme === 'dark' 
          ? '0 4px 24px rgba(0, 0, 0, 0.2)' 
          : '0 2px 16px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'clamp(16px, 3vw, 20px)',
        gap: '8px'
      }}>
        <h2 style={{ 
          color: theme === 'dark' ? '#34d399' : '#059669', 
          fontSize: 'clamp(1rem, 4vw, 1.25rem)',
          fontWeight: '700',
          letterSpacing: '-0.01em',
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
            color: theme === 'dark' ? '#a3a3a3' : '#737373',
            borderColor: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            borderRadius: '10px',
            '&:hover': {
              borderColor: theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
              backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
            },
            textTransform: 'none',
            fontSize: { xs: '0.75rem', sm: '0.8rem' },
            padding: { xs: '4px 10px', sm: '5px 12px' },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
            fontSize: 10,
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
        height={280}
        margin={{ 
          left: 45, 
          right: 15, 
          top: 20, 
          bottom: 55 
        }}
        sx={{
          maxWidth: '100%',
          '& .MuiChartsAxis-line': {
            stroke: `${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
          },
          '& .MuiChartsAxis-tick': {
            stroke: `${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important`,
          },
          '& .MuiChartsAxis-tickLabel': {
            fill: `${textColor} !important`,
          },
          '& .MuiChartsLegend-series text': {
            fill: `${textColor} !important`,
            fontSize: '0.8rem',
          },
        }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'top', horizontal: 'middle' },
            padding: 0,
            labelStyle: {
              fill: textColor,
              fontSize: 12,
            },
          },
        }}
      />
      
      <div style={{ 
        marginTop: 'clamp(8px, 2vw, 12px)', 
        fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
        color: subtextColor,
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
