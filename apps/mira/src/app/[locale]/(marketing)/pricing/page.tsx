'use client';

import GradientHeadline from '../gradient-headline';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/components/ui/accordion';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/ui/table';
import {
  Archive,
  BarChart3,
  Bot,
  Boxes,
  Briefcase,
  Building,
  Building2,
  Calculator,
  CalendarDays,
  Check,
  FileStack,
  GanttChartSquare,
  Group,
  HardDrive,
  Minus,
  Network,
  Settings,
  ShieldCheck,
  Sparkles,
  Users2,
  Zap,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Fragment } from 'react';

const plans = [
  {
    name: 'Free',
    description: 'For small teams getting started with basic needs.',
    price: '$0',
    priceDetails: 'forever free',
    features: [
      'Up to 5 team members',
      '500MB storage',
      'Basic AI features',
      'Email support',
      'Community access',
    ],
    limits: {
      workspace: {
        amount: '3 workspaces',
        members: '5 members',
        storage: '500MB',
      },
      ai: {
        credits: '100/month',
        modelsAccess: 'Basic models only',
      },
      calendar: {
        events: '100/month',
        meetingDuration: '40 min max',
      },
      documents: {
        parsing: '50 pages/month',
        ocr: '20 pages/month',
      },
      drive: {
        fileSize: '25MB per file',
        sharing: 'Internal only',
      },
      crm: {
        contacts: '100',
        campaigns: '2 active',
      },
      tasks: {
        automations: '5 active',
        templates: '3',
      },
      workflows: {
        builderAccess: 'Basic only',
        runs: '100/month',
      },
      inventory: {
        items: '100',
        locations: '1',
      },
      finance: {
        transactions: '100/month',
        reports: 'Basic only',
      },
    },
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    description: 'For growing teams that need more power and flexibility.',
    price: '$25',
    priceDetails: 'per workspace/month',
    features: [
      'Up to 10 team members',
      '50GB storage',
      'Advanced AI features',
      'Priority support',
      'API access',
      'Custom integrations',
    ],
    limits: {
      workspace: {
        members: '10 members',
        storage: '50GB',
      },
      ai: {
        credits: '1,000/month',
        modelsAccess: 'Advanced models',
      },
      calendar: {
        events: 'Unlimited',
        meetingDuration: 'Unlimited',
      },
      documents: {
        parsing: '500 pages/month',
        ocr: '200 pages/month',
      },
      drive: {
        fileSize: '100MB per file',
        sharing: 'External + Guest access',
      },
      crm: {
        contacts: '500',
        campaigns: '10 active',
      },
      tasks: {
        automations: '20 active',
        templates: '10',
      },
      workflows: {
        builderAccess: 'Advanced',
        runs: '500/month',
      },
      inventory: {
        items: '500',
        locations: '5',
      },
      finance: {
        transactions: '500/month',
        reports: 'Advanced',
      },
    },
    cta: 'Start Trial',
    popular: true,
  },
  {
    name: 'Business',
    description: 'For larger teams and businesses with advanced needs.',
    price: '$199',
    priceDetails: 'per workspace/month',
    features: [
      'Up to 100 team members',
      'Advanced features',
      'Priority support',
      'API access',
      'Custom integrations',
      'SSO & SAML',
      'Audit logs',
    ],
    limits: {
      workspace: {
        members: '100 members',
        storage: '1TB',
      },
      ai: {
        credits: '10,000/month',
        modelsAccess: 'Advanced models',
      },
      calendar: {
        events: 'Unlimited',
        meetingDuration: 'Unlimited',
      },
      documents: {
        parsing: '2,000 pages/month',
        ocr: '1,000 pages/month',
      },
      drive: {
        fileSize: '1GB per file',
        sharing: 'External + Guest access',
      },
      crm: {
        contacts: 'Unlimited',
        campaigns: '50 active',
      },
      tasks: {
        automations: '100 active',
        templates: 'Unlimited',
      },
      workflows: {
        builderAccess: 'Advanced',
        runs: '5,000/month',
      },
      inventory: {
        items: 'Unlimited',
        locations: '20',
      },
      finance: {
        transactions: 'Unlimited',
        reports: 'Advanced + Custom',
      },
    },
    cta: 'Contact Sales',
    popular: false,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations.',
    price: 'Custom Pricing',
    features: [
      'Unlimited team members',
      'Custom storage',
      'Custom AI models',
      'Dedicated support',
      'Custom contracts',
      'On-premise options',
      'SLA guarantee',
      'SSO & SAML',
      'Advanced analytics',
      'Custom training',
      'Audit logs',
      'Advanced security',
    ],
    limits: {
      storage: 'Custom',
      users: 'Unlimited',
      aiCredits: 'Custom',
      apiCalls: 'Unlimited',
      automations: 'Unlimited',
      customFields: 'Unlimited',
    },
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'How does usage-based pricing work?',
    answer:
      "You only pay for what you use. Core features are included in all plans with different usage limits. When you exceed these limits, you'll be charged based on your additional usage.",
  },
  {
    question: 'Can I switch between plans?',
    answer:
      'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.',
  },
  {
    question: 'What happens if I exceed my plan limits?',
    answer:
      "You'll be notified when approaching your limits. You can either upgrade to a higher plan or pay for additional usage at our standard overage rates.",
  },
  {
    question: 'Do you offer custom enterprise solutions?',
    answer:
      "Yes, our enterprise plan can be fully customized to meet your organization's specific needs, including custom integrations, dedicated support, and special security requirements.",
  },
];

