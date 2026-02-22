import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '../../context/themeContext';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const valueFormatter = (data) => `${data.value}%`;

function PieChartAdmin({ completed, pending }) {
  const { theme } = useTheme();

  // Calculate percentages
  const total = Number(completed) + Number(pending);
  const completePercentage = total > 0 ? (Number(completed) / total) * 100 : 0;
  const pendingPercentage = total > 0 ? (Number(pending) / total) * 100 : 0;

  const tasksStatus = [
    {
      id: 1,
      value: pendingPercentage.toFixed(0),
      label: 'Pending',
      color: theme === 'dark' ? '#facc15' : '#ca8a04', // yellow shades
    },
    {
      id: 2,
      value: completePercentage.toFixed(0),
      label: 'Completed',
      color: theme === 'dark' ? '#34d399' : '#059669', // emerald shades
    },
  ];

  //Custom styles for theme
  const containerStyles =
    theme === 'dark'
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
      const chartElement = document.getElementById('pie-chart-admin');
      
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
          const clonedElement = clonedDoc.getElementById('pie-chart-admin');
          if (clonedElement) {
            clonedElement.style.transform = 'scale(1)';
          }
        }
      });

      // Remove the clone from DOM
      document.body.removeChild(clone);

      // Create PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate dimensions to fit the chart nicely in the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      const width = pdfWidth - 40; // Margin on both sides
      const height = width / ratio;
      
      // Add title to PDF
      pdf.setFontSize(20);
      pdf.setTextColor(theme === 'dark' ? 52 : 5, theme === 'dark' ? 211 : 150, theme === 'dark' ? 153 : 105);
      pdf.text('Task Status Report', pdfWidth / 2, 15, { align: 'center' });
      
      // Add date to PDF
      pdf.setFontSize(10);
      pdf.setTextColor(theme === 'dark' ? 200 : 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 22, { align: 'center' });
      
      // Add the chart image
      const xPosition = (pdfWidth - width) / 2;
      pdf.addImage(imgData, 'PNG', xPosition, 35, width, height);
      
      // Add footer
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('OrgFlow Analytics', pdfWidth / 2, pdfHeight - 10, { align: 'center' });

      // Save the PDF
      pdf.save(`task-status-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <Box
      id="pie-chart-admin"
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

      <h1
        style={{
          fontSize: 'clamp(1.125rem, 4vw, 1.5rem)',
          fontWeight: 'bold',
          marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
          marginLeft: 'clamp(0.25rem, 1vw, 0.5rem)',
          color: theme === 'dark' ? '#34d399' : '#059669'
        }}
      >
        Task Status
      </h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <PieChart
          series={[
            {
              data: tasksStatus,
              innerRadius: window.innerWidth < 640 ? 30 : 50,
              arcLabel: (params) => params.label ?? '',
              arcLabelMinAngle: 20,
              valueFormatter,
              highlightScope: { faded: 'global', highlight: 'item' },
              faded: {
                innerRadius: window.innerWidth < 640 ? 20 : 30,
                additionalRadius: -30,
                color: theme === 'dark' ? '#404040' : '#d4d4d4',
              },
            },
          ]}
          slotProps={{
            legend: {
              labelStyle: {
                fill: textColor,
                fontSize: window.innerWidth < 640 ? 11 : 14,
              },
              itemMarkWidth: window.innerWidth < 640 ? 8 : 10,
              itemMarkHeight: window.innerWidth < 640 ? 8 : 10,
              markGap: window.innerWidth < 640 ? 4 : 5,
              itemGap: window.innerWidth < 640 ? 8 : 10,
            },
          }}
          sx={{
            '& .MuiChartsLegend-root': {
              color: `${textColor} !important`,
            },
            '& .MuiChartsLegend-series text': {
              fill: `${textColor} !important`,
            },
            '& .MuiChartsArc-label': {
              fill: textColor,
              fontSize: { xs: '0.6rem', sm: '0.7rem', md: '0.8rem' },
              fontWeight: 'bold',
            },
          }}
          height={window.innerWidth < 640 ? 220 : window.innerWidth < 1024 ? 260 : 300}
          width={Math.min(300, window.innerWidth - 60)}
        />
      </div>
    </Box>
  );
}

export default PieChartAdmin;