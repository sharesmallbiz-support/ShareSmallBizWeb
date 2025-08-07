import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { insertOpportunitySchema, updateOpportunitySchema } from "@shared/schema";
import type { InsertOpportunity, UpdateOpportunity, OpportunityWithUser } from "@shared/schema";
import { ArrowLeft, Plus, X } from "lucide-react";
import { z } from "zod";

// Form schema that extends the base schema with additional validation
const opportunityFormSchema = insertOpportunitySchema.extend({
  requirements: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

type OpportunityFormData = z.infer<typeof opportunityFormSchema>;

export default function OpportunityForm() {
  const { id } = useParams(); // If id exists, we're editing
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [requirementInput, setRequirementInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const isEditing = !!id;

  // Fetch existing opportunity for editing
  const { data: existingOpportunity, isLoading: isLoadingOpportunity } = useQuery({
    queryKey: ['/api/opportunities', id],
    queryFn: async () => {
      const response = await fetch(`/api/opportunities/${id}`);
      if (!response.ok) throw new Error('Failed to fetch opportunity');
      return response.json() as Promise<OpportunityWithUser>;
    },
    enabled: isEditing,
  });

  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      userId: "user4", // TODO: Get from auth context
      title: "",
      description: "",
      opportunityType: "",
      category: "",
      location: "",
      budget: "",
      timeline: "",
      requirements: [],
      contactMethod: "",
      contactInfo: "",
      tags: [],
      featured: false,
    },
  });

  // Update form when existing opportunity loads
  useEffect(() => {
    if (existingOpportunity && isEditing) {
      form.reset({
        userId: existingOpportunity.userId,
        title: existingOpportunity.title,
        description: existingOpportunity.description,
        opportunityType: existingOpportunity.opportunityType,
        category: existingOpportunity.category,
        location: existingOpportunity.location || "",
        budget: existingOpportunity.budget || "",
        timeline: existingOpportunity.timeline || "",
        requirements: existingOpportunity.requirements || [],
        contactMethod: existingOpportunity.contactMethod,
        contactInfo: existingOpportunity.contactInfo || "",
        tags: existingOpportunity.tags || [],
        featured: existingOpportunity.featured,
      });
    }
  }, [existingOpportunity, isEditing, form]);

  // Create opportunity mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertOpportunity) => {
      return apiRequest('POST', '/api/opportunities', data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Opportunity created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/opportunities'] });
      setLocation('/opportunities');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create opportunity. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update opportunity mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateOpportunity & { userId: string }) => {
      return apiRequest('PATCH', `/api/opportunities/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Opportunity updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['/api/opportunities', id] });
      setLocation('/opportunities');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update opportunity. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: OpportunityFormData) => {
    if (isEditing) {
      const { userId, ...updateData } = data;
      updateMutation.mutate({ ...updateData, userId });
    } else {
      createMutation.mutate(data);
    }
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = form.getValues('requirements') || [];
      form.setValue('requirements', [...currentRequirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const removeRequirement = (index: number) => {
    const currentRequirements = form.getValues('requirements') || [];
    form.setValue('requirements', currentRequirements.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  if (isEditing && isLoadingOpportunity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/opportunities')}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Opportunities
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Opportunity' : 'Post New Opportunity'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {isEditing ? 'Update your opportunity details' : 'Share a business opportunity with the community'}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? 'Update Opportunity' : 'Opportunity Details'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Opportunity Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Looking for Marketing Partnership"
                            {...field}
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Opportunity Type */}
                  <FormField
                    control={form.control}
                    name="opportunityType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opportunity Type *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-opportunity-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="collaboration">Collaboration</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                            <SelectItem value="supplier">Supplier</SelectItem>
                            <SelectItem value="hiring">Hiring</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Category *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="Services">Services</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Austin, TX or Remote"
                            {...field}
                            data-testid="input-location"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Budget */}
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Range</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., $1,000 - $5,000 or TBD"
                            {...field}
                            data-testid="input-budget"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Timeline */}
                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., 2-4 weeks or Ongoing"
                            {...field}
                            data-testid="input-timeline"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Contact Method */}
                  <FormField
                    control={form.control}
                    name="contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Contact Method *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-contact-method">
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="platform message">Platform Message</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide detailed information about the opportunity, what you're looking for, and what you can offer..."
                          className="min-h-[120px]"
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Contact Info */}
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Email address or phone number (leave blank for platform messaging)"
                          {...field}
                          data-testid="input-contact-info"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Requirements */}
                <div>
                  <Label>Requirements</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input 
                      placeholder="Add a requirement..."
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                      data-testid="input-requirement"
                    />
                    <Button 
                      type="button" 
                      onClick={addRequirement}
                      size="sm"
                      data-testid="button-add-requirement"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {(form.watch('requirements') || []).map((requirement, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded" data-testid={`requirement-${index}`}>
                        <span className="text-sm">{requirement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          data-testid={`button-remove-requirement-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-2 mb-3">
                    <Input 
                      placeholder="Add a tag..."
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      data-testid="input-tag"
                    />
                    <Button 
                      type="button" 
                      onClick={addTag}
                      size="sm"
                      data-testid="button-add-tag"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(form.watch('tags') || []).map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm" data-testid={`tag-${index}`}>
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                          data-testid={`button-remove-tag-${index}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured checkbox */}
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-featured"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Mark as Featured Opportunity
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Featured opportunities appear at the top of the list
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending || updateMutation.isPending 
                      ? (isEditing ? 'Updating...' : 'Creating...') 
                      : (isEditing ? 'Update Opportunity' : 'Post Opportunity')
                    }
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation('/opportunities')}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}