const IndexShowcase = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Meet the Strion Index.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-16">
            A proprietary performance metric calculated from execution integrity, structural alignment, and visual trend analysis.
          </p>

          {/* Large Index Display */}
          <div className="relative inline-block">
            <div className="absolute -inset-12 bg-primary/5 rounded-full blur-3xl" />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Strion Index
              </p>
              <span className="text-8xl sm:text-9xl font-bold tracking-metric text-foreground">
                78.6
              </span>
              <p className="text-sm text-muted-foreground mt-4">
                Measured. Calibrated. Controlled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndexShowcase;
