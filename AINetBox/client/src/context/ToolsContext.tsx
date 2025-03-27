import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ToolCategory, type ToolCategoryType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ToolsContextType {
  category: ToolCategoryType;
  setCategory: (category: ToolCategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchTools: (query: string) => void;
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined);

export const ToolsProvider = ({ children }: { children: ReactNode }) => {
  const [category, setCategory] = useState<ToolCategoryType>(ToolCategory.ALL);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Update tools when category changes
  useEffect(() => {
    // Clear search query when changing categories
    setSearchQuery("");
  }, [category]);

  // Function to search tools
  const searchTools = (query: string) => {
    if (query.trim() === "") {
      setSearchQuery("");
      return;
    }

    setSearchQuery(query);
    queryClient.invalidateQueries({ queryKey: ["/api/tools/search"] });
    
    // Reset category to ALL when searching
    if (category !== ToolCategory.ALL) {
      setCategory(ToolCategory.ALL);
    }

    toast({
      title: "Searching tools",
      description: `Searching for "${query}"...`,
    });
  };

  return (
    <ToolsContext.Provider
      value={{
        category,
        setCategory,
        searchQuery,
        setSearchQuery,
        searchTools
      }}
    >
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => {
  const context = useContext(ToolsContext);
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider");
  }
  return context;
};
