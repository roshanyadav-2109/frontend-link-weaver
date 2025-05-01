
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [siteSettings, setSiteSettings] = useState({
    siteName: 'Anantya Overseas',
    siteEmail: 'contact@anantyaoverseas.com',
    sitePhone: '+91 98765 43210',
    siteAddress: '123 Export Plaza, Mumbai, India'
  });
  
  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // In a real app, this would save to a database
    toast.success('Settings saved successfully!');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>
                Manage your website's basic information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label htmlFor="siteName" className="block text-sm font-medium mb-1">
                    Site Name
                  </label>
                  <Input 
                    id="siteName" 
                    value={siteSettings.siteName}
                    onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="siteEmail" className="block text-sm font-medium mb-1">
                    Contact Email
                  </label>
                  <Input 
                    id="siteEmail" 
                    type="email"
                    value={siteSettings.siteEmail}
                    onChange={(e) => setSiteSettings({...siteSettings, siteEmail: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="sitePhone" className="block text-sm font-medium mb-1">
                    Contact Phone
                  </label>
                  <Input 
                    id="sitePhone" 
                    value={siteSettings.sitePhone}
                    onChange={(e) => setSiteSettings({...siteSettings, sitePhone: e.target.value})}
                  />
                </div>
                
                <div>
                  <label htmlFor="siteAddress" className="block text-sm font-medium mb-1">
                    Business Address
                  </label>
                  <Input 
                    id="siteAddress" 
                    value={siteSettings.siteAddress}
                    onChange={(e) => setSiteSettings({...siteSettings, siteAddress: e.target.value})}
                  />
                </div>
                
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Configure your social media links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium mb-1">
                    Facebook
                  </label>
                  <Input 
                    id="facebook" 
                    placeholder="https://facebook.com/yourpage"
                    defaultValue="https://facebook.com/anantyaoverseas"
                  />
                </div>
                
                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium mb-1">
                    Twitter
                  </label>
                  <Input 
                    id="twitter" 
                    placeholder="https://twitter.com/yourhandle"
                    defaultValue="https://twitter.com/anantyaoverseas"
                  />
                </div>
                
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium mb-1">
                    Instagram
                  </label>
                  <Input 
                    id="instagram" 
                    placeholder="https://instagram.com/yourprofile"
                    defaultValue="https://instagram.com/anantyaoverseas"
                  />
                </div>
                
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium mb-1">
                    LinkedIn
                  </label>
                  <Input 
                    id="linkedin" 
                    placeholder="https://linkedin.com/company/yourcompany"
                    defaultValue="https://linkedin.com/company/anantyaoverseas"
                  />
                </div>
                
                <Button className="bg-brand-blue hover:bg-brand-blue/90">
                  Save Social Links
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Admin Account</CardTitle>
              <CardDescription>
                Manage your admin account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <p className="text-gray-800 font-medium">{user?.email}</p>
                </div>
                
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <Input 
                    id="newPassword" 
                    type="password"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                    Confirm New Password
                  </label>
                  <Input 
                    id="confirmPassword" 
                    type="password"
                  />
                </div>
                
                <Button 
                  onClick={() => toast.success('Password changed successfully!')}
                  className="bg-brand-blue hover:bg-brand-blue/90 w-full"
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md bg-red-50 border-red-100">
            <CardHeader>
              <CardTitle className="text-red-800">Danger Zone</CardTitle>
              <CardDescription className="text-red-600">
                Actions that cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  toast.error('This feature is disabled in the demo');
                }}
              >
                Reset Admin Panel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
