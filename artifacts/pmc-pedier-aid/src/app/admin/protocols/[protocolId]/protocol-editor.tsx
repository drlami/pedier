"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, PlusCircle, Save } from "lucide-react";
import type { SerializableProtocol } from "@/lib/protocols/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface ProtocolEditorProps {
  protocol: SerializableProtocol | null;
}

export function ProtocolEditor({ protocol }: ProtocolEditorProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { register, control, handleSubmit, formState: { errors } } = useForm<SerializableProtocol>({
    defaultValues: protocol || {
      id: "",
      name: "",
      system: "",
      description: "",
      image: { url: "", hint: "" },
      questions: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const onSubmit = (data: SerializableProtocol) => {
    console.log("Form Data:", data);
    toast({
      title: "Protocol Saved!",
      description: `The protocol "${data.name}" has been successfully saved.`,
    });
    setLocation("/admin/protocols");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold text-lg">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Protocol Name</Label>
            <Input id="name" {...register("name", { required: "Name is required" })} />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="id">Protocol ID (e.g., 'acute-seizure')</Label>
            <Input id="id" {...register("id", { required: "ID is required" })} disabled={!!protocol} />
             {errors.id && <p className="text-destructive text-sm mt-1">{errors.id.message}</p>}
          </div>
        </div>
        <div>
            <Label htmlFor="system">Clinical System (Sidebar Category)</Label>
            <Input id="system" {...register("system", { required: "System is required" })} />
            {errors.system && <p className="text-destructive text-sm mt-1">{errors.system.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description", { required: "Description is required" })} />
          {errors.description && <p className="text-destructive text-sm mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold text-lg">Assessment Questions</h3>
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 p-3 border rounded-md bg-secondary/30 relative">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label>Question Text</Label>
                    <Input {...register(`questions.${index}.questionText` as const, { required: true })} />
                </div>
                <div>
                    <Label>Question ID (unique key)</Label>
                    <Input {...register(`questions.${index}.id` as const, { required: true })} />
                </div>
             </div>
             <div>
                <Label>Question Type</Label>
                <Controller
                    control={control}
                    name={`questions.${index}.type` as const}
                    render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="boolean">Boolean (Yes/No)</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="select">Select (Dropdown)</SelectItem>
                                <SelectItem value="radio">Radio Group</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
             </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ id: `q${fields.length + 1}`, questionText: "", type: "boolean" })}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

       {/* Read-only sections */}
      <div className="space-y-4 p-4 border rounded-lg bg-muted/40">
        <h3 className="font-semibold text-lg">Logic & Content (Read-Only)</h3>
        <p className="text-sm text-muted-foreground">
            Editing for severity logic, management plans, drug doses, and references will be enabled once the database backend is connected.
        </p>
        <div className="p-3 border rounded-md bg-background">
            <Label className="font-medium">Severity Logic</Label>
            <pre className="mt-2 text-[10px] p-2 bg-secondary rounded-md overflow-x-auto text-muted-foreground">
                <code>{protocol?.logicStrings?.calculateSeverity || "No logic defined."}</code>
            </pre>
        </div>
        <div className="p-3 border rounded-md bg-background">
            <Label className="font-medium">Management Recommendations</Label>
            <pre className="mt-2 text-[10px] p-2 bg-secondary rounded-md overflow-x-auto text-muted-foreground">
                <code>{protocol?.logicStrings?.getManagement || "No logic defined."}</code>
            </pre>
        </div>
         <div className="p-3 border rounded-md bg-background">
            <Label className="font-medium">Drug Doses</Label>
             <pre className="mt-2 text-[10px] p-2 bg-secondary rounded-md overflow-x-auto text-muted-foreground">
                <code>{protocol?.logicStrings?.getDrugDoses || "No logic defined."}</code>
            </pre>
        </div>
         <div className="p-3 border rounded-md bg-background">
            <Label className="font-medium">References</Label>
             <pre className="mt-2 text-[10px] p-2 bg-secondary rounded-md overflow-x-auto text-muted-foreground">
                <code>{protocol?.logicStrings?.getReferences || "No logic defined."}</code>
            </pre>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {protocol ? "Save Changes" : "Create Protocol"}
        </Button>
      </div>
    </form>
  );
}
