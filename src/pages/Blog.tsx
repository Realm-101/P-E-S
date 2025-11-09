interface BlogProps {
  onNavigate: (page: string) => void;
}

export const Blog = ({ onNavigate }: BlogProps) => {
  const blogPosts = [
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
