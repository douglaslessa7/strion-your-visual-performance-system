const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-bold tracking-tight text-foreground">STRION</p>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Strion. Visual performance optimization.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
