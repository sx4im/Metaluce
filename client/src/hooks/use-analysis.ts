import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Type definitions inferred from schema
type AnalysisResponse = z.infer<typeof api.analyze.get.responses[200]>;
type AnalyzeRequest = z.infer<typeof api.analyze.process.input>;

export function useAnalyses() {
  return useQuery({
    queryKey: [api.analyze.list.path],
    queryFn: async () => {
      const res = await fetch(api.analyze.list.path);
      if (!res.ok) throw new Error("Failed to fetch analyses");
      return api.analyze.list.responses[200].parse(await res.json());
    },
  });
}

export function useAnalysis(id: number) {
  return useQuery({
    queryKey: [api.analyze.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.analyze.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch analysis");
      return api.analyze.get.responses[200].parse(await res.json());
    },
    enabled: !!id && !isNaN(id),
  });
}

export function useCreateAnalysis() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const res = await fetch(api.analyze.process.path, {
        method: api.analyze.process.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.analyze.process.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Analysis failed");
      }
      return api.analyze.process.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.analyze.list.path] });
      toast({
        title: "Analysis Complete",
        description: "Your meeting notes have been processed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
