import React from 'react';

export const RevenueBarChart = () => {
  const data = [
    { month: 'May', val: '2.4L', height: '40%' },
    { month: 'Jun', val: '3.8L', height: '55%' },
    { month: 'Jul', val: '1.5L', height: '30%' },
    { month: 'Aug', val: '4.2L', height: '65%' },
    { month: 'Sep', val: '5.9L', height: '80%' },
    { month: 'Oct', val: '4.5L', height: '70%', current: true },
  ];

  return (
    <div className="relative h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-8">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="w-full flex flex-col justify-end h-full group relative cursor-pointer"
        >
          <div
            className={`w-full rounded-t-lg relative transition-all duration-300 hover:opacity-90 ${item.current ? 'bg-blue-600 dark:bg-blue-500' : 'bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-800/60'}`}
            style={{ height: item.height }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              ₹{item.val}
            </div>
          </div>
          <p
            className={`text-center mt-2 text-xs ${item.current ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}
          >
            {item.month}
          </p>
        </div>
      ))}
    </div>
  );
};
