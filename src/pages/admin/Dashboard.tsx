
import React from 'react';
import { 
  Package, 
  Briefcase, 
  Users, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statCards = [
  {
    title: 'Total Products',
    value: '124',
    change: '+12% from last month',
    icon: <Package className="h-8 w-8 text-brand-blue" />
  },
  {
    title: 'Active Job Positions',
    value: '5',
    change: '+1 new position',
    icon: <Briefcase className="h-8 w-8 text-brand-teal" />
  },
  {
    title: 'Client Inquiries',
    value: '38',
    change: '12 unread messages',
    icon: <MessageSquare className="h-8 w-8 text-blue-500" />
  },
  {
    title: 'Total Visitors',
    value: '1,248',
    change: '+18% from last week',
    icon: <Users className="h-8 w-8 text-indigo-500" />
  }
];

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Product Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Premium Cotton Textiles', 'Organic Basmati Rice', 'Handcrafted Jewelry', 'Leather Accessories'].map((product, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <span>{product}</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/admin/products" className="text-sm text-brand-blue hover:underline">View all products →</a>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Job Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: 'John Doe', position: 'International Business Developer', date: '2 days ago' },
                { name: 'Jane Smith', position: 'Supply Chain Specialist', date: '1 week ago' },
                { name: 'Mike Johnson', position: 'Digital Marketing Specialist', date: '2 weeks ago' }
              ].map((app, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-gray-500">{app.position}</p>
                  </div>
                  <span className="text-xs text-gray-500">{app.date}</span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a href="/admin/careers" className="text-sm text-brand-blue hover:underline">View all applications →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
