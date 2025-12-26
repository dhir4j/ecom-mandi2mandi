'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

const productSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  location: z.string().min(2, { message: 'Location is required.' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number.' }),
  unit: z.enum(['kg', 'quintal']),
  description: z.string().optional(),
  images: z.array(z.object({ url: z.string().url({ message: 'Please enter a valid URL.' }) })).min(1, { message: 'At least one image is required.' }),
});

type ProductFormValues = z.infer<typeof productSchema>;

type AddProductFormProps = {
  onProductAdded: () => void;
};

export function AddProductForm({ onProductAdded }: AddProductFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      location: '',
      unit: 'kg',
      images: [{ url: '' }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    name: 'images',
    control: form.control,
  });

  async function onSubmit(data: ProductFormValues) {
    setIsLoading(true);
    try {
        const response = await fetch('https://www.mandi.ramhotravels.com/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (response.ok) {
            toast({
                title: 'Product Submitted!',
                description: `${data.name} has been successfully added to your listings.`,
            });
            form.reset();
            onProductAdded();
        } else {
            const errorData = await response.json();
            toast({
                title: 'Submission Failed',
                description: errorData.error || 'There was a problem adding your product.',
                variant: 'destructive',
            });
        }
    } catch (error) {
        toast({
            title: 'Network Error',
            description: 'Could not connect to the server. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="shadow-lg border-dashed">
      <CardHeader>
        <CardTitle>List a New Product</CardTitle>
        <CardDescription>Fill out the details below to list a new item for sale.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fresh Alphanso Mangoes" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Ratnagiri" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="100" {...field} disabled={isLoading}/>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="unit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a unit" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="kg">per Kg</SelectItem>
                            <SelectItem value="quintal">per Quintal</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your product, its quality, variety, etc." {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel>Product Images</FormLabel>
              <FormDescription>Add at least one link to an image of your product.</FormDescription>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                    <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}.url`}
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex items-center gap-2">
                            <FormControl>
                                <Input placeholder="https://example.com/image.jpg" {...field} disabled={isLoading} />
                            </FormControl>
                            {fields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={isLoading}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ url: '' })} disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Image
              </Button>
            </div>


            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoading}>
              {isLoading ? 'Adding Product...' : 'Add Product to Listings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
