import * as React from 'react';
import Box from '@mui/material/Box';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const OverdueTasksGauge = ({ tasks }) => {
  const { theme } = useTheme();

  // Calculate overdue tasks
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Reset time to start of day

  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.due);
    dueDate.setHours(0, 0, 0, 0);
    return task.status !== 'Completed' && dueDate < now;
  });

  const totalIncompleteTasks = tasks.filter(task => task.status !== 'Completed').length;
  const overdueCount = overdueTasks.length;
  const overduePercentage = totalIncompleteTasks > 0 
    ? Math.round((overdueCount / totalIncompleteTasks) * 100) 
    : 0;

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
  
  // Determine gauge color based on percentage
  const getGaugeColor = () => {
    if (overduePercentage >= 50) return '#ef4444'; // red
    if (overduePercentage >= 25) return '#f59e0b'; // orange
    return '#22c55e'; // green
  };

  const gaugeColor = getGaugeColor();

  // Download as PDF function
  const downloadPDF = async () => {
    try {
      const chartElement = document.getElementById('overdue-tasks-gauge');
      
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
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const width = pdfWidth - 40;
      const height = width / ratio;
      
      pdf.setFontSize(20);
      pdf.setTextColor(theme === 'dark' ? 52 : 5, theme === 'dark' ? 211 : 150, theme === 'dark' ? 153 : 105);
      pdf.text('Overdue Tasks Report', pdfWidth / 2, 15, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 25, { align: 'center' });
      
      pdf.addImage(imgData, 'PNG', 20, 35, width, height);
      
      pdf.save('overdue-tasks-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Box
      id="overdue-tasks-gauge"
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
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <WarningAmberIcon sx={{ color: gaugeColor, fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
          <span>Overdue Tasks Monitor</span>
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(12px, 3vw, 20px)' }}>
        <Gauge
          value={overduePercentage}
          valueMax={100}
          startAngle={-110}
          endAngle={110}
          width={Math.min(280, window.innerWidth - 80)}
          height={Math.min(200, window.innerWidth * 0.55)}
          text={({ value }) => `${value}%`}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: { xs: 28, sm: 34, md: 40 },
              transform: 'translate(0px, 0px)',
              fill: textColor,
              fontWeight: 'bold',
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: gaugeColor,
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          }}
        />

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 'clamp(8px, 2vw, 16px)',
          width: '100%',
          marginTop: 'clamp(4px, 2vw, 10px)'
        }}>
          <div style={{
            textAlign: 'center',
            padding: 'clamp(8px, 2vw, 12px)',
            backgroundColor: theme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            border: `1px solid ${theme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)'}`,
          }}>
            <div style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
              fontWeight: 'bold', 
              color: '#ef4444',
              marginBottom: '4px',
              lineHeight: 1
            }}>
              {overdueCount}
            </div>
            <div style={{ 
              fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', 
              color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1.2
            }}>
              Overdue
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: 'clamp(8px, 2vw, 12px)',
            backgroundColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(251, 191, 36, 0.05)',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            border: `1px solid ${theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.2)'}`,
          }}>
            <div style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
              fontWeight: 'bold', 
              color: '#fbbf24',
              marginBottom: '4px',
              lineHeight: 1
            }}>
              {totalIncompleteTasks}
            </div>
            <div style={{ 
              fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', 
              color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1.2
            }}>
              Active
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: 'clamp(8px, 2vw, 12px)',
            backgroundColor: theme === 'dark' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
            borderRadius: 'clamp(6px, 1.5vw, 8px)',
            border: `1px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
          }}>
            <div style={{ 
              fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
              fontWeight: 'bold', 
              color: '#22c55e',
              marginBottom: '4px',
              lineHeight: 1
            }}>
              {totalIncompleteTasks - overdueCount}
            </div>
            <div style={{ 
              fontSize: 'clamp(0.65rem, 2vw, 0.75rem)', 
              color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              lineHeight: 1.2
            }}>
              On Track
            </div>
          </div>
        </div>

        <div style={{ 
          marginTop: 'clamp(8px, 2vw, 8px)', 
          fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)', 
          color: theme === 'dark' ? '#a3a3a3' : '#6b7280',
          textAlign: 'center',
          lineHeight: 1.4,
          padding: '0 8px'
        }}>
          {overduePercentage >= 50 ? '⚠️ High overdue rate - immediate attention needed' : 
           overduePercentage >= 25 ? '⚡ Moderate overdue rate - review recommended' : 
           '✅ Low overdue rate - tasks are on track'}
        </div>
      </div>
    </Box>
  );
};

export default OverdueTasksGauge;