const comparisons = {
  'Workspace Features': {
    'Team members': {
      Free: '5 members',
      Pro: '10 members',
      Business: '100 members',
      Enterprise: 'Unlimited',
    },
    'Storage space': {
      Free: '500MB',
      Pro: '50GB',
      Business: '1TB',
      Enterprise: 'Custom',
    },
    'Guest access': {
      Free: false,
      Pro: true,
      Business: true,
      Enterprise: true,
    },
  },
  'AI Features': {
    'Monthly credits': {
      Free: '100',
      Pro: '1,000',
      Business: '10,000',
      Enterprise: 'Custom',
    },
    'Model access': {
      Free: 'Basic only',
      Pro: 'Advanced',
      Business: 'Advanced models',
      Enterprise: 'Custom models',
    },
  },
  'Calendar & Meetings': {
    'Monthly events': {
      Free: '100',
      Pro: 'Unlimited',
      Business: 'Unlimited',
      Enterprise: 'Unlimited',
    },
    'Meeting duration': {
      Free: '40 min',
      Pro: 'Unlimited',
      Business: 'Unlimited',
      Enterprise: 'Unlimited',
    },
    'Recording storage': {
      Free: false,
      Pro: true,
      Business: true,
      Enterprise: true,
    },
  },
  'Documents & Storage': {
    'OCR processing': {
      Free: '20 pages/month',
      Pro: '200 pages/month',
      Business: '1,000 pages/month',
      Enterprise: 'Unlimited',
    },
    'File size limit': {
      Free: '25MB',
      Pro: '100MB',
      Business: '1GB',
      Enterprise: 'Custom',
    },
  },
  Security: {
    'SSO & SAML': {
      Free: false,
      Pro: false,
      Business: true,
      Enterprise: true,
    },
    'Audit logs': {
      Free: false,
      Pro: true,
      Business: true,
      Enterprise: true,
    },
    'Custom security policies': {
      Free: false,
      Pro: false,
      Business: true,
      Enterprise: true,
    },
  },
};

const extraComparisons = {
  'Productivity Tools': {
    'Task automations': {
      Free: '5/workspace',
      Pro: '20/workspace',
      Business: '100/workspace',
      Enterprise: 'Unlimited',
    },
    'Workflow templates': {
      Free: '3',
      Pro: '10',
      Business: 'Unlimited',
      Enterprise: 'Custom',
    },
    'API rate limits': {
      Free: '1,000/day',
      Pro: '5,000/day',
      Business: '5,0000/day',
      Enterprise: 'Custom',
    },
  },
  'Analytics & Reporting': {
    'Custom dashboards': {
      Free: '1',
      Pro: '5',
      Business: '10',
      Enterprise: 'Unlimited',
    },
    'Data retention': {
      Free: '30 days',
      Pro: '1 year',
      Business: '2 years',
      Enterprise: 'Custom',
    },
    'Export options': {
      Free: 'Basic',
      Pro: 'Advanced',
      Business: 'Advanced',
      Enterprise: 'Enterprise',
    },
  },
  Collaboration: {
    'Guest users': {
      Free: false,
      Pro: '5/workspace',
      Business: 'Unlimited',
      Enterprise: 'Unlimited',
    },
    'Shared workspaces': {
      Free: '1',
      Pro: '5',
      Business: 'Unlimited',
      Enterprise: 'Unlimited',
    },
    'Team templates': {
      Free: false,
      Pro: true,
      Business: true,
      Enterprise: true,
    },
  },
};

const allComparisons = { ...comparisons, ...extraComparisons };

