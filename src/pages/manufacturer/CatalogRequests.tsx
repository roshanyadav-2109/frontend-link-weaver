
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Check, Download } from 'lucide-react';

const CatalogRequests: React.FC = () => {
  const { user } = useAuth();
  
  // Simulated catalog requests data
  // In a real application, this would be fetched from your database
  const catalogRequests = [
    {
      id: '1',
      clientName: 'Global Imports Inc.',
      clientEmail: 'purchasing@globalimports.com',
      date: '2023-04-28',
      categories: ['Textiles & Fabrics', 'Handicrafts'],
      message: 'Interested in sustainable textile products for European market.',
      status: 'New'
    },
    {
      id: '2',
      clientName: 'European Trade LLC',
      clientEmail: 'info@europeantrade.com',
      date: '2023-04-26',
      categories: ['Leather Products'],
      message: 'Looking for premium leather accessories for luxury retail.',
      status: 'Viewed'
    },
    {
      id: '3',
      clientName: 'Asian Markets Co.',
      clientEmail: 'sourcing@asianmarkets.co',
      date: '2023-04-25',
      categories: ['Handicrafts & Decor'],
      message: 'Interested in traditional Indian handicrafts for holiday season.',
      status: 'Responded'
    },
    {
      id: '4',
      clientName: 'American Retail Group',
      clientEmail: 'procurement@americanretail.com',
      date: '2023-04-22',
      categories: ['Textiles & Fabrics'],
      message: 'Seeking sustainable textile suppliers for new eco-friendly line.',
      status: 'New'
    },
    {
      id: '5',
      clientName: 'Mediterranean Distributors',
      clientEmail: 'buying@meddist.eu',
      date: '2023-04-20',
      categories: ['Agriculture & Food Products'],
      message: 'Looking for organic spice suppliers with export capability to EU.',
      status: 'Viewed'
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Viewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Catalog Requests</h1>
      
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Catalog Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalogRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div>
                        {request.clientName}
                        <div className="text-sm text-gray-500">{request.clientEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.date}</TableCell>
                    <TableCell>
                      {request.categories.map((category, idx) => (
                        <span 
                          key={idx} 
                          className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                        >
                          {category}
                        </span>
                      ))}
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="px-2">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Mail className="h-4 w-4" />
                          <span className="sr-only">Respond</span>
                        </Button>
                        <Button variant="outline" size="sm" className="px-2">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        <Button variant="outline" size="sm" className="px-2 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Mark as Done</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Request Details</h2>
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 text-center py-10">
              Select a catalog request to view its details
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CatalogRequests;
