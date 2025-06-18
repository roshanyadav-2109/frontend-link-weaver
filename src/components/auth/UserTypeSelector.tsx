
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, Factory } from 'lucide-react';

interface UserTypeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const UserTypeSelector = ({ value, onValueChange, className = "" }: UserTypeSelectorProps) => {
  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-3 block">
        I am registering as:
      </Label>
      <RadioGroup value={value} onValueChange={onValueChange} className="grid grid-cols-1 gap-3">
        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="client" id="client" />
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-blue" />
            </div>
            <Label htmlFor="client" className="font-medium cursor-pointer flex-1">
              Client - Looking to source products
            </Label>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
          <RadioGroupItem value="manufacturer" id="manufacturer" />
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <Factory className="w-4 h-4 text-brand-teal" />
            </div>
            <Label htmlFor="manufacturer" className="font-medium cursor-pointer flex-1">
              Manufacturer - Selling products/services
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default UserTypeSelector;
