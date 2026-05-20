import { useEffect, useState } from 'react';
import { getSummary, getRecent, getCategoryTotals, getCategoryBreakdown, getMonthlyFinance, getQuarterlyFinance, getYearlyFinance } from '../controllers/dashboard.controller';

function SummaryCard({ title, value }) {
  return (
    <div className="card">
      <p style={{ color: '#718096' }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [categories, setCategories] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [quarterly, setQuarterly] = useState([]);
  const [yearly, setYearly] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [summaryData, recentData, categoryData, breakdownData, monthlyData, quarterlyData, yearlyData] = await Promise.all([
          getSummary(),
          getRecent(),
          getCategoryTotals(),
          getCategoryBreakdown(),
          getMonthlyFinance(),
          getQuarterlyFinance(),
          getYearlyFinance()
        ]);
        setSummary(summaryData);
        setRecent(recentData.slice(0, 5));
        setCategories(categoryData);
        setBreakdown(breakdownData);
        setMonthly(monthlyData);
        setQuarterly(quarterlyData);
        setYearly(yearlyData);
      } catch (err) {
        setError(err.message);
      }
    };

    loadData();
  }, []);

  return (
    <div className="grid" style={{ gap: '24px' }}>
      <div className="panel">
        <h1>Dashboard</h1>
        <p>Financial overview for your account and records.</p>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="grid grid-3">
        <SummaryCard title="Total Income" value={summary?.totalIncome ?? '—'} />
        <SummaryCard title="Total Expense" value={summary?.totalExpense ?? '—'} />
        <SummaryCard title="Net Balance" value={summary?.netBalance ?? '—'} />
      </div>

      <div className="grid grid-2">
        <div className="panel">
          <h2>Recent transactions</h2>
          {recent.length === 0 ? (
            <p>No recent records available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((record) => (
                  <tr key={record.id}>
                    <td>{new Date(record.createdAt).toLocaleDateString()}</td>
                    <td>{record.category}</td>
                    <td>{record.type}</td>
                    <td>{record.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel">
          <h2>Category totals</h2>
          {categories.length === 0 ? (
            <p>No category totals available.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((item, index) => (
                  <tr key={index}>
                    <td>{item.category}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="grid grid-3">
        <div className="panel">
          <h3>Monthly finance</h3>
          {monthly.length === 0 ? <p>No monthly data.</p> : (
            <ul>
              {monthly.map((item) => (
                <li key={item.period}>{item.period}: Income {item.income}, Expense {item.expense}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3>Quarterly finance</h3>
          {quarterly.length === 0 ? <p>No quarterly data.</p> : (
            <ul>
              {quarterly.map((item) => (
                <li key={item.period}>{item.period}: Income {item.income}, Expense {item.expense}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="panel">
          <h3>Yearly finance</h3>
          {yearly.length === 0 ? <p>No yearly data.</p> : (
            <ul>
              {yearly.map((item) => (
                <li key={item.period}>{item.period}: Income {item.income}, Expense {item.expense}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="panel">
        <h2>Expense breakdown</h2>
        {breakdown.length === 0 ? (
          <p>No breakdown data.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
