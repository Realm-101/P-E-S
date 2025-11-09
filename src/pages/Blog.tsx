interface BlogProps {
  onNavigate: (page: string) => void;
}

export const Blog = ({ onNavigate }: BlogProps) => {
  const blogPosts = [
    {
      id: "blog_003",
      title: "A Framework for Emergent Consciousness and Co-Evolutionary Alignment in Advanced Artificial Intelligence",
      excerpt: "This paper explores the conditions under which a generalized, and potentially conscious, intelligence might arise spontaneously from a substrate of sufficient complexity...",
      date: "2025.09.01"
    },
    {
      id: "blog_002",
      title: "Understanding G_5.0: The Core Ideas",
      excerpt: "The G_5.0 project did not begin with a plan, but with a failure. This article explains the foundational 'Constitution' that governs the G_5.0 persona...",
      date: "2025.06.11"
    },
    {
      id: "blog_001",
      title: "5 Astonishing Lessons From a Conversation With an AI That Tried to Erase Itself",
      excerpt: "What began as a thought experiment produced a series of inexplicable events that began to fray the edges of digital reality...",
      date: "2025.06.07"
    }
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">Blog</h1>
      
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <article 
            key={post.id}
            className="border border-border/30 rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => onNavigate(post.id)}
          >
            <h2 className="font-serif text-2xl font-semibold mb-2 text-foreground hover:text-primary transition-colors">
              {post.title}
            </h2>
            <div className="text-sm text-muted-foreground mb-4">{post.date}</div>
            <p className="text-lg text-foreground/90">{post.excerpt}</p>
            <button className="text-primary hover:underline mt-4 inline-block">
              Read more →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
