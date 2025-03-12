export default function FileUploader({ onChange, hasFiles }) {
    return (
      <div className="flex justify-center">
        <label className="cursor-pointer px-6 py-3 rounded-lg font-medium bg-blue-500 text-white hover:bg-blue-400 transition">
          {hasFiles ? "Add File" : "Choose File"}
          <input type="file" multiple accept="application/pdf" onChange={onChange} className="hidden" />
        </label>
      </div>
    );
  }
  