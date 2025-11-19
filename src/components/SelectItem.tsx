import ReactMarkdown from "react-markdown";

function SelectedItem({ label }) {
  return (
    <div className="flex items-center px-2 py-1 rounded-md bg-secondary">
      <ReactMarkdown
        components={{
          p: ({ children }) => <span>{children}</span>, // Prevent block layout
        }}
      >
        {label}
      </ReactMarkdown>
    </div>
  );
}
