import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AgentCard } from '@/components/agent/agent-card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import type { AgentWithUser } from '@shared/schema';

const locations = [
  { value: 'all', label: 'All Locations' },
  { value: 'manhattan', label: 'Manhattan' },
  { value: 'brooklyn', label: 'Brooklyn' },
  { value: 'queens', label: 'Queens' },
  { value: 'bronx', label: 'Bronx' },
  { value: 'staten-island', label: 'Staten Island' },
];

export default function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const { data: agents, isLoading } = useQuery<AgentWithUser[]>({
    queryKey: ['/api/agents'],
  });

  const filteredAgents = agents?.filter((agent) => {
    const matchesSearch =
      !searchQuery ||
      agent.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.specialization?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation =
      selectedLocation === 'all' ||
      agent.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-agents">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Agents</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center mb-12">
            <span className="text-gold text-sm font-semibold uppercase tracking-wider mb-2 block">
              Our Team
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
              Meet Our Expert Agents
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team of real estate professionals is here to guide you through every step of your property journey.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-agents"
              />
            </div>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-location">
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-4 p-6 border rounded-lg">
                  <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : filteredAgents && filteredAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground text-lg">
                {searchQuery || selectedLocation !== 'all'
                  ? 'No agents found matching your criteria.'
                  : 'No agents available at the moment.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
