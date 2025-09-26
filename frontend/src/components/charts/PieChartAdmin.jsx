import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';
import { useTheme } from '../../context/themeContext';

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

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '12px',
        p: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        ...containerStyles,
      }}
    >
      <h1
        className={`text-2xl font-bold mb-2 ml-2 ${
          theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
        }`}
      >
        Task Status
      </h1>
      <PieChart
        series={[
          {
            data: tasksStatus,
            innerRadius: 50,
            arcLabel: (params) => params.label ?? '',
            arcLabelMinAngle: 20,
            valueFormatter,
            highlightScope: { faded: 'global', highlight: 'item' },
            faded: {
              innerRadius: 30,
              additionalRadius: -30,
              color: theme === 'dark' ? '#404040' : '#d4d4d4',
            },
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: {
              fill: textColor,
              fontSize: 14,
            },
            itemMarkWidth: 10,
            itemMarkHeight: 10,
            markGap: 5,
            itemGap: 10,
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
            fontSize: '0.8rem',
            fontWeight: 'bold',
          },
        }}
        height={300}
        width={300}
      />
    </Box>
  );
}

export default PieChartAdmin;
