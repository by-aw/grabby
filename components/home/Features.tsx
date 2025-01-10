import Chip from "./Chip";

export default function Features() {
  return (
    <footer className="flex flex-wrap justify-center gap-2 mt-auto pb-4 w-full text-muted-foreground">
      <Chip text="Grab IP's" />
      <Chip text="See device info" />
      <Chip text="Live traffic" />
      <Chip text="See location info" />
      <Chip text="Analyze data" />
      <Chip text="Generate reports" />
    </footer>
  );
}