const metricCategories = {
  workspace: {
    icon: <Building className="h-4 w-4" />,
    label: 'Workspace',
  },
  storage: {
    icon: <HardDrive className="h-4 w-4" />,
    label: 'Storage',
  },
  ai: {
    icon: <Bot className="h-4 w-4" />,
    label: 'AI & Automation',
  },
  productivity: {
    icon: <Zap className="h-4 w-4" />,
    label: 'Productivity',
  },
  collaboration: {
    icon: <Users2 className="h-4 w-4" />,
    label: 'Collaboration',
  },
  analytics: {
    icon: <BarChart3 className="h-4 w-4" />,
    label: 'Analytics',
  },
};

const PlanCard = ({ plan }: { plan: (typeof plans)[number] }) => (
  <Card
    className={cn(
      'relative flex flex-col overflow-hidden transition-all duration-300',
      'from-background to-muted/20 bg-gradient-to-b',
      plan.popular && 'border-primary shadow-lg',
      plan.name === 'Business' && 'col-span-full lg:col-span-1',
      plan.name === 'Enterprise' &&
        'from-dynamic-light-red/30 via-dynamic-light-pink/40 to-dynamic-light-blue/60 text-background border-foreground/50 col-span-full border-2 bg-gradient-to-br'
    )}
  >
    {plan.popular && (
      <div className="bg-primary absolute inset-x-0 top-0 h-1 opacity-80" />
    )}

    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h2
            className={cn(
              'text-2xl font-bold',
              plan.name === 'Enterprise' && 'text-foreground'
            )}
          >
            {plan.name}
          </h2>
          {plan.popular && (
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
              Most Popular
            </span>
          )}
        </div>
        <p
          className={cn(
            'text-muted-foreground mt-2 text-sm',
            plan.name === 'Enterprise' && 'text-foreground'
          )}
        >
          {plan.description}
        </p>
      </div>

      {plan.name === 'Enterprise' || (
        <div
          className={cn(
            'bg-background/50 mb-6 rounded-lg border p-4 text-center',
            plan.name === 'Enterprise' &&
              'bg-background/20 border-foreground/30 text-foreground'
          )}
        >
          <div
            className={cn(
              'flex items-end gap-2',
              plan.name === 'Enterprise' && 'items-center justify-center'
            )}
          >
            <span className="text-3xl font-bold lg:text-4xl">{plan.price}</span>
            {plan.priceDetails && (
              <span className="text-muted-foreground mb-1 text-sm">
                {plan.priceDetails}
              </span>
            )}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid gap-4 lg:grid-cols-2">
          <div
            className={cn(
              'bg-background/50 space-y-2 rounded-lg border p-3',
              plan.name === 'Enterprise' &&
                'bg-background/20 border-foreground/30 text-foreground'
            )}
          >
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-2 text-xs font-medium',
                plan.name === 'Enterprise' && 'text-foreground'
              )}
            >
              {metricCategories.workspace.icon} Workspace
            </div>
            <div className="text-sm font-semibold">
              {plan.limits.workspace?.amount || 'Unlimited'}
            </div>
          </div>
          <div
            className={cn(
              'bg-background/50 space-y-2 rounded-lg border p-3',
              plan.name === 'Enterprise' &&
                'bg-background/20 border-foreground/30 text-foreground'
            )}
          >
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-2 text-xs font-medium',
                plan.name === 'Enterprise' && 'text-foreground'
              )}
            >
              {metricCategories.storage.icon} Storage
            </div>
            <div className="text-sm font-semibold">
              {plan.limits.workspace?.storage || 'Custom'}
            </div>
          </div>
          <div
            className={cn(
              'bg-background/50 space-y-2 rounded-lg border p-3',
              plan.name === 'Enterprise' &&
                'bg-background/20 border-foreground/30 text-foreground'
            )}
          >
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-2 text-xs font-medium',
                plan.name === 'Enterprise' && 'text-foreground'
              )}
            >
              {metricCategories.ai.icon} AI Credits
            </div>
            <div className="text-sm font-semibold">
              {plan.limits.ai?.credits || 'Custom'}
            </div>
          </div>
          <div
            className={cn(
              'bg-background/50 space-y-2 rounded-lg border p-3',
              plan.name === 'Enterprise' &&
                'bg-background/20 border-foreground/30 text-foreground'
            )}
          >
            <div
              className={cn(
                'text-muted-foreground flex items-center gap-2 text-xs font-medium',
                plan.name === 'Enterprise' && 'text-foreground'
              )}
            >
              {metricCategories.collaboration.icon} Team Size
            </div>
            <div className="text-sm font-semibold">
              {plan.limits.workspace?.members || 'Unlimited'}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3">
          <div
            className={cn(
              'text-sm font-semibold',
              plan.name === 'Enterprise' && 'text-foreground'
            )}
          >
            Included Features
          </div>
          <ul
            className={cn(
              'text-muted-foreground grid gap-2 text-sm',
              plan.name === 'Business' && 'md:grid-cols-2 lg:grid-cols-1',
              plan.name === 'Enterprise' &&
                'text-foreground md:grid-cols-2 lg:grid-cols-3'
            )}
          >
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          className={cn(
            'mt-6 w-full',
            plan.name === 'Enterprise' && 'bg-background text-foreground'
          )}
          size="lg"
          variant={plan.popular ? 'default' : 'outline'}
          disabled
        >
          Coming Soon
        </Button>
      </div>
    </div>
  </Card>
);

