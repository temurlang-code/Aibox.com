import { tools, type Tool, type InsertTool, ToolCategory, type ToolCategoryType } from "@shared/schema";
import { User, InsertUser, users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations (keeping from original)
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tool operations
  getTool(id: number): Promise<Tool | undefined>;
  getAllTools(category?: ToolCategoryType): Promise<Tool[]>;
  searchTools(query: string): Promise<Tool[]>;
  getFeaturedTools(): Promise<Tool[]>;
  getPopularTools(): Promise<Tool[]>;
  createTool(tool: InsertTool): Promise<Tool>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Tool methods
  async getTool(id: number): Promise<Tool | undefined> {
    const [tool] = await db.select().from(tools).where(eq(tools.id, id));
    return tool || undefined;
  }

  async getAllTools(category?: ToolCategoryType): Promise<Tool[]> {
    if (!category || category === ToolCategory.ALL) {
      return await db.select().from(tools);
    }
    
    return await db.select().from(tools).where(eq(tools.category, category));
  }

  async searchTools(query: string): Promise<Tool[]> {
    const lowercaseQuery = query.toLowerCase();
    
    // Get all tools first (database doesn't support complex text search without extensions)
    const allTools = await db.select().from(tools);
    
    // Filter on the application level
    return allTools.filter(tool => {
      return (
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery) ||
        (tool.tags as string[]).some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    });
  }

  async getFeaturedTools(): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.isFeatured, true));
  }

  async getPopularTools(): Promise<Tool[]> {
    return await db.select().from(tools).where(eq(tools.isPopular, true));
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const [tool] = await db.insert(tools).values(insertTool).returning();
    return tool;
  }
}

