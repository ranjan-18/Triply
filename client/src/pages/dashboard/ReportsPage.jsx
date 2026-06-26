// src/pages/dashboard/ReportsPage.jsx

import DashboardLayout from "../../layouts/DashboardLayout";
import { FaChartPie, FaMoneyBillWave } from "react-icons/fa";
import { useGlobalExpenses } from "../../hooks/useGlobalLedger";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useAuthStore from "../../store/authStore";

const COLORS = ["#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

const ReportsPage = () => {
  const { user } = useAuthStore();
  const { data: expenses = [], isLoading } = useGlobalExpenses();

  // Aggregate Data
  const totalSpent = expenses.reduce((sum, exp) => {
    // Only count the user's portion of the expense across all trips
    const userSplit = exp.splits.find(s => s.userId._id === user?.id);
    return sum + (userSplit ? userSplit.owedAmount : 0);
  }, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    const userSplit = exp.splits.find(s => s.userId._id === user?.id);
    if (userSplit) {
      acc[exp.category] = (acc[exp.category] || 0) + userSplit.owedAmount;
    }
    return acc;
  }, {});

  const pieData = Object.keys(categoryTotals).map(key => ({
    name: key,
    value: categoryTotals[key]
  })).sort((a,b) => b.value - a.value);

  // Get last 6 months data
  const monthlyTotals = expenses.reduce((acc, exp) => {
    const userSplit = exp.splits.find(s => s.userId._id === user?.id);
    if (userSplit) {
      const monthYear = new Date(exp.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      acc[monthYear] = (acc[monthYear] || 0) + userSplit.owedAmount;
    }
    return acc;
  }, {});

  const barData = Object.keys(monthlyTotals).map(key => ({
    name: key,
    amount: monthlyTotals[key]
  }));

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-10">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Reports</h1>
            <p className="text-slate-500 mt-2 text-lg">Your global spending analytics</p>
          </div>
          <div className="w-16 h-16 bg-pink-100 rounded-3xl flex items-center justify-center text-pink-600 text-3xl">
            <FaChartPie />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-md">
                <FaMoneyBillWave />
              </div>
              
              <p className="text-violet-100 font-medium text-lg mb-2">Total Personal Spending</p>
              <h2 className="text-5xl font-bold">
                <span className="text-3xl text-violet-200 mr-2">INR</span>
                {totalSpent.toFixed(2)}
              </h2>
              <p className="text-sm text-violet-200 mt-4 bg-black/10 inline-block px-4 py-2 rounded-xl">
                Across {expenses.length} expenses you were involved in
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm h-full">
              <h3 className="font-bold text-xl text-slate-800 mb-6">Spending by Category</h3>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center text-slate-400 animate-pulse">Loading charts...</div>
              ) : pieData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-slate-400">No data available</div>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `INR ${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {pieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="text-sm font-medium text-slate-600">{entry.name} ({Math.round((entry.value/totalSpent)*100)}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
              <h3 className="font-bold text-xl text-slate-800 mb-6">Monthly Spending Trend</h3>
              {isLoading ? (
                <div className="h-72 flex items-center justify-center text-slate-400 animate-pulse">Loading charts...</div>
              ) : barData.length === 0 ? (
                <div className="h-72 flex items-center justify-center text-slate-400">No data available</div>
              ) : (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        formatter={(value) => [`INR ${value.toFixed(2)}`, 'Spent']}
                      />
                      <Bar dataKey="amount" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={60} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
