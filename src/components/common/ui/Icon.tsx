// components/ui/Icon.tsx
import { 
  Search, 
  Home, 
  Star, 
  MapPin, 
  Users, 
  Shield, 
  ArrowRight, 
  Calendar, 
  Bed, 
  Bath, 
  Square,
  LucideIcon
} from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Search,
  Home,
  Star,
  MapPin,
  Users,
  Shield,
  ArrowRight,
  Calendar,
  Bed,
  Bath,
  Square
};

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export const Icon = ({ name, className = "", size = 24 }: IconProps) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return <IconComponent className={className} size={size} />;
};