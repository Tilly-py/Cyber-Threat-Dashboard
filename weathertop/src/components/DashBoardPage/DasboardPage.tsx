import { useEffect } from 'react';
import { getNistData } from '../../api/nist';

const DashboardPage = () => {
  useEffect(() => {
    const loadData = async () => {
      const data = await getNistData();
      console.log(data);
    };
    loadData();
  });
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Här kommer vi att visa data från NIST</p>
    </div>
  );
};

export default DashboardPage;
