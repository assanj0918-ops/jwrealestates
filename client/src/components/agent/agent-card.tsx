import { Link } from 'wouter';
import { Phone, Mail, Building2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { AgentWithUser } from '@shared/schema';
import { cn } from '@/lib/utils';

interface AgentCardProps {
  agent: AgentWithUser;
  className?: string;
}

export function AgentCard({ agent, className }: AgentCardProps) {
  const user = agent.user;
  
  return (
    <Card
      className={cn(
        'group overflow-visible rounded-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
        className
      )}
      data-testid={`card-agent-${agent.id}`}
    >
      <CardContent className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <Avatar className="h-24 w-24 ring-4 ring-gold/20">
            <AvatarImage src={user?.avatarUrl || ''} alt={user?.fullName || 'Agent'} />
            <AvatarFallback className="bg-primary text-white text-2xl">
              {user?.fullName?.charAt(0) || 'A'}
            </AvatarFallback>
          </Avatar>
          {agent.isActive && (
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
          )}
        </div>

        <Link href={`/agents/${agent.id}`}>
          <a>
            <h3
              className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors"
              data-testid={`text-agent-name-${agent.id}`}
            >
              {user?.fullName || 'Unknown Agent'}
            </h3>
          </a>
        </Link>

        {agent.specialization && (
          <Badge variant="secondary" className="mb-3" data-testid={`badge-specialization-${agent.id}`}>
            {agent.specialization}
          </Badge>
        )}

        {agent.rating && (
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="h-4 w-4 text-gold fill-gold" />
            <span className="text-sm font-medium" data-testid={`text-rating-${agent.id}`}>
              {Number(agent.rating).toFixed(1)}
            </span>
          </div>
        )}

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-bio-${agent.id}`}>
          {agent.bio || 'Dedicated real estate professional committed to finding your perfect property.'}
        </p>

        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
          {agent.location && (
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {agent.location}
            </span>
          )}
          {agent.propertiesCount !== undefined && agent.propertiesCount > 0 && (
            <span data-testid={`text-properties-count-${agent.id}`}>
              {agent.propertiesCount} Properties
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {user?.phone && (
            <Button
              variant="outline"
              size="icon"
              className="flex-1"
              asChild
              data-testid={`button-call-${agent.id}`}
            >
              <a href={`tel:${user.phone}`}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          )}
          {user?.email && (
            <Button
              variant="outline"
              size="icon"
              className="flex-1"
              asChild
              data-testid={`button-email-${agent.id}`}
            >
              <a href={`mailto:${user.email}`}>
                <Mail className="h-4 w-4" />
              </a>
            </Button>
          )}
          <Link href={`/agents/${agent.id}`}>
            <Button className="flex-1 bg-primary" data-testid={`button-view-profile-${agent.id}`}>
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
