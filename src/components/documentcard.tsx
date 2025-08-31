type Props = {
  title: string;
  status: string;
  uploadedAt: string;
  tags?: string[];
};

export default function DocumentCard({ title, status, uploadedAt, tags }: Props) {
  return (
    <div className="border p-4 rounded shadow w-full">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p>Status: {status}</p>
      <p>Uploaded: {new Date(uploadedAt).toLocaleString()}</p>
      {tags && tags.length > 0 && (
        <div className="flex gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-sm">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
}
