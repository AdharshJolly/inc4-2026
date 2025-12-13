export const Marquee = () => {
  const items = [
    "InC4 2026",
    "August 07-08, 2026",
    "CHRIST University, Bengaluru",
    // "IEEE Indexed",

    "Call for Papers Open",
  ];

  return (
    <div className="bg-primary py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="mx-8 text-primary-foreground font-medium text-sm inline-flex items-center gap-3"
          >
            <span className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};
