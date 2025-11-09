interface BlogProps {
  onNavigate: (page: string) => void;
}

export const Blog = ({ onNavigate }: BlogProps) => {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">Blog</h1>
      <article className="prose-ai space-y-6 text-lg">
        <p>
          Welcome to the blog section. This space will contain updates, thoughts, and explorations
          related to the P.E.S. project and its ongoing development.
        </p>
        <p>
          More content coming soon...
        </p>
      </article>
    </div>
  );
};
