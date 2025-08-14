import * as React from 'react';
import Box from '@mui/material/Box';
import { PieChart } from '@mui/x-charts/PieChart';

const valueFormatter = (data) => `${data.value}%`;

function PieChartAdmin({completed, pending}) {
  // Calculate percentages
  const total = Number(completed) + Number(pending);
  const completePercentage = total > 0 ? ((Number(completed)) / total) * 100 : 0;
  const pendingPercentage = total > 0 ? ((Number(pending)) / total) * 100 : 0;

  const tasksStatus = [
    { 
      id: 1, 
      value: pendingPercentage.toFixed(0), 
      label: 'Pending' 
    },
    { 
      id: 2, 
      value: completePercentage.toFixed(0), 
      label: 'Completed' 
    },
  ];

  return (
    <Box sx={{ 
      width: '100%',
      backgroundColor: 'rgb(23 23 23 / 0.8)',
      borderRadius: '12px',
      p: 3,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h1 className='text-2xl font-bold mb-2 ml-2'>Task Status</h1>
      <PieChart
        series={[
          {
            data: tasksStatus,
            innerRadius: 50,
            arcLabel: (params) => params.label ?? '',
            arcLabelMinAngle: 20,
            valueFormatter,
            highlightScope: { faded: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        slotProps={{
          legend: {
            labelStyle: {
              fill: '#ffffff',
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
            color: 'white !important',
          },
          '& .MuiChartsLegend-series text': {
            fill: '#ffffff !important',
          },
          '& .MuiChartsArc-label': {
            fill: '#ffffff',
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