// For backward compatibility, keep MemStorage for initial data population
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private aiTools: Map<number, Tool>;
  currentUserId: number;
  currentToolId: number;

  constructor() {
    this.users = new Map();
    this.aiTools = new Map();
    this.currentUserId = 1;
    this.currentToolId = 1;
    this.initializeTools();
  }

  // User methods (keeping from original)
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Tool methods
  async getTool(id: number): Promise<Tool | undefined> {
    return this.aiTools.get(id);
  }

  async getAllTools(category?: ToolCategoryType): Promise<Tool[]> {
    const allTools = Array.from(this.aiTools.values());
    
    if (!category || category === ToolCategory.ALL) {
      return allTools;
    }
    
    return allTools.filter(tool => tool.category === category);
  }

  async searchTools(query: string): Promise<Tool[]> {
    const lowercaseQuery = query.toLowerCase();
    const allTools = Array.from(this.aiTools.values());
    
    return allTools.filter(tool => {
      return (
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery) ||
        (tool.tags as string[]).some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    });
  }

  async getFeaturedTools(): Promise<Tool[]> {
    const allTools = Array.from(this.aiTools.values());
    return allTools.filter(tool => tool.isFeatured);
  }

  async getPopularTools(): Promise<Tool[]> {
    const allTools = Array.from(this.aiTools.values());
    return allTools.filter(tool => tool.isPopular);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.currentToolId++;
    const tool: Tool = { ...insertTool, id };
    this.aiTools.set(id, tool);
    return tool;
  }

  // Initialize with sample tools
  private initializeTools() {
    const tools: InsertTool[] = [
      {
        name: "NeuralPainter",
        description: "Advanced image generation AI capable of creating photorealistic images from text descriptions with exceptional detail.",
        category: ToolCategory.IMAGE,
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 490, // 4.9
        tags: ["image generation", "photorealistic", "text-to-image"],
        features: [
          "Photorealistic image generation from text prompts",
          "Style transfer capabilities with over 50 artistic styles",
          "Image editing and enhancement tools",
          "Batch processing for multiple images",
          "API access for integration with other applications"
        ],
        useCases: [
          {
            title: "Art & Design",
            description: "Create concept art, illustrations, and design assets quickly.",
            icon: "palette",
            iconColor: "primary"
          },
          {
            title: "Marketing",
            description: "Generate unique visuals for campaigns and social media.",
            icon: "ad",
            iconColor: "secondary"
          },
          {
            title: "Game Development",
            description: "Quickly prototype environments, characters, and assets.",
            icon: "gamepad",
            iconColor: "accent"
          }
        ],
        isFeatured: true,
        isPopular: false,
        websiteUrl: "https://neuralpainter.ai",
        icon: "paint-brush",
        iconColor: "purple",
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        name: "LinguaGenius",
        description: "State-of-the-art language model that can write essays, stories, code, and more with human-like understanding.",
        category: ToolCategory.TEXT,
        imageUrl: "https://images.unsplash.com/photo-1655720837653-b49ce1e24169?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 480, // 4.8
        tags: ["text generation", "language model", "writing assistant"],
        features: [
          "Human-like text generation for essays, stories, and more",
          "Code generation and explanation across multiple languages",
          "Context-aware responses and continuations",
          "Multilingual support for over 50 languages",
          "Customizable tone and style settings"
        ],
        useCases: [
          {
            title: "Content Creation",
            description: "Generate articles, stories, and marketing copy.",
            icon: "file-alt",
            iconColor: "primary"
          },
          {
            title: "Education",
            description: "Create learning materials and explanations.",
            icon: "graduation-cap",
            iconColor: "secondary"
          },
          {
            title: "Programming",
            description: "Get help with coding tasks and debugging.",
            icon: "code",
            iconColor: "accent"
          }
        ],
        isFeatured: true,
        isPopular: false,
        websiteUrl: "https://linguagenius.ai",
        icon: "brain",
        iconColor: "blue",
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        name: "SonicSynth",
        description: "Voice cloning and audio generation tool that creates natural-sounding speech and can mimic any voice with just seconds of sample audio.",
        category: ToolCategory.AUDIO,
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 470, // 4.7
        tags: ["audio generation", "voice cloning", "text-to-speech"],
        features: [
          "Voice cloning with minimal sample audio",
          "Natural-sounding text-to-speech conversion",
          "Emotional tone and inflection control",
          "Background music and sound effect generation",
          "Real-time voice transformation"
        ],
        useCases: [
          {
            title: "Content Creation",
            description: "Create voiceovers for videos and podcasts.",
            icon: "microphone",
            iconColor: "primary"
          },
          {
            title: "Accessibility",
            description: "Generate audio versions of written content.",
            icon: "universal-access",
            iconColor: "secondary"
          },
          {
            title: "Entertainment",
            description: "Produce custom audio for games and apps.",
            icon: "headphones",
            iconColor: "accent"
          }
        ],
        isFeatured: true,
        isPopular: false,
        websiteUrl: "https://sonicsynth.ai",
        icon: "music",
        iconColor: "green",
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        name: "CodeAssist",
        description: "AI that writes, explains, and optimizes code across 20+ programming languages.",
        category: ToolCategory.CODE,
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 475, // 4.75
        tags: ["code generation", "programming", "developer tools"],
        features: [
          "Code generation from natural language descriptions",
          "Bug detection and fixing",
          "Code explanation and documentation",
          "Support for 20+ programming languages",
          "Integration with popular IDEs"
        ],
        useCases: [
          {
            title: "Software Development",
            description: "Accelerate coding with AI assistance.",
            icon: "code",
            iconColor: "primary"
          },
          {
            title: "Learning",
            description: "Understand complex code through explanations.",
            icon: "graduation-cap",
            iconColor: "secondary"
          },
          {
            title: "Optimization",
            description: "Improve code performance and readability.",
            icon: "tachometer-alt",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: true,
        websiteUrl: "https://codeassist.dev",
        icon: "code",
        iconColor: "blue",
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        name: "VideoGenius",
        description: "Create professional videos from text prompts, including animation and special effects.",
        category: ToolCategory.VIDEO,
        imageUrl: "https://images.unsplash.com/photo-1626379953822-baec19c3accd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 460, // 4.6
        tags: ["video generation", "animation", "special effects"],
        features: [
          "Text-to-video generation",
          "Animated character creation",
          "Special effects and transitions",
          "Custom scene composition",
          "Video editing and enhancement"
        ],
        useCases: [
          {
            title: "Marketing",
            description: "Create engaging ads and promotional content.",
            icon: "ad",
            iconColor: "primary"
          },
          {
            title: "Education",
            description: "Produce educational videos and tutorials.",
            icon: "chalkboard-teacher",
            iconColor: "secondary"
          },
          {
            title: "Entertainment",
            description: "Generate animated stories and content.",
            icon: "film",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: true,
        websiteUrl: "https://videogenius.ai",
        icon: "video",
        iconColor: "purple",
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() // 4 days ago
      },
      {
        name: "DataSense",
        description: "Automated data analysis and visualization tool powered by machine learning.",
        category: ToolCategory.DATA,
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 470, // 4.7
        tags: ["data analysis", "visualization", "business intelligence"],
        features: [
          "Automated pattern detection in data",
          "Interactive visualization generation",
          "Predictive analytics and forecasting",
          "Natural language querying for data",
          "Automated report generation"
        ],
        useCases: [
          {
            title: "Business Analytics",
            description: "Extract actionable insights from business data.",
            icon: "chart-line",
            iconColor: "primary"
          },
          {
            title: "Research",
            description: "Analyze and visualize research findings.",
            icon: "flask",
            iconColor: "secondary"
          },
          {
            title: "Finance",
            description: "Model and predict financial trends.",
            icon: "dollar-sign",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: true,
        websiteUrl: "https://datasense.ai",
        icon: "chart-line",
        iconColor: "green",
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        name: "TranslatePro",
        description: "Advanced neural translation system supporting over 100 languages with context awareness.",
        category: ToolCategory.TEXT,
        imageUrl: "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 465, // 4.65
        tags: ["translation", "language", "localization"],
        features: [
          "Neural machine translation for 100+ languages",
          "Context-aware translation for improved accuracy",
          "Dialect and slang understanding",
          "Technical and specialized terminology support",
          "Real-time document translation"
        ],
        useCases: [
          {
            title: "Business",
            description: "Localize content for global markets.",
            icon: "globe",
            iconColor: "primary"
          },
          {
            title: "Travel",
            description: "Overcome language barriers while traveling.",
            icon: "plane",
            iconColor: "secondary"
          },
          {
            title: "Education",
            description: "Access educational content in any language.",
            icon: "book",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: true,
        websiteUrl: "https://translatepro.ai",
        icon: "language",
        iconColor: "yellow",
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
      },
      {
        name: "ChatGenius",
        description: "Advanced conversational AI that can handle complex dialogues, answer questions, provide recommendations, and more.",
        category: ToolCategory.TEXT,
        imageUrl: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 480, // 4.8
        tags: ["conversation", "customer support", "chatbot"],
        features: [
          "Human-like conversational abilities",
          "Knowledge base integration",
          "Multi-turn dialogue management",
          "Personality customization",
          "Sentiment analysis and emotional intelligence"
        ],
        useCases: [
          {
            title: "Customer Support",
            description: "Provide 24/7 assistance to customers.",
            icon: "headset",
            iconColor: "primary"
          },
          {
            title: "Virtual Assistant",
            description: "Create personal AI assistants with personality.",
            icon: "robot",
            iconColor: "secondary"
          },
          {
            title: "Education",
            description: "Build interactive tutoring and learning companions.",
            icon: "graduation-cap",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://chatgenius.ai",
        icon: "comments",
        iconColor: "blue",
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      },
      {
        name: "AudioCraft",
        description: "Create custom music, sound effects, and ambient audio using text prompts. Perfect for creators and developers.",
        category: ToolCategory.AUDIO,
        imageUrl: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 470, // 4.7
        tags: ["audio generation", "music", "sound effects"],
        features: [
          "Text-to-music generation",
          "Custom sound effect creation",
          "Ambient soundscape design",
          "Audio style transfer",
          "Loop creation and mixing"
        ],
        useCases: [
          {
            title: "Music Production",
            description: "Generate musical elements and ideas.",
            icon: "music",
            iconColor: "primary"
          },
          {
            title: "Game Development",
            description: "Create audio assets for games and apps.",
            icon: "gamepad",
            iconColor: "secondary"
          },
          {
            title: "Content Creation",
            description: "Add custom audio to videos and podcasts.",
            icon: "podcast",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://audiocraft.ai",
        icon: "music",
        iconColor: "green",
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        name: "SketchMind",
        description: "Turn rough sketches into polished, professional artwork with AI enhancement and style transfer capabilities.",
        category: ToolCategory.IMAGE,
        imageUrl: "https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 490, // 4.9
        tags: ["sketch enhancement", "illustration", "style transfer"],
        features: [
          "Sketch-to-image conversion",
          "Multiple artistic style transfers",
          "Resolution enhancement",
          "Digital painting automation",
          "Drawing assistance and guidance"
        ],
        useCases: [
          {
            title: "Illustration",
            description: "Transform rough concepts into finished artwork.",
            icon: "pencil-alt",
            iconColor: "primary"
          },
          {
            title: "UI/UX Design",
            description: "Convert wireframes into polished mockups.",
            icon: "desktop",
            iconColor: "secondary"
          },
          {
            title: "Education",
            description: "Teach art techniques through AI demonstration.",
            icon: "paintbrush",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://sketchmind.art",
        icon: "pencil-alt",
        iconColor: "purple",
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        name: "VideoMaster",
        description: "Automated video editing, enhancement, and generation based on text input. Create professional videos in minutes.",
        category: ToolCategory.VIDEO,
        imageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 460, // 4.6
        tags: ["video editing", "enhancement", "auto-captioning"],
        features: [
          "Automated video editing from raw footage",
          "Color grading and enhancement",
          "Audio cleaning and normalization",
          "Auto-captioning and subtitling",
          "Content-aware editing decisions"
        ],
        useCases: [
          {
            title: "Content Creation",
            description: "Streamline video production workflow.",
            icon: "video",
            iconColor: "primary"
          },
          {
            title: "Marketing",
            description: "Create professional marketing videos quickly.",
            icon: "ad",
            iconColor: "secondary"
          },
          {
            title: "Social Media",
            description: "Generate platform-optimized video content.",
            icon: "share",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://videomaster.pro",
        icon: "film",
        iconColor: "red",
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
      },
      {
        name: "DevGenius",
        description: "AI-powered coding assistant that generates code, fixes bugs, and provides explanations across multiple programming languages.",
        category: ToolCategory.CODE,
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 480, // 4.8
        tags: ["code generation", "debugging", "documentation"],
        features: [
          "Code generation from natural language",
          "Bug detection and fixing",
          "Code explanation and documentation",
          "Refactoring suggestions",
          "Performance optimization"
        ],
        useCases: [
          {
            title: "Software Development",
            description: "Speed up development with AI assistance.",
            icon: "code",
            iconColor: "primary"
          },
          {
            title: "Education",
            description: "Learn programming with interactive guidance.",
            icon: "graduation-cap",
            iconColor: "secondary"
          },
          {
            title: "Code Maintenance",
            description: "Keep codebases clean and optimized.",
            icon: "tools",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://devgenius.dev",
        icon: "code-branch",
        iconColor: "yellow",
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        name: "AIAnalyst",
        description: "Intelligent data analysis platform that extracts insights, creates visualizations, and generates reports from your data.",
        category: ToolCategory.DATA,
        imageUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300&q=80",
        rating: 470, // 4.7
        tags: ["data analysis", "visualization", "reporting"],
        features: [
          "Automated insight extraction",
          "Dynamic visualization generation",
          "Natural language data querying",
          "Pattern recognition and anomaly detection",
          "Automated report compilation"
        ],
        useCases: [
          {
            title: "Business Intelligence",
            description: "Transform raw data into actionable insights.",
            icon: "chart-pie",
            iconColor: "primary"
          },
          {
            title: "Research",
            description: "Analyze complex datasets efficiently.",
            icon: "flask",
            iconColor: "secondary"
          },
          {
            title: "Marketing",
            description: "Track and optimize campaign performance.",
            icon: "bullhorn",
            iconColor: "accent"
          }
        ],
        isFeatured: false,
        isPopular: false,
        websiteUrl: "https://aianalyst.tech",
        icon: "robot",
        iconColor: "teal",
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      }
    ];

    // Insert all tools
    tools.forEach(tool => {
      this.createTool(tool);
    });
  }
}

export const storage = new DatabaseStorage();