const categoryIcons = {
  'Workspace Features': <Building2 className="h-4 w-4" />,
  'AI Features': <Bot className="h-4 w-4" />,
  'Calendar & Meetings': <CalendarDays className="h-4 w-4" />,
  'Documents & Storage': <FileStack className="h-4 w-4" />,
  'Project Management': <GanttChartSquare className="h-4 w-4" />,
  'Storage & Files': <HardDrive className="h-4 w-4" />,
  'Inventory Management': <Archive className="h-4 w-4" />,
  Security: <ShieldCheck className="h-4 w-4" />,
  Administration: <Settings className="h-4 w-4" />,
  'Productivity Tools': <Zap className="h-4 w-4" />,
  'Analytics & Reporting': <BarChart3 className="h-4 w-4" />,
  Collaboration: <Network className="h-4 w-4" />,
  'Resource Management': <Group className="h-4 w-4" />,
  'Business Tools': <Briefcase className="h-4 w-4" />,
  'Integration & API': <Boxes className="h-4 w-4" />,
  'Financial Tools': <Calculator className="h-4 w-4" />,
};

export default function PricingPage() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="container relative mx-auto mt-8 flex max-w-7xl flex-col gap-6 px-3 py-16 lg:gap-14 lg:py-24">
      {/* Background decoration */}
      <div className="absolute left-0 right-0 top-0 -z-10 h-[400px] rounded-t-lg bg-gradient-to-b from-transparent to-transparent" />

      <div className="mb-16 text-center">
        {locale !== 'vi' && (
          <span className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            {t('common.pricing_hook')}
          </span>
        )}

        <h1
          className={cn(
            'mb-4 text-2xl font-bold tracking-tight md:text-4xl lg:text-6xl',
            locale === 'vi' && 'text-5xl md:text-7xl'
          )}
        >
          <GradientHeadline>{t('common.usage_based_pricing')}</GradientHeadline>
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-balance text-lg">
          {t('common.usage_based_pricing_description')}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} />
        ))}
      </div>

      {/* Enhanced Comparison Table */}
      <section className="mt-24 scroll-mt-24" id="comparison">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold">Compare Plans</h2>
          <p className="text-muted-foreground mt-2">
            Detailed feature comparison across all plans
          </p>
        </div>

        <div className="bg-background relative overflow-hidden rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[300px]">Features</TableHead>
                  <TableHead>
                    <div className="text-center">
                      <div className="font-bold">{t('common.free')}</div>
                      <div className="text-muted-foreground text-sm">$0</div>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="text-center">
                      <div className="font-bold">Pro</div>
                      <div className="text-muted-foreground text-sm">
                        $25/workspace
                      </div>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="text-center">
                      <div className="font-bold">Business</div>
                      <div className="text-muted-foreground text-sm">
                        $199/workspace
                      </div>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="text-center">
                      <div className="font-bold">Enterprise</div>
                      <div className="text-muted-foreground text-sm">
                        Custom pricing
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(allComparisons).map(([category, features]) => (
                  <Fragment key={category}>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={5}>
                        <div className="flex items-center gap-2 font-medium">
                          {
                            categoryIcons[
                              category as keyof typeof categoryIcons
                            ]
                          }
                          {category}
                        </div>
                      </TableCell>
                    </TableRow>
                    {Object.entries(features).map(([feature, values]) => (
                      <TableRow key={feature} className="hover:bg-muted/20">
                        <TableCell className="font-medium">{feature}</TableCell>
                        {(
                          ['Free', 'Pro', 'Business', 'Enterprise'] as const
                        ).map((plan) => (
                          <TableCell key={plan} className="text-center">
                            {typeof values[plan] === 'boolean' ? (
                              values[plan] ? (
                                <Check className="text-primary mx-auto h-4 w-4" />
                              ) : (
                                <Minus className="text-muted-foreground mx-auto h-4 w-4" />
                              )
                            ) : (
                              <span className="text-sm">{values[plan]}</span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* FAQ section with improved styling */}
      <section className="bg-muted/50 mt-32 rounded-2xl px-6 py-12 lg:px-8 lg:py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <Accordion
          type="single"
          collapsible
          className="mx-auto grid max-w-3xl gap-4"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
}
