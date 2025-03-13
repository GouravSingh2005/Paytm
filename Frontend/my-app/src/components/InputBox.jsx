export function InputBox({ label, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="w-full text-left">
      <div className="text-sm font-medium text-left py-2">{label}</div>
      <input
        type={type}
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className="w-full px-2 py-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
